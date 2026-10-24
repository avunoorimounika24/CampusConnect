import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search, Filter, RotateCcw, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const ExploreEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state synced with searchParams
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const date = searchParams.get('date') || '';
  const status = searchParams.get('status') || 'ACTIVE';
  const page = parseInt(searchParams.get('page') || '0', 10);

  // Local search input state for debouncing/submitting
  const [searchInput, setSearchInput] = useState(search);

  // Fetch available categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await eventService.getCategories();
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch events whenever query params change
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: 9
      };
      if (search) params.search = search;
      if (category) params.category = category;
      if (date) params.date = date;
      if (status) params.status = status;

      const res = await eventService.getEvents(params);
      if (res.success && res.data) {
        setEvents(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('Failed to fetch events from the server. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(search);
    fetchEvents();
  }, [search, category, date, status, page]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== '' && value !== null && value !== undefined) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset to first page on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="section-py" style={{ paddingTop: '40px' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="page-title">
            Explore Campus Events
          </h1>
          <p className="page-subtitle">
            Discover workshops, hackathons, sports, and cultural festivals happening across the college campus.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card card-padded" style={{ marginBottom: '36px' }}>
          <form onSubmit={handleSearchSubmit} className="explore-filter-form">
            {/* Search Input */}
            <div>
              <label className="form-label">
                <Search size={14} style={{ display: 'inline', marginRight: '6px' }} /> Search Events
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title, venue..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label">
                <Filter size={14} style={{ display: 'inline', marginRight: '6px' }} /> Category
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="form-label">
                <CalendarIcon size={14} style={{ display: 'inline', marginRight: '6px' }} /> Event Date
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => updateParam('date', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="form-label">Event Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => updateParam('status', e.target.value)}
              >
                <option value="ACTIVE">Upcoming & Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="">All Statuses</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Search
              </button>
              {(search || category || date || status !== 'ACTIVE') && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-outline"
                  title="Clear all filters"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Active filter summary tag */}
          <div className="explore-summary-row">
            <span>
              Showing {events.length} of {totalElements} {totalElements === 1 ? 'event' : 'events'}
            </span>
            {(search || category || date) && (
              <span style={{ color: 'var(--purple-accent)', fontWeight: 600 }}>
                Filtered by: {[search && `"${search}"`, category, date].filter(Boolean).join(' • ')}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner message="Loading events schedule..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchEvents} />
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CalendarIcon size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
              No Events Found
            </h3>
            <p style={{ color: 'var(--secondary-text)', maxWidth: '440px', margin: '0 auto 20px' }}>
              No events matched your search criteria. Try modifying your search keywords or resetting active filters.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid-3" style={{ marginBottom: '40px' }}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page === 0}
                  onClick={() => updateParam('page', page - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', fontWeight: 600 }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => updateParam('page', page + 1)}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreEvents;
