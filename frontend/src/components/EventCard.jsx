import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  if (!event) return null;

  const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80';

  const formatEventDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hour, minute] = timeStr.split(':');
      const h = parseInt(hour, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 || 12;
      return `${formattedH}:${minute} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'TECHNICAL':
      case 'HACKATHONS':
        return 'badge-purple';
      case 'CULTURAL':
        return 'badge-navy';
      case 'SPORTS':
        return 'badge-success';
      case 'WORKSHOPS':
        return 'badge-warning';
      default:
        return 'badge-purple';
    }
  };

  return (
    <div className="card event-card">
      <div className="event-image-wrap">
        <img
          src={event.imageUrl || defaultImage}
          alt={event.title}
          onError={(e) => { e.target.src = defaultImage; }}
          loading="lazy"
        />
        <div className="event-badge-overlay">
          <span className={`badge ${getCategoryBadgeClass(event.category)}`}>
            {event.category}
          </span>
        </div>
        {event.status !== 'ACTIVE' && (
          <div className="event-status-overlay">
            <span className={`badge ${event.status === 'COMPLETED' ? 'badge-navy' : 'badge-error'}`}>
              {event.status}
            </span>
          </div>
        )}
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        <div className="event-meta-list">
          <div className="event-meta-item">
            <Calendar size={16} className="event-meta-icon" />
            <span>{formatEventDate(event.eventDate)}</span>
          </div>
          <div className="event-meta-item">
            <Clock size={16} className="event-meta-icon" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={16} className="event-meta-icon" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.venue}
            </span>
          </div>
          <div className="event-meta-item">
            <Users size={16} className="event-meta-icon" />
            <span>By: <strong>{event.organizer}</strong></span>
          </div>
        </div>

        <div className="event-card-footer">
          <div>
            {event.isFull ? (
              <span className="seats-indicator seats-full">Event Full (0 seats)</span>
            ) : (
              <span className="seats-indicator seats-available">
                {event.remainingSeats} {event.remainingSeats === 1 ? 'seat' : 'seats'} available
              </span>
            )}
          </div>
          <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">
            Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
