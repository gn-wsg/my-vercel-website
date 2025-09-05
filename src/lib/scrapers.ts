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

// DMV Climate Partners scraper
export async function scrapeDMVClimatePartners(): Promise<Event[]> {
  try {
    const response = await axios.get('https://climatepartners.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time').text().trim();
      const location = $el.find('.event-location, .location, .venue').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, p').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'DMV Climate Partners',
          link: link.startsWith('http') ? link : `https://climatepartners.org${link}`,
          source: 'dmv-climate',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping DMV Climate Partners:', error);
    return [];
  }
}

// Alliance to Save Energy scraper
export async function scrapeAllianceToSaveEnergy(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.ase.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Alliance to Save Energy',
          link: link.startsWith('http') ? link : `https://www.ase.org${link}`,
          source: 'ase',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Alliance to Save Energy:', error);
    return [];
  }
}

// American Council on Renewable Energy scraper
export async function scrapeACORE(): Promise<Event[]> {
  try {
    const response = await axios.get('https://acore.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'American Council on Renewable Energy',
          link: link.startsWith('http') ? link : `https://acore.org${link}`,
          source: 'acore',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping ACORE:', error);
    return [];
  }
}

// Center for Climate & Energy Solutions scraper
export async function scrapeC2ES(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.c2es.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Center for Climate & Energy Solutions',
          link: link.startsWith('http') ? link : `https://www.c2es.org${link}`,
          source: 'c2es',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping C2ES:', error);
    return [];
  }
}

// Brookings Institution scraper
export async function scrapeBrookings(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.brookings.edu/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Brookings Institution',
          link: link.startsWith('http') ? link : `https://www.brookings.edu${link}`,
          source: 'brookings',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Brookings:', error);
    return [];
  }
}

// Resources for the Future scraper
export async function scrapeRFF(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.rff.org/events/all-events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Resources for the Future',
          link: link.startsWith('http') ? link : `https://www.rff.org${link}`,
          source: 'rff',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping RFF:', error);
    return [];
  }
}

// Environmental & Energy Study Institute scraper
export async function scrapeEESI(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.eesi.org/briefings', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .briefing-item').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .briefing-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .briefing-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .briefing-description').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Environmental & Energy Study Institute',
          link: link.startsWith('http') ? link : `https://www.eesi.org${link}`,
          source: 'eesi',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping EESI:', error);
    return [];
  }
}

// Solar Energy Industries Association scraper
export async function scrapeSEIA(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.seia.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Solar Energy Industries Association',
          link: link.startsWith('http') ? link : `https://www.seia.org${link}`,
          source: 'seia',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping SEIA:', error);
    return [];
  }
}

// Center for Strategic & International Studies scraper
export async function scrapeCSIS(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.csis.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Center for Strategic & International Studies',
          link: link.startsWith('http') ? link : `https://www.csis.org${link}`,
          source: 'csis',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping CSIS:', error);
    return [];
  }
}

// World Resources Institute scraper
export async function scrapeWRI(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.wri.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'World Resources Institute',
          link: link.startsWith('http') ? link : `https://www.wri.org${link}`,
          source: 'wri',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping WRI:', error);
    return [];
  }
}

// American Council for an Energy Efficient Economy scraper
export async function scrapeACEEE(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.aceee.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'American Council for an Energy Efficient Economy',
          link: link.startsWith('http') ? link : `https://www.aceee.org${link}`,
          source: 'aceee',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping ACEEE:', error);
    return [];
  }
}

// Business Council for Sustainable Energy scraper
export async function scrapeBCSE(): Promise<Event[]> {
  try {
    const response = await axios.get('https://bcse.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Business Council for Sustainable Energy',
          link: link.startsWith('http') ? link : `https://bcse.org${link}`,
          source: 'bcse',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping BCSE:', error);
    return [];
  }
}

// Our Energy Policy scraper
export async function scrapeOurEnergyPolicy(): Promise<Event[]> {
  try {
    const response = await axios.get('http://www.ourenergypolicy.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Online';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Our Energy Policy',
          link: link.startsWith('http') ? link : `http://www.ourenergypolicy.org${link}`,
          source: 'our-energy-policy',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Our Energy Policy:', error);
    return [];
  }
}

// Advanced Biofuels USA scraper
export async function scrapeAdvancedBiofuels(): Promise<Event[]> {
  try {
    const response = await axios.get('https://advancedbiofuelsusa.info', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser, .conference-item').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title, .conference-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime, .conference-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location, .conference-location').text().trim() || 'Online';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text, .conference-description').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Advanced Biofuels USA',
          link: link.startsWith('http') ? link : `https://advancedbiofuelsusa.info${link}`,
          source: 'advanced-biofuels',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Advanced Biofuels USA:', error);
    return [];
  }
}

// American Enterprise Institute scraper
export async function scrapeAEI(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.aei.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'American Enterprise Institute',
          link: link.startsWith('http') ? link : `https://www.aei.org${link}`,
          source: 'aei',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping AEI:', error);
    return [];
  }
}

// Atlantic Council scraper
export async function scrapeAtlanticCouncil(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.atlanticcouncil.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Atlantic Council',
          link: link.startsWith('http') ? link : `https://www.atlanticcouncil.org${link}`,
          source: 'atlantic-council',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Atlantic Council:', error);
    return [];
  }
}

