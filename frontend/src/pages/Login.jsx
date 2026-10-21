import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'admin') {
      setEmail('admin@campusconnect.edu');
      setPassword('Admin@12345');
    } else {
      setEmail('student@rgukt.ac.in');
      setPassword('Student@1234');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        if (result.user.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate(from === '/login' ? '/dashboard' : from);
        }
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPw, tab = 'student') => {
    setActiveTab(tab);
    setEmail(demoEmail);
    setPassword(demoPw);
    setError('');
  };

  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: activeTab === 'admin' ? '#E2E8F0' : 'var(--purple-light)',
              color: activeTab === 'admin' ? 'var(--primary-navy)' : 'var(--purple-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              {activeTab === 'admin' ? <ShieldCheck size={28} /> : <LogIn size={26} />}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '6px' }}>
              {activeTab === 'admin' ? 'Administrator Portal' : 'Student Sign In'}
            </h1>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.92rem' }}>
              {activeTab === 'admin'
                ? 'Sign in with university administrative credentials'
                : 'Sign in to access your event registrations and profile'}
            </p>
          </div>

          {/* Role Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--light-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'var(--transition)',
                backgroundColor: activeTab === 'student' ? 'var(--white)' : 'transparent',
                color: activeTab === 'student' ? 'var(--purple-accent)' : 'var(--secondary-text)',
                boxShadow: activeTab === 'student' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <User size={16} /> Student
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.88rem',
                transition: 'var(--transition)',
                backgroundColor: activeTab === 'admin' ? 'var(--white)' : 'transparent',
                color: activeTab === 'admin' ? 'var(--primary-navy)' : 'var(--secondary-text)',
                boxShadow: activeTab === 'admin' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <ShieldCheck size={16} /> Administrator
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                {activeTab === 'admin' ? 'Administrator Email' : 'Student College Email'}
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder={activeTab === 'admin' ? 'admin@campusconnect.edu' : 'student@rgukt.ac.in'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-full ${activeTab === 'admin' ? 'btn-navy' : 'btn-primary'}`}
              style={{ marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : activeTab === 'admin' ? 'Sign In as Administrator' : 'Sign In as Student'}
            </button>
          </form>

          {/* Demo account quick login helper */}
          <div style={{
            marginTop: '24px',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '0.82rem',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--purple-accent)" /> 1-Click Demo Accounts:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillCredentials('student@rgukt.ac.in', 'Student@1234', 'student')}
                className={`btn btn-sm ${activeTab === 'student' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                Fill Student Credentials
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@campusconnect.edu', 'Admin@12345', 'admin')}
                className={`btn btn-sm ${activeTab === 'admin' ? 'btn-navy' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                Fill Admin Credentials
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.88rem', color: 'var(--secondary-text)' }}>
            {activeTab === 'student' ? (
              <>
                New student?{' '}
                <Link to="/register" style={{ color: 'var(--purple-accent)', fontWeight: 700 }}>
                  Create an account
                </Link>
              </>
            ) : (
              <span style={{ fontSize: '0.82rem' }}>
                Note: Administrator accounts are provisioned via backend security initialization.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
