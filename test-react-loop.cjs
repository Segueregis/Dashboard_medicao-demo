const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if(msg.text().includes('Render')) {
      console.log('BROWSER LOG:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:8083', { waitUntil: 'load', timeout: 5000 });
    // Aguarda um pouco p ver se há spam no console
    await new Promise(r => setTimeout(r, 6000));
  } catch(e) {}
  
  await browser.close();
})();
