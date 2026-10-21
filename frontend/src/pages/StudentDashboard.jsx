import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationService } from '../services/registrationService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import {
  User,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchMyRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await registrationService.getMyRegistrations();
      if (res.success) {
        setRegistrations(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load my registrations:', err);
      setError('Failed to retrieve your registrations. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const handleCancelRegistration = async () => {
    if (!cancelTarget) return;

    setCancelling(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await registrationService.cancelRegistration(cancelTarget.id);
      if (res.success) {
        setActionSuccess(`Your registration for "${cancelTarget.eventTitle}" was cancelled.`);
        setCancelTarget(null);
        await fetchMyRegistrations();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to cancel registration.');
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Metrics computation
  const today = new Date().toISOString().split('T')[0];
  const totalRegistrations = registrations.length;
  const confirmedRegistrations = registrations.filter(r => r.status === 'CONFIRMED');
  const cancelledRegistrations = registrations.filter(r => r.status === 'CANCELLED');
  const upcomingEvents = confirmedRegistrations.filter(r => r.eventDate >= today);
  const completedEvents = confirmedRegistrations.filter(r => r.eventDate < today);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-purple">Student Portal</span>
            <span className="badge badge-navy">ID: {user?.studentId || 'N/A'}</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '6px' }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1rem' }}>
            Track and manage your collegiate registrations, upcoming venues, and activity history.
          </p>
        </div>

        {/* Feedback alerts */}
        {actionSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '24px' }}>
            <CheckCircle2 size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <AlertCircle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid-4" style={{ marginBottom: '36px' }}>
          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Total Registrations</span>
              <Calendar size={18} color="var(--purple-accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              {totalRegistrations}
            </div>
          </div>

          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Upcoming Events</span>
              <Clock size={18} color="var(--purple-accent)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple-accent)' }}>
              {upcomingEvents.length}
            </div>
          </div>

          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Completed Events</span>
              <CheckCircle2 size={18} color="var(--success)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
              {completedEvents.length}
            </div>
          </div>

          <div className="card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Cancelled</span>
              <XCircle size={18} color="var(--error)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary-text)' }}>
              {cancelledRegistrations.length}
            </div>
          </div>
        </div>

        {/* Profile + Registrations Two-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.4fr', gap: '30px', alignItems: 'start' }}>
          {/* Left Column: Student Profile Details */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--purple-light)',
                color: 'var(--purple-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '1.5rem',
                fontWeight: 800
              }}>
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                {user?.fullName}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
                {user?.email}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Student ID
                </span>
                <p style={{ fontWeight: 600, color: 'var(--main-text)' }}>{user?.studentId || 'N/A'}</p>
              </div>

              <div>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Department
                </span>
                <p style={{ fontWeight: 600, color: 'var(--main-text)' }}>{user?.department || 'General'}</p>
              </div>

              <div>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Academic Year
                </span>
                <p style={{ fontWeight: 600, color: 'var(--main-text)' }}>{user?.academicYear || 'Undergraduate'}</p>
              </div>

              <div>
                <span style={{ color: 'var(--secondary-text)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Account Role
                </span>
                <p style={{ fontWeight: 600, color: 'var(--purple-accent)' }}>STUDENT</p>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <Link to="/events" className="btn btn-outline-primary btn-sm btn-full">
                <Sparkles size={14} /> Explore New Events
              </Link>
            </div>
          </div>

          {/* Right Column: Registrations History Table */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                My Event Registrations
              </h3>
              <button onClick={fetchMyRegistrations} className="btn btn-outline btn-sm">
                Refresh
              </button>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching your registered events..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchMyRegistrations} />
            ) : registrations.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-state-icon">
                  <Calendar size={28} />
                </div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '6px' }}>
                  No Registrations Yet
                </h4>
                <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  You haven't registered for any events yet. Check out upcoming hackathons, workshops, and sports meets!
                </p>
                <Link to="/events" className="btn btn-primary btn-sm">
                  Find Events Now
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Category</th>
                      <th>Date & Venue</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--primary-navy)', maxWidth: '240px' }}>
                            {reg.eventTitle}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
                            Registered on {formatDate(reg.registrationDate)}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                            {reg.category}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{formatDate(reg.eventDate)}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {reg.venue}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${reg.status === 'CONFIRMED' ? 'badge-success' : 'badge-error'}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <Link
                              to={`/events/${reg.eventId}`}
                              className="btn btn-outline btn-sm"
                              title="View Event Details"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            {reg.status === 'CONFIRMED' && reg.eventDate >= today && (
                              <button
                                onClick={() => setCancelTarget(reg)}
                                className="btn btn-outline-danger btn-sm"
                                title="Cancel Registration"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          title="Cancel Event Registration"
        >
          <div style={{ padding: '10px 0' }}>
            <p style={{ fontSize: '1rem', color: 'var(--main-text)', marginBottom: '14px' }}>
              Are you sure you want to cancel your registration for:
            </p>
            <div style={{ backgroundColor: 'var(--light-bg)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{cancelTarget?.eventTitle}</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                Date: {formatDate(cancelTarget?.eventDate)} • Venue: {cancelTarget?.venue}
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--secondary-text)', marginBottom: '20px' }}>
              Your reserved seat will be immediately released for other students.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="btn btn-outline"
                disabled={cancelling}
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleCancelRegistration}
                className="btn btn-danger"
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StudentDashboard;
