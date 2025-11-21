import { chromium } from 'playwright';

async function scrapePage(url, retryCount = 0) {
  let browser = null;
  
  try {
    // Start up a headless Chrome browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Make it look like a real Chrome browser
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();
    
    // Give pages 20 seconds max to load
    page.setDefaultTimeout(20000);
    page.setDefaultNavigationTimeout(20000);

    // Go to the page and wait until it stops loading stuff
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 20000
    });

    // Grab the info we need from the page
    const pageData = await page.evaluate(() => {
      const title = document.querySelector('title')?.innerText || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const h1 = document.querySelector('h1')?.innerText || '';
      
      return { title, metaDescription, h1 };
    });

    await browser.close();

    return {
      ...pageData,
      status: 200
    };

  } catch (error) {
    if (browser) {
      await browser.close();
    }

    // If navigation failed, try one more time
    if (retryCount < 1 && (
      error.message.includes('Navigation') || 
      error.message.includes('net::')
    )) {
      console.log(`Retrying navigation to ${url}...`);
      return scrapePage(url, retryCount + 1);
    }

    // Check if it was a timeout
    if (error.message.includes('Timeout') || error.message.includes('timeout')) {
      throw new Error('TIMEOUT');
    }

    throw error;
  }
}

export { scrapePage };
