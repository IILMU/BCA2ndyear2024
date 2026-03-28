import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { isLoggedIn, isGuest } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn || isGuest) {
        navigate('/home');
      } else {
        // Show onboarding only the very first time (before any auth)
        const hasOnboarded = localStorage.getItem('checkkaro_onboarded');
        navigate(hasOnboarded ? '/auth' : '/onboarding');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isLoggedIn, isGuest]);

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--primary)',
      color: 'rgba(255, 255, 255, 0.85)',
      height: '100vh',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 50
    }} className="fade-in">
      <div className="card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', textAlign: 'center' }}>
        <ShieldCheck size={80} color="rgba(255, 255, 255, 0.85)" style={{ marginBottom: '24px', opacity: 0.9 }} />
        <h1 style={{
          background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '36px', marginBottom: '8px', letterSpacing: '-0.5px'
        }}>Factify</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: 400, letterSpacing: '0.3px' }}>
          Cut Through the Noise.
        </p>
      </div>
    </div>
  );
}