// Bipartisan Policy Center scraper
export async function scrapeBPC(): Promise<Event[]> {
  try {
    const response = await axios.get('https://bipartisanpolicy.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Bipartisan Policy Center',
          link: link.startsWith('http') ? link : `https://bipartisanpolicy.org${link}`,
          source: 'bpc',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping BPC:', error);
    return [];
  }
}

// Clean Power Association scraper
export async function scrapeCleanPower(): Promise<Event[]> {
  try {
    const response = await axios.get('https://cleanpower.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Clean Power Association',
          link: link.startsWith('http') ? link : `https://cleanpower.org${link}`,
          source: 'clean-power',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping Clean Power Association:', error);
    return [];
  }
}

// Clean Energy States Alliance scraper
export async function scrapeCESA(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.cesa.org/webinars-events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser, .webinar-item').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title, .webinar-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime, .webinar-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location, .webinar-location').text().trim() || 'Online';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text, .webinar-description').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Clean Energy States Alliance',
          link: link.startsWith('http') ? link : `https://www.cesa.org${link}`,
          source: 'cesa',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping CESA:', error);
    return [];
  }
}

// Environmental Law Institute scraper
export async function scrapeELI(): Promise<Event[]> {
  try {
    const response = await axios.get('https://www.eli.org/events-calendar', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser, .calendar-item').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title, .calendar-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime, .calendar-date').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location, .calendar-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text, .calendar-description').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Environmental Law Institute',
          link: link.startsWith('http') ? link : `https://www.eli.org${link}`,
          source: 'eli',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping ELI:', error);
    return [];
  }
}

// Greater Washington Region Clean Cities Coalition scraper
export async function scrapeGWRCCC(): Promise<Event[]> {
  try {
    const response = await axios.get('https://gwrccc.org/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: Event[] = [];
    
    $('.event-item, .event, .event-card, .views-row, .event-teaser').each((index, element) => {
      if (index >= 10) return false;
      
      const $el = $(element);
      const title = $el.find('h3, .event-title, .title, h2, .teaser-title').text().trim();
      const link = $el.find('a').attr('href');
      const dateText = $el.find('.event-date, .date, .event-time, .field-date, .event-datetime').text().trim();
      const location = $el.find('.event-location, .location, .venue, .field-location').text().trim() || 'Washington DC';
      const description = $el.find('.event-description, .description, .field-body, .teaser-text').text().trim();
      
      if (title && link) {
        events.push({
          title,
          date: parseDate(dateText),
          location,
          host: 'Greater Washington Region Clean Cities Coalition',
          link: link.startsWith('http') ? link : `https://gwrccc.org${link}`,
          source: 'gwrccc',
          description
        });
      }
    });
    
    return events;
  } catch (error) {
    console.error('Error scraping GWRCCC:', error);
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
    // Scrape from multiple energy event sources
    const [
      dmvEvents, aseEvents, acoreEvents, c2esEvents, 
      brookingsEvents, rffEvents, eesiEvents, seiaEvents,
      csisEvents, wriEvents, aceeeEvents, bcseEvents,
      ourEnergyPolicyEvents, advancedBiofuelsEvents, aeiEvents,
      atlanticCouncilEvents, bpcEvents, cleanPowerEvents,
      cesaEvents, eliEvents, gwrcccEvents, genericEvents
    ] = await Promise.all([
      scrapeDMVClimatePartners(),
      scrapeAllianceToSaveEnergy(),
      scrapeACORE(),
      scrapeC2ES(),
      scrapeBrookings(),
      scrapeRFF(),
      scrapeEESI(),
      scrapeSEIA(),
      scrapeCSIS(),
      scrapeWRI(),
      scrapeACEEE(),
      scrapeBCSE(),
      scrapeOurEnergyPolicy(),
      scrapeAdvancedBiofuels(),
      scrapeAEI(),
      scrapeAtlanticCouncil(),
      scrapeBPC(),
      scrapeCleanPower(),
      scrapeCESA(),
      scrapeELI(),
      scrapeGWRCCC(),
      scrapeGenericEvents()
    ]);
    
    // Combine all events
    const allEvents = [
      ...dmvEvents, ...aseEvents, ...acoreEvents, ...c2esEvents,
      ...brookingsEvents, ...rffEvents, ...eesiEvents, ...seiaEvents,
      ...csisEvents, ...wriEvents, ...aceeeEvents, ...bcseEvents,
      ...ourEnergyPolicyEvents, ...advancedBiofuelsEvents, ...aeiEvents,
      ...atlanticCouncilEvents, ...bpcEvents, ...cleanPowerEvents,
      ...cesaEvents, ...eliEvents, ...gwrcccEvents, ...genericEvents
    ];
    
    // Add unique IDs and timestamps
    const eventsWithIds = allEvents.map((event, index) => ({
      ...event,
      id: `${event.source}-${index}-${Date.now()}`,
      created_at: new Date().toISOString()
    }));
    
    console.log(`Scraped ${eventsWithIds.length} events total from ${allEvents.length > 0 ? 'real sources' : 'sample data'}`);
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
