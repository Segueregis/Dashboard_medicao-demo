const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
       console.log(`${msg.type()}: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log('Page error:', err.toString());
  });

  try {
    console.log("Acessando http://localhost:8083...");
    await page.goto('http://localhost:8083', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log("Página carregada sem travar o puppeteer.");
  } catch(e) {
    console.log("Erro na navegação ou timeout por loop:", e);
  }

  await browser.close();
})();
