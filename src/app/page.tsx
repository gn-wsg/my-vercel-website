'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/lib/scrapers';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

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
    console.log('🚀 Starting to scrape events...');
    setScraping(true);
    try {
      console.log('📡 Calling /api/events/scrape...');
      const response = await fetch('/api/events/scrape', {
        method: 'POST',
      });
      console.log('📡 Response received:', response.status);
      const data = await response.json();
      console.log('📊 Scrape result:', data);
      if (data.success) {
        console.log(`✅ Found ${data.events.length} events:`, data.events);
        setEvents(data.events);
      } else {
        console.error('❌ Scrape failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Error scraping events:', error);
    } finally {
      setScraping(false);
    }
  };

  // Subscribe to email updates
  const subscribeToUpdates = async () => {
    if (!email) return;
    
    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setEmailSubscribed(true);
        console.log('✅ Successfully subscribed to email updates');
      }
    } catch (error) {
      console.error('❌ Error subscribing to updates:', error);
    }
  };

  // Email events to user
  const emailEvents = async () => {
    if (!email) return;
    
    const filteredEventsToEmail = filteredEvents.slice(0, 10); // Limit to 10 events
    
    try {
      const response = await fetch('/api/email/send-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          events: filteredEventsToEmail,
          searchTerm,
          startDate,
          endDate
        })
      });
      const data = await response.json();
      if (data.success) {
        console.log('✅ Events emailed successfully');
        alert('Events have been sent to your email!');
      }
    } catch (error) {
      console.error('❌ Error emailing events:', error);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events by source, search term, date range, category, and remove duplicates
  const filteredEvents = events
    .filter(event => {
      // Only show future events (today or later)
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      // Show events from today onwards
      const isFutureEvent = eventDate >= today;

      // Filter by source
      const sourceMatch = filter === 'all' || event.source === filter;

      // Filter by category
      const categoryMatch = categoryFilter === 'all' || event.category === categoryFilter;

      // Filter by search term
      const searchMatch = !searchTerm ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by date range
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const dateMatch = (!start || eventDate >= start) && (!end || eventDate <= end);

      return isFutureEvent && sourceMatch && categoryMatch && searchMatch && dateMatch;
    })
    .filter((event, index, self) => {
      // Remove duplicates based on title, date, and host
      return index === self.findIndex(e => 
        e.title === event.title && 
        e.date === event.date && 
        e.host === event.host
      );
    })
    .sort((a, b) => {
      // Sort by date (earliest first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

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
            
            {/* Search and Date Range Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Search Field */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Events
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, host, or location..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Panel">Panel</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Forum">Forum</option>
                  <option value="Networking">Networking</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Event">Event</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(searchTerm || startDate || endDate || categoryFilter !== 'all') && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStartDate('');
                    setEndDate('');
                    setCategoryFilter('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}
            
            {/* Source Filter Buttons */}
            <div className="flex flex-wrap gap-1">
              {['all', 'dmv-climate', 'ase', 'acore', 'c2es', 'brookings', 'rff', 'eesi', 'seia', 'csis', 'wri', 'aceee', 'bcse', 'our-energy-policy', 'advanced-biofuels', 'aei', 'atlantic-council', 'bpc', 'clean-power', 'cesa', 'eli', 'gwrccc', 'heritage', 'icf', 'itif', 'ncac-usaee', 'npc', 'politico', 'rstreet', 'rollcall', 'thehill', 'usea', 'wcee', 'wen', 'wris', 'wilson', 'aaas', 'asp', 'cato', 'cap', 'fallback'].map((source) => (
                <button
                  key={source}
                  onClick={() => setFilter(source)}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors text-xs ${
                    filter === source
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {source === 'all' ? 'All Sources' : 
                   source === 'dmv-climate' ? 'DMV Climate' :
                   source === 'ase' ? 'ASE' :
                   source === 'acore' ? 'ACORE' :
                   source === 'c2es' ? 'C2ES' :
                   source === 'brookings' ? 'Brookings' :
                   source === 'rff' ? 'RFF' :
                   source === 'eesi' ? 'EESI' :
                   source === 'seia' ? 'SEIA' :
                   source === 'csis' ? 'CSIS' :
                   source === 'wri' ? 'WRI' :
                   source === 'aceee' ? 'ACEEE' :
                   source === 'bcse' ? 'BCSE' :
                   source === 'our-energy-policy' ? 'Our Energy Policy' :
                   source === 'advanced-biofuels' ? 'Advanced Biofuels' :
                   source === 'aei' ? 'AEI' :
                   source === 'atlantic-council' ? 'Atlantic Council' :
                   source === 'bpc' ? 'BPC' :
                   source === 'clean-power' ? 'Clean Power' :
                   source === 'cesa' ? 'CESA' :
                   source === 'eli' ? 'ELI' :
                   source === 'gwrccc' ? 'GWRCCC' :
                   source === 'heritage' ? 'Heritage' :
                   source === 'icf' ? 'ICF' :
                   source === 'itif' ? 'ITIF' :
                   source === 'ncac-usaee' ? 'NCAC USAEE' :
                   source === 'npc' ? 'NPC' :
                   source === 'politico' ? 'Politico' :
                   source === 'rstreet' ? 'R Street' :
                   source === 'rollcall' ? 'Roll Call' :
                   source === 'thehill' ? 'The Hill' :
                   source === 'usea' ? 'USEA' :
                   source === 'wcee' ? 'WCEE' :
                   source === 'wen' ? 'WEN' :
                   source === 'wris' ? 'WRIS' :
                   source === 'wilson' ? 'Wilson' :
                   source === 'aaas' ? 'AAAS' :
                   source === 'asp' ? 'ASP' :
                   source === 'cato' ? 'Cato' :
                   source === 'cap' ? 'CAP' :
                   source === 'debug' ? 'Debug Events' :
                   source === 'test' ? 'Test Events' :
                   source.charAt(0).toUpperCase() + source.slice(1)}
                </button>
              ))}
            </div>

            {/* Email Section */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📧 Email Updates & Event Sharing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={subscribeToUpdates}
                    disabled={!email || emailSubscribed}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {emailSubscribed ? '✓ Subscribed' : 'Subscribe'}
                  </button>
                  <button
                    onClick={emailEvents}
                    disabled={!email || filteredEvents.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    📧 Email Events
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Subscribe for weekly energy event updates or email yourself the current filtered events
              </p>
            </div>
          </div>

          {/* Events Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upcoming Events ({filteredEvents.length})
            </h2>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  {events.length === 0 
                    ? 'No events found. Click "Find Me Energy Events" to get started!'
                    : 'No upcoming events match your current filters. Try adjusting your search terms, date range, or source filters.'
                  }
                </p>
                {(searchTerm || startDate || endDate || filter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStartDate('');
                      setEndDate('');
                      setFilter('all');
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-1">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                          {event.source}
                        </span>
                        {event.category && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
                            {event.category}
                          </span>
                        )}
                      </div>
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
