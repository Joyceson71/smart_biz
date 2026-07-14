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
    await page.exposeFunction('logBrowserError', (msg) => {
      errors.push('Browser Error: ' + msg);
    });
    await page.evaluateOnNewDocument(() => {
      window.addEventListener('error', (e) => {
        window.logBrowserError(e.message + ' at ' + e.filename + ':' + e.lineno);
      });
      window.addEventListener('unhandledrejection', (e) => {
        window.logBrowserError('Unhandled Rejection: ' + (e.reason ? e.reason.toString() : 'Unknown'));
      });
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
    
    console.log('Clicking three dots...');
    // The button has className="h-8 w-8 p-0" and contains an SVG
    // We can just click the first one we find
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const threeDots = btns.find(b => b.classList.contains('h-8') && b.classList.contains('w-8'));
      if (threeDots) threeDots.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    fs.writeFileSync('browser-errors.log', errors.join('\n'));
    console.log('Done capturing errors. Check browser-errors.log');
    await browser.close();
  } catch (e) {
    console.error('Script failed:', e);
  }
})();
