import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  XCircle,
  Award,
  Sparkles,
  UserCheck
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, isAdmin, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Confirmation Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEventById(id);
      if (res.success && res.data) {
        setEvent(res.data);
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
      setError(err.response?.data?.message || 'Event not found or failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await registrationService.registerForEvent(id);
      if (res.success) {
        setActionSuccess('Registration confirmed! You have been successfully enrolled in this event.');
        setShowRegisterModal(false);
        // Refresh event to update seats count and registration status
        await fetchEvent();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to register for this event. Please try again.');
      setShowRegisterModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    setActionLoading(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      // Find my registration ID by looking up my registrations
      const myRegs = await registrationService.getMyRegistrations();
      const match = myRegs.data?.find(r => r.eventId === Number(id) && r.status === 'CONFIRMED');

      if (!match) {
        setActionError('Active registration record not found to cancel.');
        setShowCancelModal(false);
        return;
      }

      const res = await registrationService.cancelRegistration(match.id);
      if (res.success) {
        setActionSuccess('Your registration for this event has been cancelled.');
        setShowCancelModal(false);
        await fetchEvent();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to cancel registration.');
      setShowCancelModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0' }}>
        <LoadingSpinner message="Loading complete event specifications..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <ErrorMessage message={error || 'Event could not be found.'} onRetry={fetchEvent} />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/events" className="btn btn-outline-primary">
              <ArrowLeft size={16} /> Back to Events Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

  const formatEventDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dtStr) => {
    if (!dtStr) return '';
    try {
      const date = new Date(dtStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dtStr;
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

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-text)', fontWeight: 600, fontSize: '0.92rem' }}>
            <ArrowLeft size={16} /> Back to All Events
          </Link>
        </div>

        {/* Action feedback banners */}
        {actionSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '24px' }}>
            <CheckCircle size={20} />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <AlertCircle size={20} />
            <span>{actionError}</span>
          </div>
        )}

        {/* Event Hero Card */}
        <div className="card" style={{ marginBottom: '40px', overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: '360px', backgroundColor: 'var(--secondary-navy)' }}>
            <img
              src={event.imageUrl || defaultImage}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = defaultImage; }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '30px',
              background: 'linear-gradient(to top, rgba(20, 33, 61, 0.95) 0%, rgba(20, 33, 61, 0.4) 60%, transparent 100%)',
              color: 'var(--white)'
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span className="badge badge-purple">{event.category}</span>
                <span className={`badge ${event.status === 'ACTIVE' ? 'badge-success' : 'badge-navy'}`}>
                  {event.status}
                </span>
                {event.registered && (
                  <span className="badge badge-success" style={{ background: '#21865B', color: '#FFF' }}>
                    <CheckCircle size={12} style={{ marginRight: '4px' }} /> Enrolled
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.25, maxWidth: '850px' }}>
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Two-column layout: Details + Registration Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1.1fr', gap: '36px', alignItems: 'start' }}>
          {/* Left Column: Comprehensive Details */}
          <div>
            {/* Description Card */}
            <div className="card" style={{ padding: '32px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '18px' }}>
                About This Event
              </h2>
              <div style={{ whiteSpace: 'pre-line', fontSize: '1.02rem', color: 'var(--main-text)', lineHeight: 1.75 }}>
                {event.description}
              </div>
            </div>

            {/* Event Logistics Grid */}
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '22px' }}>
                Schedule & Venue Logistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Calendar size={22} style={{ color: 'var(--purple-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Event Date
                    </span>
                    <p style={{ fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
                      {formatEventDate(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Clock size={22} style={{ color: 'var(--purple-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Timing
                    </span>
                    <p style={{ fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={22} style={{ color: 'var(--purple-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Campus Venue
                    </span>
                    <p style={{ fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
                      {event.venue}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Users size={22} style={{ color: 'var(--purple-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Organized By
                    </span>
                    <p style={{ fontWeight: 600, color: 'var(--main-text)', marginTop: '2px' }}>
                      {event.organizer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="card" style={{ padding: '30px', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '18px' }}>
              Registration Status
            </h3>

            {/* Capacity breakdown bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>
                <span style={{ color: 'var(--secondary-text)' }}>Seats Reserved:</span>
                <span style={{ color: 'var(--primary-navy)' }}>
                  {event.registeredCount} / {event.capacity}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--border-light)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%`,
                  height: '100%',
                  backgroundColor: event.isFull ? 'var(--error)' : 'var(--purple-accent)',
                  borderRadius: '4px'
                }}></div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: event.isFull ? 'var(--error)' : 'var(--success)', fontWeight: 700 }}>
                  {event.isFull ? 'No Seats Remaining' : `${event.remainingSeats} Available Seats`}
                </span>
                <span style={{ color: 'var(--secondary-text)' }}>
                  Max: {event.capacity}
                </span>
              </div>
            </div>

            {/* Registration Deadline Alert */}
            <div style={{
              backgroundColor: 'var(--light-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              border: '1px solid var(--border-color)',
              marginBottom: '24px',
              fontSize: '0.88rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--purple-accent)" /> Registration Deadline:
              </div>
              <div style={{ color: event.pastDeadline ? 'var(--error)' : 'var(--secondary-text)', fontWeight: event.pastDeadline ? 700 : 500 }}>
                {formatDateTime(event.registrationDeadline)}
                {event.pastDeadline && ' (Closed)'}
              </div>
            </div>

            {/* Registration Actions */}
            <div>
              {!isAuthenticated ? (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', marginBottom: '14px' }}>
                    Sign in with your student credentials to reserve a seat for this event.
                  </p>
                  <Link to="/login" className="btn btn-primary btn-full">
                    Sign In to Register
                  </Link>
                  <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.84rem', color: 'var(--secondary-text)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--purple-accent)', fontWeight: 600 }}>Sign up</Link>
                  </p>
                </div>
              ) : event.registered ? (
                <div>
                  <div style={{
                    backgroundColor: 'var(--success-light)',
                    color: 'var(--success)',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                    fontWeight: 600,
                    fontSize: '0.92rem'
                  }}>
                    <UserCheck size={20} />
                    <span>You are registered for this event!</span>
                  </div>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="btn btn-outline-danger btn-full"
                    disabled={actionLoading}
                  >
                    Cancel My Registration
                  </button>
                </div>
              ) : event.status !== 'ACTIVE' ? (
                <div style={{
                  backgroundColor: '#EDF2F7',
                  color: 'var(--secondary-text)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Registration is closed (Event is {event.status})
                </div>
              ) : event.pastDeadline ? (
                <div style={{
                  backgroundColor: 'var(--error-light)',
                  color: 'var(--error)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Registration Deadline Has Passed
                </div>
              ) : event.isFull ? (
                <div style={{
                  backgroundColor: 'var(--error-light)',
                  color: 'var(--error)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Event is at Full Capacity (0 seats left)
                </div>
              ) : (
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="btn btn-primary btn-full"
                  disabled={actionLoading}
                >
                  <Sparkles size={16} /> Register Now ({event.remainingSeats} seats left)
                </button>
              )}
            </div>

            {isAdmin && (
              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-light)' }}>
                <span className="badge badge-navy" style={{ marginBottom: '8px' }}>Admin Action</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '12px' }}>
                  Manage or view registered students for this event in the admin portal.
                </p>
                <Link to="/admin" className="btn btn-navy btn-sm btn-full">
                  Open Event in Admin Panel
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal: Register */}
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Confirm Event Registration"
        >
          <div style={{ padding: '10px 0' }}>
            <p style={{ fontSize: '1rem', color: 'var(--main-text)', marginBottom: '16px' }}>
              Are you sure you want to register for <strong>{event.title}</strong>?
            </p>
            <div style={{ backgroundColor: 'var(--light-bg)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '6px' }}><strong>Attendee:</strong> {user?.fullName} ({user?.studentId})</div>
              <div style={{ marginBottom: '6px' }}><strong>Date:</strong> {formatEventDate(event.eventDate)}</div>
              <div><strong>Venue:</strong> {event.venue}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="btn btn-outline"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="btn btn-primary"
                disabled={actionLoading}
              >
                {actionLoading ? 'Registering...' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </Modal>

        {/* Confirmation Modal: Cancel Registration */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Registration"
        >
          <div style={{ padding: '10px 0' }}>
            <p style={{ fontSize: '1rem', color: 'var(--main-text)', marginBottom: '16px' }}>
              Are you sure you want to cancel your registration for <strong>{event.title}</strong>?
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--secondary-text)', marginBottom: '24px' }}>
              Your seat will immediately be released and made available to other students.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="btn btn-outline"
                disabled={actionLoading}
              >
                Keep Registration
              </button>
              <button
                type="button"
                onClick={handleCancelRegistration}
                className="btn btn-danger"
                disabled={actionLoading}
              >
                {actionLoading ? 'Cancelling...' : 'Yes, Cancel Registration'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EventDetails;
