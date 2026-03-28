import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, Share2 } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem('checkkaro_onboarded', 'true');
    navigate('/auth');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '40px' }}>Welcome to Factify</h1>
        
        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Search size={28} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>Paste or Upload</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Got a suspicious WhatsApp forward? Simply paste the text or upload a screenshot.</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>AI Verification</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>We use smart AI to check facts and tell if the news is real, misleading, or completely fake.</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Share2 size={28} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>Share the Truth</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Stop the spread of fake news by sharing the real facts with your friends & family.</p>
          </div>
        </div>
      </div>
      
      <div style={{ paddingTop: '20px' }}>
        <button className="btn btn-primary" onClick={handleStart}>
          Get Started
        </button>
      </div>
    </div>
  );
}
