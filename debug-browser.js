const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Listen for console events
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Listen for unhandled page errors
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  // Listen for failed requests
  page.on('requestfailed', request =>
    console.error('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  console.log('Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
  } catch (e) {
    console.log('Navigation ended with:', e.message);
  }
  
  console.log('Waiting an extra 2 seconds for any delayed hydration errors...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await browser.close();
})();
