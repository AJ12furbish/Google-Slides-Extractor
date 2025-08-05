const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');

// Configuration
const OUTPUT_DIR = './downloaded_slides';
const PDF_OUTPUT_DIR = './converted_pdfs';
const COOKIES_FILE = './cookies.txt'; // Changed to .txt since it's Netscape format

// Create directories if they don't exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
if (!fs.existsSync(PDF_OUTPUT_DIR)) fs.mkdirSync(PDF_OUTPUT_DIR);

// Function to parse Netscape cookie format and convert to Puppeteer format
function parseNetscapeCookies(cookiesString) {
  const lines = cookiesString.split('\n');
  const cookies = [];
  
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.trim() === '') continue;
    
    const parts = line.split('\t');
    if (parts.length < 7) continue;
    
    const [
      domain,
      flag,        // TRUE/FALSE for host-only
      path,
      secure,      // TRUE/FALSE
      expiration,  // Unix timestamp
      name,
      value
    ] = parts;
    
    cookies.push({
      name,
      value,
      domain: domain.startsWith('.') ? domain.slice(1) : domain,
      path,
      expires: parseInt(expiration, 10),
      secure: secure === 'TRUE',
      httpOnly: false, // Netscape format doesn't specify this
      sameSite: 'unspecified' // Default value
    });
  }
  
  return cookies;
}

// Function to load cookies from file
async function loadCookies(page) {
  if (!fs.existsSync(COOKIES_FILE)) {
    console.log(`Cookies file not found: ${COOKIES_FILE}`);
    return false;
  }

  try {
    const cookiesString = fs.readFileSync(COOKIES_FILE, 'utf8');
    const cookies = parseNetscapeCookies(cookiesString);
    
    if (cookies.length === 0) {
      console.log('No valid cookies found in file');
      return false;
    }
    
    await page.setCookie(...cookies);
    console.log(`Loaded ${cookies.length} cookies successfully`);
    return true;
  } catch (error) {
    console.error('Error loading cookies:', error.message);
    return false;
  }
}

// Function to perform login
async function performLogin(page, username, password) {
  console.log('Attempting login...');
  
  // Navigate to login page
  await page.goto('https://g51edu.com/login', { waitUntil: 'networkidle2' });
  
  // Fill in login form - these selectors are examples, adjust based on actual site
  await page.type('#username', username);
  await page.type('#password', password);
  await page.click('#login-button');
  
  // Wait for navigation after login
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
  // Check if login was successful
  const isLoggedIn = await page.evaluate(() => {
    // This depends on the website. Look for an element that only appears when logged in
    return document.querySelector('.user-menu') !== null || 
           document.querySelector('a[href*="logout"]') !== null;
  });
  
  if (isLoggedIn) {
    console.log('Login successful');
    return true;
  } else {
    console.log('Login failed');
    return false;
  }
}

// Main automation function
async function automateSlidesConversion(pageUrl) {
  console.log(`Processing: ${pageUrl}`);
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  try {
    // Try loading cookies first
    const cookiesLoaded = await loadCookies(page);
    
    // Navigate to the target page
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    
    // Check if we're logged in
    const isLoggedIn = await page.evaluate(() => {
      // This depends on the website. Look for an element that only appears when logged in
      return document.querySelector('.user-menu') !== null || 
             document.querySelector('a[href*="logout"]') !== null;
    });
    
    // If not logged in and cookies didn't work, try login
    if (!isLoggedIn) {
      if (!cookiesLoaded) {
        console.log('Not logged in. Attempting login...');
        const loginSuccess = await performLogin(page, 'your_username', 'your_password');
        
        if (!loginSuccess) {
          throw new Error("Login failed. Please check your credentials or cookies.");
        }
        
        // Navigate to the target page again after login
        await page.goto(pageUrl, { waitUntil: 'networkidle2' });
      } else {
        throw new Error("Cookies loaded but still not logged in. Please check your cookies.");
      }
    }
    
    // Step 1: Extract Google Slides URL
    const slidesUrl = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="docs.google"]');
      return iframe ? iframe.getAttribute('src') : null;
    });
    
    if (!slidesUrl) throw new Error("Could not find Google Slides iframe");
    
    // Step 2: Download slides as HTML
    await page.goto(slidesUrl, { waitUntil: 'networkidle2' });
    
    const downloadResult = await page.evaluate(() => {
      return new Promise((resolve) => {
        const btag = "-caption";
        const ctag = "aria-setsize";
        const dtag = "aria-posinset";
        const node = document.querySelector(`[class$="${btag}"]`);
        const view = document.querySelector(".punch-viewer-page-wrapper");
        const size = node.getAttribute(ctag);
        const slideTitle = document.title.replace(/[\\/:*?"<>|]+/g, "");
        let data = `<html><head><meta charset='UTF-8'><title>${slideTitle}</title><style>body{margin:0;padding:0}</style></head><body>`;
        
        const func = () => {
          const svgs = Array.from(document.getElementsByTagName("svg"));
          svgs.forEach(svg => {
            const images = svg.querySelectorAll("image");
            if (images.length === 1 && svg.getBBox().width > 0 && svg.getBBox().height > 0) {
              data += svg.outerHTML;
            }
          });
          
          if (node.getAttribute(dtag) == size) {
            data += "</body></html>";
            resolve({ title: slideTitle, html: data });
          } else {
            view.click();
            setTimeout(func, 50);
          }
        };
        
        func();
      });
    });
    
    // Save HTML file
    const htmlPath = path.join(OUTPUT_DIR, `${downloadResult.title}.html`);
    fs.writeFileSync(htmlPath, downloadResult.html);
    console.log(`Downloaded: ${htmlPath}`);
    
    // Step 3: Convert to PDF
    await convertToPDF(htmlPath);
    
    console.log(`✅ Successfully processed: ${downloadResult.title}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${pageUrl}:`, error.message);
  } finally {
    await browser.close();
  }
}

// PDF conversion function
function convertToPDF(htmlPath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'convert_slides.sh');
    const command = `bash "${scriptPath}" "${htmlPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`PDF conversion error: ${stderr}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

// Example usage
(async () => {
  const urls = [
    
  ];
  for (const url of urls) {
    await automateSlidesConversion(url);
  }
})();