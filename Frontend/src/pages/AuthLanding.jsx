import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthLanding() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // FIX: clear hover state on unmount to prevent setState-on-unmounted-component warning
  useEffect(() => {
    return () => setHoveredBtn(null);
  }, []);

  const handleGuest = () => {
    continueAsGuest();
    navigate('/home');
  };

  const btnStyle = (id) => ({
    width: '100%',
    padding: '16px 20px',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    transform: hoveredBtn === id ? 'translateY(-1px)' : 'none',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-gradient)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>

        {/* Hero Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--success-light) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(16,185,129,0.15)'
          }}>
            <ShieldCheck size={36} color="var(--success)" strokeWidth={2.5} />
          </div>
          <h1 style={{
            fontSize: '32px', fontWeight: 800, margin: '0 0 12px',
            color: 'var(--text-main)', letterSpacing: '-0.5px'
          }}>
            Welcome to <span style={{
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Factify</span>
          </h1>
          <p style={{
            fontSize: '16px', color: 'var(--text-muted)', margin: 0,
            lineHeight: 1.5,
          }}>
            Verify information instantly and cut through the noise. Know what's real.
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '28px 24px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)' }}>
          <h2 style={{
            margin: '0 0 6px', fontSize: '20px', fontWeight: 700, color: 'var(--text-main)',
          }}>
            Get Started
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Choose how you'd like to continue.
          </p>

          {/* Login */}
          <button
            style={{
              ...btnStyle('login'),
              backgroundColor: 'var(--primary)',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '12px',
              boxShadow: hoveredBtn === 'login' ? '0 6px 20px rgba(37,99,235,0.35)' : '0 2px 8px rgba(37,99,235,0.2)',
            }}
            onClick={() => navigate('/login')}
            onMouseEnter={() => setHoveredBtn('login')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <LogIn size={20} />
            Log In
          </button>

          {/* Create Account */}
          <button
            style={{
              ...btnStyle('signup'),
              backgroundColor: 'var(--success)',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '20px',
              boxShadow: hoveredBtn === 'signup' ? '0 6px 20px rgba(16,185,129,0.35)' : '0 2px 8px rgba(16,185,129,0.2)',
            }}
            onClick={() => navigate('/signup')}
            onMouseEnter={() => setHoveredBtn('signup')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <UserPlus size={20} />
            Create Account
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* Guest */}
          <button
            style={{
              ...btnStyle('guest'),
              backgroundColor: 'var(--hover-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}
            onClick={handleGuest}
            onMouseEnter={() => setHoveredBtn('guest')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <UserCheck size={20} />
            Continue as Guest
          </button>

          <p style={{
            margin: '16px 0 0', textAlign: 'center', fontSize: '12px',
            color: 'var(--text-muted)', lineHeight: 1.5,
          }}>
            Guest mode stores history only on this device.
          </p>
        </div>
      </div>
    </div>
  );
}