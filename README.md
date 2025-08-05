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
