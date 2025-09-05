'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/scrapers';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [filter, setFilter] = useState('all');

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scrape new events
  const scrapeEvents = async () => {
    setScraping(true);
    try {
      const response = await fetch('/api/events/scrape', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error scraping events:', error);
    } finally {
      setScraping(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events by source
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.source === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ⚡ DC Energy Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Discover energy events in Washington DC
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrapeEvents}
                disabled={scraping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {scraping ? '🔄 Finding...' : '⚡ Find Me Energy Events'}
              </button>
              <button
                onClick={fetchEvents}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? '🔄 Loading...' : '📋 Refresh Events'}
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Filter Events
            </h2>
            <div className="flex flex-wrap gap-2">
              {['all', 'dmv-climate', 'ase', 'acore', 'c2es', 'generic'].map((source) => (
                <button
                  key={source}
                  onClick={() => setFilter(source)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === source
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {source === 'all' ? 'All Sources' : 
                   source === 'dmv-climate' ? 'DMV Climate' :
                   source === 'ase' ? 'Alliance to Save Energy' :
                   source === 'acore' ? 'ACORE' :
                   source === 'c2es' ? 'C2ES' :
                   source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Events Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Events ({filteredEvents.length})
            </h2>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No events found. Click &quot;Find Me Energy Events&quot; to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                        {event.source}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {event.date}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👤</span>
                        {event.host}
                      </div>
                      {event.time && (
                        <div className="flex items-center">
                          <span className="mr-2">🕒</span>
                          {event.time}
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      View Event →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
