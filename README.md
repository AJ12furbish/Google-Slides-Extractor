# Google Slides Extractor

A Node.js tool that extracts embedded Google Slides from web pages and converts them to searchable PDFs.

## 🚀 Features

- 📄 Extracts Google Slides from embedded iframes on web pages  
- 🔑 Handles authentication via cookies or direct login  
- 💾 Downloads slides as HTML files  
- 🔍 Converts HTML files to searchable PDFs using OCR  
- 🗂️ Supports batch processing of multiple URLs  

---

## 📦 Dependencies

### **System Dependencies**

- Node.js (v18 or higher)
- npm
- wkhtmltopdf
- tesseract-ocr

### **Node.js Dependencies**

- puppeteer

---

## 🔧 Installation

### **1. Install System Dependencies**

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y nodejs npm wkhtmltopdf tesseract-ocr libnspr4 libnss3 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libasound2 libatk-bridge2.0-0 libdrm2 libgbm1 libgtk-3-0 libnspr4 libnss3 libxrandr2 xdg-utils
```

#### macOS
```bash
brew install node npm wkhtmltopdf tesseract
```

---

### **2. Install Node.js Dependencies**

```bash
npm install
```

---

## ⚙️ Configuration

### **Authentication**

The tool supports two authentication methods:

#### ✅ Option 1: Cookies (Recommended)

1. Log in to the target website in your browser  
2. Export cookies in Netscape format using a browser extension (like `cookies.txt`)  
3. Save the cookies as `cookies.txt` in the project directory  

#### 🔑 Option 2: Direct Login

1. Edit `automate.js` and update login credentials:
   ```javascript
   const loginSuccess = await performLogin(page, 'your_username', 'your_password');
   ```
2. Update the login form selectors if needed:
   ```javascript
   await page.type('#username', username);  // Username field selector
   await page.type('#password', password);  // Password field selector
   await page.click('#login-button');       // Login button selector
   ```

---

### **URL Processing**

To process multiple URLs:

1. Edit `automate.js` and add URLs:
   ```javascript
   const urls = [
     'https://example.com/slides1',
     'https://example.com/slides2',
     // Add more URLs here
   ];
   ```

---

## ▶️ Usage

### **Process Single URL**
```bash
node automate.js
```

### **Process Multiple URLs**
Add URLs to the `urls` array in `automate.js`, then run:
```bash
node automate.js
```

---

## 📂 Output

- **HTML files:** `downloaded_slides/`  
- **PDF files:** `converted_pdfs/`  

---

## 🔑 Key Configurations

- `OUTPUT_DIR = './downloaded_slides'` → Directory for downloaded HTML files  
- `PDF_OUTPUT_DIR = './converted_pdfs'` → Directory for converted PDF files  
- `COOKIES_FILE = './cookies.txt'` → Path to cookies file in Netscape format  

### **Login Form Selectors**

- Username field: `#username`  
- Password field: `#password`  
- Login button: `#login-button`  

---

## 🔄 URL Processing Type

The tool processes URLs **sequentially**:

1. Downloads HTML for one URL  
2. Converts the HTML to PDF  
3. Moves to the next URL  

This ensures each URL is fully processed before moving on.

---

## 🛠️ Troubleshooting

### Common Issues

1. **"Failed to launch the browser process"**  
   - Check system dependencies  
   - Use `--no-sandbox` and `--disable-setuid-sandbox` flags  

2. **"Could not find Google Slides iframe"**  
   - Ensure the URL contains an embedded Google Slides presentation  
   - Page structure may differ  

3. **"Cookies loaded but still not logged in"**  
   - Verify cookies match domain  
   - Check for expired cookies  
   - Try direct login method  

---

### Debug Mode

To see browser execution:
```javascript
const browser = await puppeteer.launch({ 
  headless: false, 
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

---

## 📜 License

MIT
