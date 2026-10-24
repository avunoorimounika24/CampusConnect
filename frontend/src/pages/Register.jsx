import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Science and Engineering',
    academicYear: 'Final Year (E4)',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const departments = [
    'Computer Science and Engineering',
    'Electronics and Communications Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Materials Science and Metallurgical Engineering',
    'Humanities and Sciences'
  ];

  const academicYears = [
    'Pre-University Course (P1)',
    'Pre-University Course (P2)',
    'First Year (E1)',
    'Second Year (E2)',
    'Third Year (E3)',
    'Final Year (E4)',
    'Postgraduate / Research Scholar'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field-specific error
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validations
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'College email is required';
    if (!formData.studentId.trim()) errors.studentId = 'Student ID is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors indicated below.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        studentId: formData.studentId.trim().toUpperCase(),
        department: formData.department,
        academicYear: formData.academicYear,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        setFieldErrors(err.response.data.data);
      }
      setError(err.response?.data?.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrap">
      <div className="container" style={{ maxWidth: '620px' }}>
        <div className="card auth-card">
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
              <UserPlus size={24} />
            </div>
            <h1 className="page-title" style={{ fontSize: '1.8rem', textAlign: 'center' }}>
              Create Student Account
            </h1>
            <p className="page-subtitle" style={{ fontSize: '0.92rem', textAlign: 'center' }}>
              Join CampusConnect with your university student profile
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
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="Avunoori Mounika"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {fieldErrors.fullName && <span className="form-error-text">{fieldErrors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">College Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="student@rgukt.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && <span className="form-error-text">{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="studentId">Student ID *</label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className="form-input"
                  placeholder="B200001"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.studentId && <span className="form-error-text">{fieldErrors.studentId}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="academicYear">Academic Year *</label>
                <select
                  id="academicYear"
                  name="academicYear"
                  className="form-select"
                  value={formData.academicYear}
                  onChange={handleChange}
                >
                  {academicYears.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password (min 6 chars) *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.password && <span className="form-error-text">{fieldErrors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.confirmPassword && <span className="form-error-text">{fieldErrors.confirmPassword}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Creating Student Profile...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>
            Already have a student account?{' '}
            <Link to="/login" style={{ color: 'var(--purple-accent)', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
