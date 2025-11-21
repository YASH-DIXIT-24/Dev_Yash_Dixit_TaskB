import { isValidUrlCheck } from '../../utils/validation';
import { scrapePage } from '../../utils/scraper';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  // Make sure we got a URL
  if (!url) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Make sure it's a valid URL
  if (!isValidUrlCheck(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const result = await scrapePage(url);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Scraping error:', error.message);

    if (error.message === 'TIMEOUT') {
      return res.status(504).json({ error: 'Timeout' });
    }

    return res.status(500).json({ error: 'Scraping failed' });
  }
}
