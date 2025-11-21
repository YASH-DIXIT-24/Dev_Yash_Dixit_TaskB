# Microscraper

A simple web scraper API that extracts basic information from any webpage 
- title, meta description, and the main heading.

## What It Does

- Grabs the page title, meta description, and first H1 heading
- Times out after 20 seconds if a page takes too long
- Waits for the page to fully load before scraping
- Validates URLs and handles errors properly
- Runs in the background without opening a browser window
- Pretends to be a regular Chrome browser to avoid detection
- Retries once if something goes wrong

## Built With

- Next.js 16 for the API
- Playwright with Chromium for browser automation
- Node.js 22 or higher

## Getting Started

### What You'll Need

- Node.js version 22 or newer
- npm version 10 or newer

### Installation Steps

1. Navigate to the project folder:
```bash
cd Dev_Yash_Dixit_TaskB
```

2. Install everything (this also downloads Chromium):
```bash
npm i
```

3. Start the server:
```bash
npm run dev
```

Your API will be running at `http://localhost:3000`

## How to Use It

### The Endpoint

**GET /api/scrape**

Send a GET request with a URL and get back page information.

#### What You Need to Send

- `url` (required): The webpage URL you want to scrape. Must start with http:// or https://

#### Example

```bash
curl "http://localhost:3000/api/scrape?url=https://example.com"
```

#### When Everything Works (200)

```json
{
  "title": "Example Domain",
  "metaDescription": "Example Domain description",
  "h1": "Example Domain",
  "status": 200
}
```

#### When Things Go Wrong

**Bad or missing URL (400)**
```json
{
  "error": "Invalid URL"
}
```

**Page took too long to load (504)**
```json
{
  "error": "Timeout"
}
```

**Something else broke (500)**
```json
{
  "error": "Scraping failed"
}
```

## Available Commands

- `npm run dev` - Starts the server for development
- `npm run build` - Builds the project for production
- `npm start` - Runs the production server

## How It Works

### Timeouts
Every request has a 20-second limit. If a page takes longer than that, you'll get a timeout error.

### Loading Pages
The scraper waits until the page stops making network requests before grabbing content. This makes sure everything is loaded, including stuff that loads with JavaScript.

### Handling Problems
- Checks if URLs are valid before trying to scrape them
- Returns specific error codes so you know what went wrong
- Retries once if the page fails to load
- Cleans up properly so it doesn't eat up memory

### Extra Features

**Pretending to be Chrome**: The scraper sends a real Chrome user-agent string so websites think it's a regular browser, not a bot.

**Auto-Retry**: If something fails the first time (like a network hiccup), it waits a second and tries one more time before giving up.

## Project Files

```
Dev_Yash_Dixit_TaskB/
├── app/
│   └── api/
│       └── scrape/            
├── pages/
│   └── api/
│       └── scrape.js      
├── utils/
│   ├── scraper.js             
│   └── validation.js          
├── next.config.js            
├── package.json             
├── README.md                 
└── LICENSE                    
```

## Things to Know

1. This works best on regular websites like marketing pages and blogs
2. It handles pages that load content with JavaScript
3. Looks for the standard meta description tag
4. Uses Chromium because it's smaller to download
5. Each request starts a fresh browser session

## Try It Out

```bash
# Scrape a basic webpage
curl "http://localhost:3000/api/scrape?url=https://example.com"

# Test with a bad URL (returns error)
curl "http://localhost:3000/api/scrape?url=not-a-url"

# Test without a URL (returns error)
curl "http://localhost:3000/api/scrape"
```