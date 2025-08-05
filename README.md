Google Slides Extractor 

A Node.js tool that extracts embedded Google Slides from web pages and converts them to searchable PDFs. 
Features 

     Extracts Google Slides from embedded iframes on web pages
     Handles authentication via cookies or direct login
     Downloads slides as HTML files
     Converts HTML files to searchable PDFs using OCR
     Supports batch processing of multiple URLs
     

Dependencies 
System Dependencies 

     Node.js (v18 or higher)
     npm
     wkhtmltopdf
     tesseract-ocr
     

Node.js Dependencies 

     puppeteer
     

Installation 
1. Install System Dependencies 
Ubuntu/Debian 
bash
 
 
 
1
2
sudo apt update
sudo apt install -y nodejs npm wkhtmltopdf tesseract-ocr libnspr4 libnss3 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libasound2 libatk-bridge2.0-0 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 libxrandr2 xdg-utils
 
 
 
macOS 
bash
 
 
 
1
brew install node npm wkhtmltopdf tesseract
 
 
 
2. Install Node.js Dependencies 
bash
 
 
 
1
npm install
 
 
 
Configuration 
Authentication 

The tool supports two authentication methods: 
Option 1: Cookies (Recommended) 

     Log in to the target website in your browser
     Export cookies in Netscape format using a browser extension (like "cookies.txt")
     Save the cookies as cookies.txt in the project directory
     

Option 2: Direct Login 

     Edit automate.js and update the login credentials:
    javascript
     
     

 
1
const loginSuccess = await performLogin(page, 'your_username', 'your_password');
 
 
 
 Update the login form selectors if needed:
javascript
 
 

     
    1
    2
    3
    await page.type('#username', username);  // Username field selector
    await page.type('#password', password);  // Password field selector
    await page.click('#login-button');      // Login button selector
     
     
     
     

URL Processing 

The tool processes URLs sequentially. To process multiple URLs: 

     Edit automate.js and add URLs to the array:
    javascript
     
     

     
    1
    2
    3
    4
    5
    ⌄
    const urls = [
      'https://example.com/slides1',
      'https://example.com/slides2',
      // Add more URLs here
    ];
     
     
     
     

Usage 
Process Single URL 
bash
 
 
 
1
node automate.js
 
 
 
Process Multiple URLs 

Add URLs to the urls array in automate.js as shown above, then run: 
bash
 
 
 
1
node automate.js
 
 
 
Output 

     HTML files are saved in downloaded_slides/
     PDF files are saved in converted_pdfs/
     

Key Configurations 
Output Directories 

     OUTPUT_DIR = './downloaded_slides' - Directory for downloaded HTML files
     PDF_OUTPUT_DIR = './converted_pdfs' - Directory for converted PDF files
     

Cookies File 

     COOKIES_FILE = './cookies.txt' - Path to cookies file in Netscape format
     

Login Form Selectors 

     Username field: #username
     Password field: #password
     Login button: #login-button
     

URL Processing Type 

The tool processes URLs sequentially: 

     Downloads HTML for one URL
     Converts the HTML to PDF
     Moves to the next URL
     

This approach ensures that each URL is completely processed before moving to the next, making it easier to track progress and debug issues. 
Troubleshooting 
Common Issues 

     

    "Failed to launch the browser process" 
         Ensure all system dependencies are installed
         Try running with --no-sandbox and --disable-setuid-sandbox flags (already included)
         
     

    "Could not find Google Slides iframe" 
         Verify the URL contains an embedded Google Slides presentation
         Check if the page structure is different than expected
         
     

    "Cookies loaded but still not logged in" 
         Verify cookies are for the correct domain
         Check if cookies have expired
         Try the direct login method
         
     

Debug Mode 

To see what's happening during execution, run in non-headless mode: 
javascript
 
 
 
1
2
3
4
5
⌄
// In automate.js, change:
const browser = await puppeteer.launch({ 
  headless: false, // Set to false to see the browser
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
 
 
 
License 

MIT 
