const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let reqCount = 0;
  page.on('request', request => {
    reqCount++;
  });

  try {
    await page.goto('http://localhost:8083', { waitUntil: 'networkidle0', timeout: 5000 });
  } catch(e) {
    //
  }
  console.log(`Total requests capturados: ${reqCount}`);

  await browser.close();
})();
