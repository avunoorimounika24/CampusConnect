import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Target,
  ShieldCheck,
  Users,
  Award,
  Layers,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '40px 0 90px' }}>
      <div className="container">
        {/* Hero Banner */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
            Empowering Campus Life
          </span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '16px' }}>
            Unifying Collegiate Opportunities Across Every Department
          </h1>
          <p style={{ color: 'var(--secondary-text)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            CampusConnect was created to bridge the communication gap between university student bodies, technical clubs, cultural societies, and university administrators.
          </p>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid-2" style={{ marginBottom: '60px' }}>
          <div className="card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={24} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                Our Mission
              </h2>
            </div>
            <p style={{ color: 'var(--main-text)', fontSize: '1rem', lineHeight: 1.7 }}>
              To provide an intuitive, high-availability collegiate digital platform where students seamlessly discover transformative co-curricular experiences, participate without bureaucratic friction, and develop holistic academic and leadership capabilities.
            </p>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E2E8F0', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={24} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                Our Vision
              </h2>
            </div>
            <p style={{ color: 'var(--main-text)', fontSize: '1rem', lineHeight: 1.7 }}>
              To establish a university ecosystem where student engagement is transparent, data-driven, and accessible to every learner—cultivating a vibrant campus culture celebrated for innovation, sporting excellence, and artistic expression.
            </p>
          </div>
        </div>

        {/* Problems Solved Section */}
        <div className="card" style={{ padding: '44px', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
            <span className="badge badge-navy" style={{ marginBottom: '8px' }}>Modern Digital Infrastructure</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              Problems CampusConnect Solves
            </h2>
            <p style={{ color: 'var(--secondary-text)' }}>
              Moving universities away from outdated bulletin boards and unmanaged spreadsheets.
            </p>
          </div>

          <div className="grid-3">
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--purple-accent)" /> Fragmented Notices
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                Events are often scattered across WhatsApp groups, physical bulletin boards, and departmental emails. CampusConnect unifies every event into a single live catalog.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--purple-accent)" /> Hall & Lab Overbooking
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                Unregulated registrations frequently result in overcapacity at workshops and computer labs. Concurrency-safe seat limits ensure safe, manageable venue occupancy.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--purple-accent)" /> Messy Google Sheets
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                Organizers previously spent hours manually deduplicating spreadsheets and confirming student authenticity. CampusConnect handles validation, authentication, and reporting automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Pillars */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              Designed For the Entire University Community
            </h2>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--purple-light)', color: 'var(--purple-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                For Students
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                Explore hackathons, sports championships, guest lectures, and cultural fests. Receive instant enrollment confirmation and access your personalized participation history anytime.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#E2E8F0', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                For Student Clubs
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                Publish initiatives with clear schedules, set participation caps, manage promotional banners, and easily download verified attendee rosters.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '10px' }}>
                For Administration
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--secondary-text)', lineHeight: 1.6 }}>
                Gain full visibility into campus activities, audit student engagement trends, regulate campus venue utilization, and address student queries securely.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="card" style={{
          padding: '48px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--primary-navy) 0%, var(--secondary-navy) 100%)',
          color: 'var(--white)'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Experience CampusConnect Today
          </h2>
          <p style={{ color: '#CBD5E1', maxWidth: '560px', margin: '0 auto 24px', fontSize: '1.02rem' }}>
            Discover upcoming hackathons and departmental workshops, or contact our campus administration office.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn btn-primary">
              Browse Events Catalog
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.3)' }}>
              Contact Office
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
