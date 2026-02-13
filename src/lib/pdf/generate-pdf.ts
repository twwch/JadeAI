import puppeteer from 'puppeteer-core';

async function getBrowser() {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const chromium = await import('@sparticuz/chromium');
    return puppeteer.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  // Dev: use local Chrome/Chromium
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  for (const path of candidates) {
    try {
      const { accessSync } = await import('fs');
      accessSync(path);
      return puppeteer.launch({ executablePath: path, headless: true });
    } catch {
      continue;
    }
  }

  throw new Error('No Chrome/Chromium found. Install Google Chrome or set CHROME_PATH.');
}

export async function generatePdf(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
