import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <div className="brand-icon-box">
              <Calendar size={22} />
            </div>
            <span>Campus<span style={{ color: 'var(--purple-accent)' }}>Connect</span></span>
          </Link>

          {/* Nav Links */}
          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Explore Events
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              About Us
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
              Contact
            </NavLink>

            {/* Mobile-only auth buttons */}
            {mobileMenuOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {isAuthenticated ? (
                  <>
                    {isAdmin ? (
                      <Link to="/admin" className="btn btn-navy btn-sm" onClick={closeMenu}>
                        <ShieldCheck size={16} /> Admin Portal
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="btn btn-navy btn-sm" onClick={closeMenu}>
                        <User size={16} /> Student Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                      Sign In
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                      Join CampusConnect
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isAdmin ? (
                  <Link to="/admin" className="btn btn-navy btn-sm">
                    <ShieldCheck size={16} /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-navy btn-sm">
                    <User size={16} /> My Dashboard
                  </Link>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-purple" style={{ textTransform: 'none', fontWeight: 600 }}>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm" title="Sign Out">
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <Sparkles size={15} /> Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
