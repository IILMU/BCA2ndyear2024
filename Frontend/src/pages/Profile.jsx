import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Activity, Globe, Bell, Trash2, HelpCircle, Info, LogOut, ChevronRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isGuest, logout } = useAuth();

  const [stats, setStats] = useState({ total: 0, fake: 0, verified: 0 });
  const [prefs, setPrefs] = useState({ language: 'en', notifications: true });

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem('checkkaro_history');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        const fake     = history.filter(item => item.status === 'Fake' || item.status === 'Misleading').length;
        const verified = history.filter(item => item.status === 'Verified').length;
        setStats({ total: history.length, fake, verified });
      }
      const savedPrefs = localStorage.getItem('checkkaro_prefs');
      if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checkkaro_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const togglePref = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to permanently delete all your scan history?')) {
      localStorage.removeItem('checkkaro_history');
      setStats({ total: 0, fake: 0, verified: 0 });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/auth');
    }
  };

  const handleGuestLogout = () => {
    logout();
    navigate('/auth');
  };

  // ── Guest banner ─────────────────────────────────────────────────────────────
  const GuestBanner = () => (
    <div style={{
      padding: '16px 18px', borderRadius: '14px', marginBottom: '24px',
      background: 'linear-gradient(135deg, var(--primary-light) 0%, #e0f2fe 100%)',
      border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '14px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <User size={22} color="rgba(255, 255, 255, 0.85)" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>
          You're browsing as Guest
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
          Create an account to sync your history across devices.
        </p>
      </div>
      <button
        onClick={() => navigate('/signup')}
        style={{
          padding: '8px 14px', borderRadius: '10px', border: 'none',
          backgroundColor: 'var(--primary)', color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        <LogIn size={14} /> Sign Up
      </button>
    </div>
  );

  return (
    <div className="fade-in" style={{ paddingBottom: '24px' }}>

      {/* Guest Banner */}
      {isGuest && <GuestBanner />}

      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingTop: isGuest ? '0' : '16px' }}>
        <div style={{
          width: '70px', height: '70px', borderRadius: '35px',
          background: isLoggedIn
            ? 'linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)'
            : 'var(--hover-bg)',
          color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isLoggedIn
            ? <span style={{ fontSize: '26px', fontWeight: 800 }}>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            : <User size={36} color="var(--text-muted)" />
          }
        </div>
        <div>
          <h1 style={{ fontSize: '22px', margin: '0 0 4px' }}>
            {isLoggedIn ? user?.name : 'Guest User'}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
            {isLoggedIn ? user?.email : 'Not signed in'}
          </p>
        </div>
      </div>

      {/* 2. Activity Stats */}
      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Activity Stats</h3>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { value: stats.total,    label: 'Total Checks', color: 'var(--text-main)' },
          { value: stats.verified, label: 'Verified',     color: 'var(--success)'   },
          { value: stats.fake,     label: 'Fake/Warn',    color: 'var(--danger)'    },
        ].map(({ value, label, color }) => (
          <div key={label} className="card" style={{ flex: 1, padding: '16px', textAlign: 'center', margin: 0 }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color, marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 3. Preferences */}
      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Preferences</h3>
      <div className="card" style={{ padding: '8px 16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe size={20} color="var(--primary)" />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>Language</span>
          </div>
          <select
            value={prefs.language}
            onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-main)' }}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={20} color="var(--primary)" />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>Notifications</span>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px' }}>
            <input type="checkbox" checked={prefs.notifications} onChange={() => togglePref('notifications')} style={{ opacity: 0, width: 0, height: 0 }} />
            <span className={`switch ${prefs.notifications ? 'active' : ''}`} style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: '22px', transition: '0.4s',
            }}>
              <span className="switch-thumb" style={{
                position: 'absolute', height: '16px', width: '16px', left: '3px', bottom: '3px',
                borderRadius: '50%', transition: '0.4s',
                transform: prefs.notifications ? 'translateX(18px)' : 'translateX(0)',
              }} />
            </span>
          </label>
        </div>
      </div>

      {/* 4. Manage Data */}
      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Manage Data</h3>
      <div className="card" style={{ padding: '8px 16px', marginBottom: '24px' }}>
        <div
          onClick={() => navigate('/history')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={20} color="var(--text-muted)" />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>View Scan History</span>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        <div
          onClick={handleClearHistory}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
            <Trash2 size={20} />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>Clear History</span>
          </div>
        </div>
      </div>

      {/* 5. About */}
      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Support &amp; Info</h3>
      <div className="card" style={{ padding: '8px 16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HelpCircle size={20} color="var(--text-muted)" />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>Help &amp; FAQ</span>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={20} color="var(--text-muted)" />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>About Factify</span>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>v1.0.0</span>
        </div>
      </div>

      {/* 6. Logout / Go to Auth */}
      {isLoggedIn ? (
        <button
          className="btn"
          onClick={handleLogout}
          style={{ width: '100%', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <LogOut size={20} />
          Log Out
        </button>
      ) : (
        <button
          className="btn"
          onClick={handleGuestLogout}
          style={{ width: '100%', backgroundColor: 'var(--hover-bg)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <LogIn size={20} />
          Sign In / Create Account
        </button>
      )}
    </div>
  );
}
