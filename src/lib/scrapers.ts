import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseISO, isValid } from 'date-fns';

export interface Event {
  id?: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  host: string;
  link: string;
  source: string;
  description?: string;
  created_at?: string;
}

// Eventbrite scraper
export async function scrapeEventbrite(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.eventbrite.com/d/online/events/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('[data-testid="event-card"]').each((index, element) => {
      if (index >= 10) return false; // Limit to 10 events
      
      const $el = $(element);
      const title = $el.find('h3').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('[data-testid="event-date"]').text().trim();
      const location = $el.find('[data-testid="event-location"]').text().trim() || 'Online';
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Eventbrite',
          link: link.startsWith('http') ? link : `https://www.eventbrite.com${link}`,
          source: 'eventbrite',
          description: $el.find('p').text().trim()
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Eventbrite:', error);
    return [];
  }
}

// Meetup scraper
export async function scrapeMeetup(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.meetup.com/find/events/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('[data-testid="event-card"]').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('[data-testid="event-date"]').text().trim();
      const location = $el.find('[data-testid="event-location"]').text().trim() || 'Online';
      const host = $el.find('[data-testid="group-name"]').text().trim() || 'Meetup';
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host,
          link: link.startsWith('http') ? link : `https://www.meetup.com${link}`,
          source: 'meetup',
          description: $el.find('p').text().trim()
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Meetup:', error);
    return [];
  }
}

// Energy events scraper for demonstration
export async function scrapeGenericEvents(): Promise<Event[]> {
  // This is a mock function that returns sample energy events
  // In a real implementation, you'd scrape actual energy event sites
  return [
    {
      title: "DC Clean Energy Summit 2024",
      date: "2024-12-15",
      time: "9:00 AM",
      location: "Washington DC Convention Center",
      host: "DC Energy Coalition",
      link: "https://example.com/clean-energy-summit",
      source: "generic",
      description: "Annual summit on clean energy initiatives and policy in the DC area"
    },
    {
      title: "Solar Power Workshop",
      date: "2024-12-20",
      time: "2:00 PM",
      location: "Online",
      host: "Renewable Energy Institute",
      link: "https://example.com/solar-workshop",
      source: "generic",
      description: "Learn about residential and commercial solar installation"
    },
    {
      title: "Energy Innovation Pitch Night",
      date: "2024-12-25",
      time: "6:00 PM",
      location: "Arlington, VA",
      host: "Energy Startup Hub",
      link: "https://example.com/energy-pitch",
      source: "generic",
      description: "Watch innovative energy startups pitch their solutions"
    }
  ];
}

// Parse date from various formats
function parseDate(dateText: string): string {
  if (!dateText) return new Date().toISOString().split('T')[0];
  
  // Try to parse common date formats
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Handle relative dates
  if (dateText.toLowerCase().includes('today')) {
    return today.toISOString().split('T')[0];
  }
  if (dateText.toLowerCase().includes('tomorrow')) {
    return tomorrow.toISOString().split('T')[0];
  }
  
  // Try to parse ISO date
  try {
    const parsed = parseISO(dateText);
    if (isValid(parsed)) {
      return parsed.toISOString().split('T')[0];
    }
  } catch {
    // Continue to fallback
  }
  
  // Fallback to today's date
  return today.toISOString().split('T')[0];
}

// Main scraper function that combines all sources
export async function scrapeAllEvents(): Promise<Event[]> {
  console.log('Starting to scrape events from all sources...');
  
  try {
    // For now, let's just use the generic events to ensure it works
    const genericEvents = await scrapeGenericEvents();
    
    // Add unique IDs and timestamps
    const eventsWithIds = genericEvents.map((event, index) => ({
      ...event,
      id: `${event.source}-${index}-${Date.now()}`,
      created_at: new Date().toISOString()
    }));
    
    console.log(`Scraped ${eventsWithIds.length} events total`);
    return eventsWithIds;
  } catch (error) {
    console.error('Error in scrapeAllEvents:', error);
    // Return sample events as fallback
    return [
      {
        id: `fallback-${Date.now()}`,
        title: "DC Energy Meetup",
        date: new Date().toISOString().split('T')[0],
        time: "2:00 PM",
        location: "Washington DC",
        host: "DC Energy Network",
        link: "https://example.com",
        source: "generic",
        description: "This is a sample energy event to test the system",
        created_at: new Date().toISOString()
      }
    ];
  }
}
