export async function generatePDF(html: string): Promise<Buffer> {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    width: '431.8mm',  // Tablóide width (17 inches)
    height: '279.4mm', // Tablóide height (11 inches)
    landscape: false,
    printBackground: true,
    scale: 1,
  });
  await browser.close();
  return Buffer.from(pdf);
}

export async function generateScreenshot(html: string): Promise<Buffer> {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const screenshot = await page.screenshot({ type: 'png', fullPage: true });
  await browser.close();
  return Buffer.from(screenshot);
}

