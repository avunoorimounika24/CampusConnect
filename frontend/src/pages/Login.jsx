import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

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

  // Quick fill helper for demo convenience
  const fillCredentials = (demoEmail, demoPw) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setError('');
  };

  return (
    <div style={{ padding: '60px 0 100px' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--purple-light)',
              color: 'var(--purple-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <LogIn size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)', marginBottom: '6px' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.92rem' }}>
              Sign in to manage your campus registrations and events
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">College Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="name@rgukt.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
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
              className="btn btn-primary btn-full"
              style={{ marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Demo account quick login helper */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#F8FAFC',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontSize: '0.82rem'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--purple-accent)" /> Demo Accounts:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillCredentials('student@rgukt.ac.in', 'Student@1234')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@campusconnect.edu', 'Admin@12345')}
                className="btn btn-navy btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
            New student?{' '}
            <Link to="/register" style={{ color: 'var(--purple-accent)', fontWeight: 700 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
