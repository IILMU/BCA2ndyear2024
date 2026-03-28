import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser(name.trim(), email.trim(), password);
      login(data.token, data.user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 44px',
    borderRadius: '12px', border: '1.5px solid var(--border-color)',
    fontFamily: 'var(--font-family)',
    fontSize: '15px', outline: 'none',
    transition: 'border-color 0.2s',
  };
  const iconStyle = {
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-gradient)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
            Create an Account
          </h1>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-muted)' }}>
            Join Factify and verify facts instantly
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px 24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
          <form onSubmit={handleSignup} noValidate>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start',
                padding: '12px 14px', borderRadius: '10px',
                backgroundColor: 'var(--danger-light)', marginBottom: '20px',
              }}>
                <AlertCircle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--danger)', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="input-wrapper" style={{ marginBottom: '14px' }}>
              <User size={18} className="input-icon" style={iconStyle} />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="input-wrapper" style={{ marginBottom: '14px' }}>
              <Mail size={18} className="input-icon" style={iconStyle} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="input-wrapper" style={{ marginBottom: '24px' }}>
              <Lock size={18} className="input-icon" style={iconStyle} />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e  => e.target.style.borderColor = 'var(--border-color)'}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px',
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary login-btn"
              style={{
                width: '100%', padding: '15px',
                borderRadius: '12px',
                fontSize: '16px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginBottom: '16px',
              }}
            >
              <UserPlus size={18} />
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            {/* Links */}
            <p style={{ textAlign: 'center', margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Log in
              </span>
            </p>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span onClick={() => navigate('/auth')} style={{ cursor: 'pointer' }}>← Back</span>
        </p>
      </div>
    </div>
  );
}
