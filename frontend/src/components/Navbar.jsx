import React, { useState, useEffect } from 'react';
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

  // Close menu on Escape key or window resize to desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="navbar">
      {/* Mobile backdrop overlay */}
      <div
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

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
          <nav
            id="primary-navigation"
            aria-label="Main navigation"
            className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}
          >
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

            {/* Mobile-only auth section */}
            <div className="mobile-nav-auth">
              {isAuthenticated ? (
                <>
                  <div className="mobile-user-info">
                    <span className="badge badge-purple" style={{ textTransform: 'none', fontWeight: 600 }}>
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </span>
                    <span className="mobile-user-role">{isAdmin ? 'Administrator' : 'Student'}</span>
                  </div>
                  {isAdmin ? (
                    <Link to="/admin" className="btn btn-navy btn-sm btn-full" onClick={closeMenu}>
                      <ShieldCheck size={16} /> Admin Portal
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="btn btn-navy btn-sm btn-full" onClick={closeMenu}>
                      <User size={16} /> Student Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm btn-full">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline btn-sm btn-full" onClick={closeMenu}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm btn-full" onClick={closeMenu}>
                    <Sparkles size={15} /> Join CampusConnect
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Desktop-only right actions */}
            <div className="desktop-nav-actions">
              {isAuthenticated ? (
                <div className="nav-admin-group">
                  {isAdmin ? (
                    <Link to="/admin" className="btn btn-navy btn-sm nav-portal-btn">
                      <ShieldCheck size={16} /> Admin Portal
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="btn btn-navy btn-sm nav-portal-btn">
                      <User size={16} /> Dashboard
                    </Link>
                  )}

                  <div className="nav-user-badge-group">
                    <span className="badge badge-purple nav-user-badge" title={user?.fullName || 'User'}>
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger btn-sm nav-signout-btn"
                      title="Sign Out"
                    >
                      <LogOut size={15} />
                      <span className="nav-signout-text">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="nav-guest-group">
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    <Sparkles size={15} /> Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-navigation"
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
