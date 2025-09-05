import { NextResponse } from 'next/server';
import { scrapeAllEvents } from '@/lib/scrapers';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Starting event scraping...');
    
    // Scrape events from all sources
    const events = await scrapeAllEvents();
    
    console.log(`Scraped ${events.length} events:`, events);
    
    // Analyze the events for debugging
    const eventAnalysis = {
      total: events.length,
      bySource: events.reduce((acc, event) => {
        acc[event.source] = (acc[event.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      withDates: events.filter(e => e.date && e.date !== '2001-10-01').length,
      withInvalidDates: events.filter(e => e.date === '2001-10-01').length,
      uniqueTitles: new Set(events.map(e => e.title)).size
    };
    
    if (events.length === 0) {
      return NextResponse.json(
        { error: 'No events found', analysis: eventAnalysis },
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
        { error: 'Failed to store events', details: error.message, analysis: eventAnalysis },
        { status: 500 }
      );
    }
    
    console.log(`Successfully scraped and stored ${events.length} events`);
    
    return NextResponse.json({
      success: true,
      events: data,
      count: events.length,
      analysis: eventAnalysis,
      debug: {
        message: 'Check console for detailed scraping logs',
        eventSources: Object.keys(eventAnalysis.bySource),
        duplicateCount: events.length - eventAnalysis.uniqueTitles
      }
    });
    
  } catch (error) {
    console.error('Error in scrape API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
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
