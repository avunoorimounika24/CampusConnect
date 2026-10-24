import React, { useState } from 'react';
import { contactService } from '../services/contactService';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setFieldErrors({});

    // Client-side validations
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email address is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message cannot be empty';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.submitMessage(formData);
      if (res.success) {
        setSuccessMsg(res.message || 'Your message has been received! Our campus coordinators will review it shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Failed to submit message:', err);
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        setFieldErrors(err.response.data.data);
      }
      setErrorMsg(err.response?.data?.message || 'Failed to submit message. Please verify input fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-py" style={{ paddingTop: '40px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Direct Communication</span>
          <h1 className="page-title">
            Get in Touch with Campus Administration
          </h1>
          <p className="page-subtitle">
            Have questions regarding upcoming hackathons, club registration, or venue bookings? Send us a message or visit our campus office.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information Card */}
          <div className="card card-padded">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '18px' }}>
              Campus Office Information
            </h3>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.92rem', marginBottom: '28px', lineHeight: 1.6 }}>
              Our Student Activity and Event Coordination Cell is available Monday through Saturday during university working hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '3px' }}>
                    University Location
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--secondary-text)', lineHeight: 1.5 }}>
                    Student Activity Center (SAC), Ground Floor, Central Campus, Rajiv Gandhi University of Knowledge Technologies, Basar, Nirmal District, Telangana - 504107
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '3px' }}>
                    Official Email
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--secondary-text)' }}>
                    events@campusconnect.edu<br />
                    studentaffairs@rgukt.ac.in
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '3px' }}>
                    Helpline & Phone
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--secondary-text)' }}>
                    +91 8752 255588 / 255589 (Ext. 204)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '3px' }}>
                    Office Working Hours
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--secondary-text)' }}>
                    Monday – Friday: 9:00 AM – 5:30 PM<br />
                    Saturday: 9:30 AM – 1:00 PM (Closed Sundays)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Submission Form */}
          <div className="card card-padded">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '18px' }}>
              Send an Official Inquiry
            </h3>

            {successMsg && (
              <div className="alert alert-success" style={{ marginBottom: '22px' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-error" style={{ marginBottom: '22px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.name && <span className="form-error-text">{fieldErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Your Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="name@rgukt.ac.in"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.email && <span className="form-error-text">{fieldErrors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject / Purpose of Inquiry *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Query regarding CodeSpark Hackathon team size"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.subject && <span className="form-error-text">{fieldErrors.subject}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  style={{ minHeight: '140px' }}
                  placeholder="Please write your detailed query or feedback here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.message && <span className="form-error-text">{fieldErrors.message}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Submitting to Campus Database...' : (
                  <>
                    <Send size={16} /> Send Inquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
