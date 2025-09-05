const axios = require('axios');
const cheerio = require('cheerio');

async function testScraper() {
  try {
    console.log('Testing Alliance to Save Energy scraper...');
    const response = await axios.get('https://www.ase.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    console.log('Page loaded successfully');
    
    // Check .views-row elements specifically
    const viewsRows = $('.views-row');
    console.log(`Found ${viewsRows.length} .views-row elements`);
    
    viewsRows.each((index, element) => {
      if (index >= 3) return false; // Limit to first 3
      const $el = $(element);
      console.log(`\n--- Views Row ${index + 1} ---`);
      
      // Check for titles
      const titleSelectors = ['h3', '.event-title', '.title', 'h2', 'h1'];
      titleSelectors.forEach(selector => {
        const title = $el.find(selector).text().trim();
        if (title) console.log(`Title (${selector}): "${title}"`);
      });
      
      // Check for links
      const links = $el.find('a');
      console.log(`Links found: ${links.length}`);
      links.each((i, linkEl) => {
        const $link = $(linkEl);
        const text = $link.text().trim();
        const href = $link.attr('href');
        if (text && href) console.log(`  Link: "${text}" -> ${href}`);
      });
      
      // Check for dates
      const dateSelectors = ['.event-date', '.date', '.event-time', '.field-date'];
      dateSelectors.forEach(selector => {
        const date = $el.find(selector).text().trim();
        if (date) console.log(`Date (${selector}): "${date}"`);
      });
      
      // Show all text content
      const allText = $el.text().trim();
      console.log(`All text: "${allText.substring(0, 200)}..."`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testScraper();