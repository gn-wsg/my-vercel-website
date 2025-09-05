import { NextResponse } from 'next/server';
import { scrapeAllEvents } from '@/lib/scrapers';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Starting event scraping...');
    
    // Scrape events from all sources
    const events = await scrapeAllEvents();
    
    if (events.length === 0) {
      return NextResponse.json(
        { error: 'No events found' },
        { status: 404 }
      );
    }
    
    // Store events in Supabase
    const { data, error } = await supabase
      .from('events')
      .upsert(events, { onConflict: 'id' })
      .select();
    
    if (error) {
      console.error('Error storing events:', error);
      return NextResponse.json(
        { error: 'Failed to store events' },
        { status: 500 }
      );
    }
    
    console.log(`Successfully scraped and stored ${events.length} events`);
    
    return NextResponse.json({
      success: true,
      events: data,
      count: events.length
    });
    
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Event scraper API endpoint',
    usage: 'POST to this endpoint to scrape events'
  });
}
