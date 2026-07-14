const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    let errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      errors.push(err.toString());
    });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for the app to hydrate and any errors to pop up
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Navigating to /dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
    
    await new Promise(r => setTimeout(r, 2000));

    console.log('Navigating to /inventory...');
    await page.goto('http://localhost:3000/inventory', { waitUntil: 'networkidle2' });
    
    await new Promise(r => setTimeout(r, 2000));

    fs.writeFileSync('browser-errors.log', errors.join('\n'));
    console.log('Done capturing errors. Check browser-errors.log');
    await browser.close();
  } catch (e) {
    console.error('Script failed:', e);
  }
})();
