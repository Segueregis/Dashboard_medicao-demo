const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let reqCount = 0;
  let hasNavigated = false;
  
  page.on('request', request => {
    reqCount++;
  });
  
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame() && frame.url() !== 'about:blank' && frame.url() !== 'http://localhost:8083/') {
      console.log('Navegou automaticamente para: ' + frame.url());
      hasNavigated = true;
    }
  });

  try {
    await page.goto('http://localhost:8083', { waitUntil: 'load', timeout: 8000 });
  } catch(e) {
     console.log("Timeout ou erro: ", e.message);
  }
  
  console.log(`Total requests capturados em 8 seg: ${reqCount}`);
  if (reqCount > 50) {
     console.log("ALERTA DE LOOP: Muitas requisições sequenciais detectadas.");
  }

  await browser.close();
})();
