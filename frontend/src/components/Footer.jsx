import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="brand-logo" style={{ color: 'var(--white)', marginBottom: '14px' }}>
              <div className="brand-icon-box">
                <Calendar size={20} />
              </div>
              <span>CampusConnect</span>
            </div>
            <p className="footer-brand-desc">
              The centralized college event management system connecting students, clubs, faculty coordinators, and college administration for a vibrant campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Explore Events</Link></li>
              <li><Link to="/about">About CampusConnect</Link></li>
              <li><Link to="/contact">Contact Administration</Link></li>
              <li><Link to="/login">Student & Admin Login</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/events?category=HACKATHONS">Hackathons</Link></li>
              <li><Link to="/events?category=WORKSHOPS">Workshops</Link></li>
              <li><Link to="/events?category=SEMINARS">Seminars</Link></li>
              <li><Link to="/events?category=CULTURAL">Cultural Fests</Link></li>
              <li><Link to="/events?category=SPORTS">Sports Tournaments</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-heading">Campus Office</h4>
            <ul className="footer-links" style={{ gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={18} style={{ color: 'var(--purple-accent)', flexShrink: 0, marginTop: '2px' }} />
                <span>Student Activity Center, Central Campus, Rajiv Gandhi University of Knowledge Technologies, Basar</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} />
                <span>events@campusconnect.edu</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} style={{ color: 'var(--purple-accent)', flexShrink: 0 }} />
                <span>+91 8752 255588</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CampusConnect. All rights reserved. University Event Management System.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Powered by Spring Boot 3 & React</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
