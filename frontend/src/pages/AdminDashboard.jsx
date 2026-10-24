import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Power,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters for event table
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Action status feedback
  const [feedback, setFeedback] = useState({ success: null, error: null });

  // Event Create / Edit Form Modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    venue: '',
    organizer: '',
    registrationDeadline: '',
    capacity: 100,
    imageUrl: '',
    status: 'ACTIVE'
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // View Attendees Modal
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, eventsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllEvents({
          search: search || undefined,
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
          size: 50
        })
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (eventsRes.success) setEvents(eventsRes.data?.content || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError('Failed to load administrative data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingEventId(null);
    setEventFormData({
      title: '',
      description: '',
      category: 'TECHNICAL',
      eventDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      venue: '',
      organizer: '',
      registrationDeadline: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16),
      capacity: 100,
      imageUrl: '',
      status: 'ACTIVE'
    });
    setFormErrors({});
    setShowEventModal(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setEditingEventId(event.id);
    setEventFormData({
      title: event.title || '',
      description: event.description || '',
      category: event.category || 'TECHNICAL',
      eventDate: event.eventDate || '',
      startTime: event.startTime ? event.startTime.slice(0, 5) : '09:00',
      endTime: event.endTime ? event.endTime.slice(0, 5) : '17:00',
      venue: event.venue || '',
      organizer: event.organizer || '',
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.slice(0, 16) : '',
      capacity: event.capacity || 100,
      imageUrl: event.imageUrl || '',
      status: event.status || 'ACTIVE'
    });
    setFormErrors({});
    setShowEventModal(true);
  };

  const handleEventFormChange = (e) => {
    setEventFormData({
      ...eventFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Validations
    const errors = {};
    if (!eventFormData.title.trim()) errors.title = 'Title is required';
    if (!eventFormData.description.trim()) errors.description = 'Description is required';
    if (!eventFormData.eventDate) errors.eventDate = 'Event date is required';
    if (!eventFormData.startTime) errors.startTime = 'Start time is required';
    if (!eventFormData.endTime) errors.endTime = 'End time is required';
    if (eventFormData.startTime >= eventFormData.endTime) errors.endTime = 'End time must be after start time';
    if (!eventFormData.venue.trim()) errors.venue = 'Venue is required';
    if (!eventFormData.organizer.trim()) errors.organizer = 'Organizer is required';
    if (!eventFormData.registrationDeadline) errors.registrationDeadline = 'Deadline is required';
    if (!eventFormData.capacity || Number(eventFormData.capacity) < 1) errors.capacity = 'Capacity must be at least 1';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormSubmitting(true);
    setFeedback({ success: null, error: null });
    try {
      // Normalize times for LocalTime (HH:mm:ss) and LocalDateTime
      const payload = {
        ...eventFormData,
        capacity: Number(eventFormData.capacity),
        startTime: eventFormData.startTime.length === 5 ? `${eventFormData.startTime}:00` : eventFormData.startTime,
        endTime: eventFormData.endTime.length === 5 ? `${eventFormData.endTime}:00` : eventFormData.endTime,
        registrationDeadline: eventFormData.registrationDeadline.length === 16 ? `${eventFormData.registrationDeadline}:00` : eventFormData.registrationDeadline
      };

      if (isEditing) {
        await adminService.updateEvent(editingEventId, payload);
        setFeedback({ success: 'Event updated successfully!', error: null });
      } else {
        await adminService.createEvent(payload);
        setFeedback({ success: 'Event created and published successfully!', error: null });
      }

      setShowEventModal(false);
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to save event:', err);
      setFeedback({ success: null, error: err.response?.data?.message || 'Failed to save event.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (eventId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE';
    try {
      await adminService.updateEventStatus(eventId, newStatus);
      setFeedback({ success: `Event status updated to ${newStatus}`, error: null });
      await fetchDashboardData();
    } catch (err) {
      setFeedback({ success: null, error: 'Failed to update event status.' });
    }
  };

  const openAttendeesModal = async (event) => {
    setSelectedEventTitle(event.title);
    setShowAttendeesModal(true);
    setAttendeesLoading(true);
    try {
      const res = await adminService.getEventRegistrations(event.id);
      if (res.success) {
        setSelectedEventAttendees(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setAttendeesLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteEvent(deleteTarget.id);
      setFeedback({ success: `Event "${deleteTarget.title}" was successfully deleted.`, error: null });
      setShowDeleteModal(false);
      setDeleteTarget(null);
      await fetchDashboardData();
    } catch (err) {
      setFeedback({ success: null, error: err.response?.data?.message || 'Failed to delete event.' });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="section-py" style={{ paddingTop: '40px' }}>
      <div className="container">
        {/* Header Title & Actions */}
        <div className="admin-header">
          <div>
            <span className="badge badge-navy" style={{ marginBottom: '6px' }}>Administrative Control Panel</span>
            <h1 className="page-title">
              College Event Administration
            </h1>
            <p className="page-subtitle">
              Create and manage collegiate events, monitor real-time student registrations, and manage capacity limits.
            </p>
          </div>
          <div className="admin-header-actions">
            <button onClick={fetchDashboardData} className="btn btn-outline">
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={openCreateModal} className="btn btn-primary">
              <Plus size={18} /> Create New Event
            </button>
          </div>
        </div>

        {/* Feedback banners */}
        {feedback.success && (
          <div className="alert alert-success" style={{ marginBottom: '24px' }}>
            <CheckCircle2 size={18} />
            <span>{feedback.success}</span>
          </div>
        )}
        {feedback.error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            <AlertCircle size={18} />
            <span>{feedback.error}</span>
          </div>
        )}

        {/* Statistical Overview Grid */}
        <div className="stats-grid" style={{ marginBottom: '36px' }}>
          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Total Events</span>
              <Calendar size={18} color="var(--purple-accent)" />
            </div>
            <div className="stat-card-value" style={{ color: 'var(--primary-navy)' }}>
              {stats?.totalEvents ?? 0}
            </div>
          </div>

          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Upcoming Active</span>
              <Clock size={18} color="var(--purple-accent)" />
            </div>
            <div className="stat-card-value" style={{ color: 'var(--purple-accent)' }}>
              {stats?.upcomingEvents ?? 0}
            </div>
          </div>

          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Total Registrations</span>
              <CheckCircle2 size={18} color="var(--success)" />
            </div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>
              {stats?.totalRegistrations ?? 0}
            </div>
          </div>

          <div className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Enrolled Students</span>
              <Users size={18} color="var(--primary-navy)" />
            </div>
            <div className="stat-card-value" style={{ color: 'var(--primary-navy)' }}>
              {stats?.totalStudents ?? 0}
            </div>
          </div>
        </div>

        {/* Event Management Table Card */}
        <div className="card card-padded" style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              Manage Events ({events.length})
            </h3>

            {/* Filter Bar */}
            <form onSubmit={handleSearchSubmit} className="admin-filter-form">
              <input
                type="text"
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                placeholder="Search title, venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="TECHNICAL">Technical</option>
                <option value="HACKATHONS">Hackathons</option>
                <option value="WORKSHOPS">Workshops</option>
                <option value="SEMINARS">Seminars</option>
                <option value="CULTURAL">Cultural</option>
                <option value="SPORTS">Sports</option>
                <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
                <option value="OTHER">Other</option>
              </select>
              <select
                className="form-select"
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <button type="submit" className="btn btn-navy btn-sm">
                Filter
              </button>
            </form>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading events repository..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDashboardData} />
          ) : events.length === 0 ? (
            <div className="empty-state">
              <p style={{ color: 'var(--secondary-text)' }}>No events match current administrative filters.</p>
            </div>
          ) : (
            <div>
              <div className="table-responsive">
                <table className="custom-table custom-table-admin">
                  <thead>
                    <tr>
                      <th>Event Details</th>
                      <th>Category</th>
                      <th>Date & Venue</th>
                      <th>Registrations</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{ev.title}</div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>By: {ev.organizer}</span>
                        </td>
                        <td>
                          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{ev.category}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{formatDate(ev.eventDate)}</div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>{ev.venue}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: ev.registeredCount >= ev.capacity ? 'var(--error)' : 'var(--primary-navy)' }}>
                            {ev.registeredCount} / {ev.capacity}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--secondary-text)' }}>
                            {Math.max(0, ev.capacity - ev.registeredCount)} seats left
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ev.status === 'ACTIVE' ? 'badge-success' : ev.status === 'COMPLETED' ? 'badge-navy' : 'badge-error'}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openAttendeesModal(ev)}
                              className="btn btn-outline btn-sm"
                              title="View registered student participants"
                            >
                              <Users size={14} />
                            </button>
                            <button
                              onClick={() => openEditModal(ev)}
                              className="btn btn-outline btn-sm"
                              title="Edit Event"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(ev.id, ev.status)}
                              className={`btn btn-sm ${ev.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                              title={ev.status === 'ACTIVE' ? 'Deactivate / Cancel Event' : 'Reactivate Event'}
                            >
                              <Power size={14} />
                            </button>
                            <button
                              onClick={() => { setDeleteTarget(ev); setShowDeleteModal(true); }}
                              className="btn btn-outline-danger btn-sm"
                              title="Delete Event"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="table-scroll-hint">← Scroll horizontally to view all columns & actions →</p>
            </div>
          )}
        </div>

        {/* Recent Registrations Table */}
        <div className="card card-padded">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '18px' }}>
            Recent Platform Registrations
          </h3>
          {stats?.recentRegistrations?.length > 0 ? (
            <div>
              <div className="table-responsive">
                <table className="custom-table custom-table-registrations">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Department</th>
                      <th>Registered Event</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentRegistrations.map((reg) => (
                      <tr key={reg.id}>
                        <td style={{ fontWeight: 600 }}>{reg.studentName}</td>
                        <td><span className="badge badge-navy">{reg.studentId || 'N/A'}</span></td>
                        <td style={{ fontSize: '0.85rem' }}>{reg.department || 'General'}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{reg.eventTitle}</td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>
                          {formatDate(reg.registrationDate)}
                        </td>
                        <td>
                          <span className={`badge ${reg.status === 'CONFIRMED' ? 'badge-success' : 'badge-error'}`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="table-scroll-hint">← Scroll horizontally to view all columns →</p>
            </div>
          ) : (
            <p style={{ color: 'var(--secondary-text)' }}>No student registrations recorded yet.</p>
          )}
        </div>

        {/* Modal: Create / Edit Event */}
        <Modal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          title={isEditing ? 'Edit Event Details' : 'Create & Publish New Event'}
        >
          <form onSubmit={handleEventFormSubmit}>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. AI & Robotics Hackathon 2026"
                value={eventFormData.title}
                onChange={handleEventFormChange}
                required
              />
              {formErrors.title && <span className="form-error-text">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Provide detailed information regarding problem statements, eligibility, and agenda..."
                value={eventFormData.description}
                onChange={handleEventFormChange}
                required
              />
              {formErrors.description && <span className="form-error-text">{formErrors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={eventFormData.category}
                  onChange={handleEventFormChange}
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="HACKATHONS">Hackathons</option>
                  <option value="WORKSHOPS">Workshops</option>
                  <option value="SEMINARS">Seminars</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="SPORTS">Sports</option>
                  <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-input"
                  value={eventFormData.eventDate}
                  onChange={handleEventFormChange}
                  required
                />
                {formErrors.eventDate && <span className="form-error-text">{formErrors.eventDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  className="form-input"
                  value={eventFormData.startTime}
                  onChange={handleEventFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  className="form-input"
                  value={eventFormData.endTime}
                  onChange={handleEventFormChange}
                  required
                />
                {formErrors.endTime && <span className="form-error-text">{formErrors.endTime}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Venue / Hall *</label>
                <input
                  type="text"
                  name="venue"
                  className="form-input"
                  placeholder="e.g. Auditorium Hall B"
                  value={eventFormData.venue}
                  onChange={handleEventFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organizer / Department *</label>
                <input
                  type="text"
                  name="organizer"
                  className="form-input"
                  placeholder="e.g. Coding Club & Dept of CSE"
                  value={eventFormData.organizer}
                  onChange={handleEventFormChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  className="form-input"
                  value={eventFormData.registrationDeadline}
                  onChange={handleEventFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-input"
                  min="1"
                  value={eventFormData.capacity}
                  onChange={handleEventFormChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={eventFormData.imageUrl}
                  onChange={handleEventFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={eventFormData.status}
                  onChange={handleEventFormChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="btn btn-outline"
                disabled={formSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Saving to Database...' : isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal: View Registered Students */}
        <Modal
          isOpen={showAttendeesModal}
          onClose={() => setShowAttendeesModal(false)}
          title={`Registered Attendees: ${selectedEventTitle}`}
        >
          {attendeesLoading ? (
            <LoadingSpinner message="Fetching enrolled students..." />
          ) : selectedEventAttendees.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p style={{ color: 'var(--secondary-text)' }}>No students registered for this event yet.</p>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: '14px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
                Total enrolled: <strong>{selectedEventAttendees.length} students</strong>
              </p>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="custom-table custom-table-attendees">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Student ID</th>
                      <th>Department</th>
                      <th>Registered On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEventAttendees.map((att) => (
                      <tr key={att.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{att.studentName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)' }}>{att.studentEmail}</div>
                        </td>
                        <td><span className="badge badge-navy">{att.studentId || 'N/A'}</span></td>
                        <td style={{ fontSize: '0.85rem' }}>{att.department || 'N/A'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                          {formatDate(att.registrationDate)}
                        </td>
                        <td>
                          <span className={`badge ${att.status === 'CONFIRMED' ? 'badge-success' : 'badge-error'}`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal: Delete Confirmation */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Event Confirmation"
        >
          <div style={{ padding: '10px 0' }}>
            <p style={{ fontSize: '1rem', color: 'var(--main-text)', marginBottom: '14px' }}>
              Are you sure you want to permanently delete event <strong>{deleteTarget?.title}</strong>?
            </p>
            <div style={{ backgroundColor: 'var(--error-light)', padding: '14px', borderRadius: 'var(--radius-md)', color: 'var(--error)', fontSize: '0.88rem', marginBottom: '20px' }}>
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
              This action will remove the event record from MySQL along with associated registration references.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEvent}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
