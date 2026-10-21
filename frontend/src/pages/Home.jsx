import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Trophy,
  GraduationCap,
  Layers,
  Code,
  Palette,
  Briefcase,
  Flame
} from 'lucide-react';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eventsRes, statsRes] = await Promise.all([
        eventService.getFeaturedEvents(3),
        eventService.getPublicStats()
      ]);

      if (eventsRes.success) {
        setFeaturedEvents(eventsRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data || {});
      }
    } catch (err) {
      console.error('Failed to load home page data:', err);
      setError('Unable to retrieve featured events and live statistics from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = [
    { name: 'Technical', icon: <Code size={22} />, count: 'Tech & Coding', query: 'TECHNICAL' },
    { name: 'Hackathons', icon: <Flame size={22} />, count: '36h Competitions', query: 'HACKATHONS' },
    { name: 'Workshops', icon: <Layers size={22} />, count: 'Hands-on Labs', query: 'WORKSHOPS' },
    { name: 'Seminars', icon: <GraduationCap size={22} />, count: 'Expert Talks', query: 'SEMINARS' },
    { name: 'Cultural', icon: <Palette size={22} />, count: 'Music & Arts', query: 'CULTURAL' },
    { name: 'Sports', icon: <Trophy size={22} />, count: 'Tournaments', query: 'SPORTS' },
    { name: 'Entrepreneurship', icon: <Briefcase size={22} />, count: 'E-Cell & Startups', query: 'ENTREPRENEURSHIP' },
    { name: 'Other', icon: <Users size={22} />, count: 'Clubs & Meets', query: 'OTHER' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="hero-tag">
                <Sparkles size={16} /> Official Collegiate Event Portal
              </span>
              <h1 className="hero-title">
                Your Campus. <br />
                Your Community. <br />
                <span className="highlight">Your Events.</span>
              </h1>
              <p className="hero-subtitle">
                CampusConnect is the centralized university event platform connecting students, academic departments, clubs, and organizers. Discover workshops, register in seconds, and elevate your college experience.
              </p>
              <div className="hero-ctas">
                <Link to="/events" className="btn btn-primary btn-lg">
                  <Search size={18} /> Explore Events
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg" style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.4)' }}>
                  Join CampusConnect <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Live Platform Stats */}
            <div className="hero-stats-card">
              <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--purple-accent)" /> Verified Platform Impact
              </h3>
              <div className="stat-box-grid">
                <div className="stat-box">
                  <div className="stat-value">{stats.totalEvents || 0}</div>
                  <div className="stat-label">Total Events Hosted</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{stats.upcomingEvents || 0}</div>
                  <div className="stat-label">Upcoming Active Events</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{stats.totalRegistrations || 0}</div>
                  <div className="stat-label">Student Registrations</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{stats.totalStudents || 0}</div>
                  <div className="stat-label">Registered Students</div>
                </div>
              </div>
              <p style={{ marginTop: '18px', fontSize: '0.8rem', color: '#A0ABC0', textAlign: 'center' }}>
                * All statistics are retrieved live from our Spring Boot backend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Spotlight</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                Featured Upcoming Events
              </h2>
              <p style={{ color: 'var(--secondary-text)', fontSize: '1rem', marginTop: '4px' }}>
                Handpicked college events happening soon across university departments.
              </p>
            </div>
            <Link to="/events" className="btn btn-outline-primary">
              View All Events <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching featured upcoming events..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchData} />
          ) : featuredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Calendar size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '8px' }}>
                No Featured Events At This Moment
              </h3>
              <p style={{ color: 'var(--secondary-text)', maxWidth: '420px', margin: '0 auto 20px' }}>
                Check back soon or explore the full events schedule to discover department workshops and activities.
              </p>
              <Link to="/events" className="btn btn-primary">
                Explore Event Catalog
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Categories */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '8px' }}>Ecosystem</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              Explore by Category
            </h2>
            <p style={{ color: 'var(--secondary-text)', fontSize: '1rem', marginTop: '6px' }}>
              Find exactly what matches your academic interests, artistic passion, or athletic spirit.
            </p>
          </div>

          <div className="grid-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/events?category=${cat.query}`}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--purple-light)',
                  color: 'var(--purple-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '3px' }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--secondary-text)' }}>
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
            <span className="badge badge-navy" style={{ marginBottom: '8px' }}>Step-by-Step Flow</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              How CampusConnect Works
            </h2>
            <p style={{ color: 'var(--secondary-text)', fontSize: '1rem', marginTop: '6px' }}>
              A seamless end-to-end journey from event discovery to registration and participation.
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-navy)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                Discover Events
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', lineHeight: 1.5 }}>
                Browse verified campus events, seminars, cultural fests, and hackathons with real-time seat availability.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--purple-accent)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                Instant Registration
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', lineHeight: 1.5 }}>
                Sign in with your student credentials and secure your seat with a single click before the deadline.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--secondary-navy)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                Track & Manage
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', lineHeight: 1.5 }}>
                Monitor your registrations in your personalized student dashboard, view venues, or cancel if plans change.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                fontSize: '1.25rem',
                fontWeight: 800
              }}>
                4
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                Attend & Lead
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', lineHeight: 1.5 }}>
                Participate in campus activities, network with peers and industry experts, and build your extracurricular profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section for Students and Organizers */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <div className="grid-2">
            {/* For Students */}
            <div className="card" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={24} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                  For University Students
                </h3>
              </div>
              <p style={{ color: 'var(--secondary-text)', marginBottom: '24px', fontSize: '0.95rem' }}>
                Never miss an internal workshop, placement seminar, or cultural extravaganza. CampusConnect provides:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Centralized single source of truth for all college circulars and events.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>One-click authenticated registration with automatic capacity validation.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Personalized dashboard showing registration history, venues, and schedules.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Safe self-service cancellation when scheduling conflicts occur.</span>
                </li>
              </ul>
            </div>

            {/* For Clubs & Faculty Coordinators */}
            <div className="card" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#E2E8F0', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                  For Clubs & Faculty Coordinators
                </h3>
              </div>
              <p style={{ color: 'var(--secondary-text)', marginBottom: '24px', fontSize: '0.95rem' }}>
                Eliminate messy Google Sheets, duplicate entries, and auditorium overbooking. Campus administrators gain:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Enterprise admin control to publish, modify, reschedule, or cancel events.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Rigorous seat limits preventing auditorium and computer lab oversubscription.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Live participant lists with verified student IDs, department, and email.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--main-text)' }}>Centralized student inquiries and query tracking in MySQL.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Participate CTA */}
      <section style={{
        padding: '70px 0',
        background: 'linear-gradient(135deg, var(--secondary-navy) 0%, var(--primary-navy) 100%)',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>
            Ready to Connect with Campus Life?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#CBD5E1', marginBottom: '32px' }}>
            Join thousands of students and faculty members already participating in college workshops, sports, and cultural festivals.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Student Account
            </Link>
            <Link to="/events" className="btn btn-outline btn-lg" style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.4)' }}>
              Browse Upcoming Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
