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
  createdAt?: string;
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

// Generic event scraper for demonstration
export async function scrapeGenericEvents(): Promise<Event[]> {
  // This is a mock function that returns sample events
  // In a real implementation, you'd scrape actual event sites
  return [
    {
      title: "Tech Conference 2024",
      date: "2024-12-15",
      time: "09:00",
      location: "San Francisco, CA",
      host: "Tech Events Inc",
      link: "https://example.com/tech-conference",
      source: "generic",
      description: "Annual technology conference featuring the latest innovations"
    },
    {
      title: "Web Development Workshop",
      date: "2024-12-20",
      time: "14:00",
      location: "Online",
      host: "Code Academy",
      link: "https://example.com/webdev-workshop",
      source: "generic",
      description: "Learn modern web development techniques"
    },
    {
      title: "Startup Pitch Night",
      date: "2024-12-25",
      time: "18:00",
      location: "New York, NY",
      host: "Startup Hub",
      link: "https://example.com/pitch-night",
      source: "generic",
      description: "Watch innovative startups pitch their ideas"
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
  
  const [eventbriteEvents, meetupEvents, genericEvents] = await Promise.all([
    scrapeEventbrite(),
    scrapeMeetup(),
    scrapeGenericEvents()
  ]);
  
  const allEvents = [...eventbriteEvents, ...meetupEvents, ...genericEvents];
  
  // Add unique IDs and timestamps
  const eventsWithIds = allEvents.map((event, index) => ({
    ...event,
    id: `${event.source}-${index}-${Date.now()}`,
    createdAt: new Date().toISOString()
  }));
  
  console.log(`Scraped ${eventsWithIds.length} events total`);
  return eventsWithIds;
}
