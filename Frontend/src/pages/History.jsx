import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ChevronRight, CheckCircle, AlertTriangle, XCircle, Trash2, MessageCircle, Globe, Camera } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // FIX: wrap JSON.parse in try/catch — corrupted localStorage data would
    // previously throw an unhandled error and crash the entire component.
    try {
      const data = localStorage.getItem('checkkaro_history');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch {
      // Data is unrecoverable — clear it so the app doesn't stay broken
      localStorage.removeItem('checkkaro_history');
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to permanently clear your history?")) {
      localStorage.removeItem('checkkaro_history');
      setHistory([]);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Verified':
        return { label: 'Verified', color: 'var(--success)', bg: 'var(--success-light)', icon: <CheckCircle size={14} /> };
      case 'Misleading':
        return { label: 'Misleading', color: 'var(--warning)', bg: 'var(--warning-light)', icon: <AlertTriangle size={14} /> };
      case 'Fake':
        return { label: 'Fake News', color: 'var(--danger)', bg: 'var(--danger-light)', icon: <XCircle size={14} /> };
      default:
        return { label: 'Unknown', color: 'var(--text-muted)', bg: 'var(--border-color)', icon: <CheckCircle size={14} /> };
    }
  };

  const getSourceIcon = (type) => {
    switch (type) {
      case 'Screenshot': return <Camera size={14} />;
      case 'Website Link': return <Globe size={14} />;
      default: return <MessageCircle size={14} />; // WhatsApp Forward
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '32px' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px', fontSize: '24px', fontWeight: 800 }}>
            <HistoryIcon size={26} color="var(--primary)" />
            Your History
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>
            View all your past checks
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              background: 'var(--danger-light)',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
          <HistoryIcon size={56} color="var(--border-color)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>No history yet</h3>
          <p style={{ fontSize: '15px', marginBottom: '24px' }}>Start checking news to see results here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')} style={{ padding: '12px 24px', borderRadius: '100px' }}>
            Verify a Message
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item, index) => {
            const statusConf = getStatusConfig(item.status);
            const sourceTag = item.sourceType || 'WhatsApp Forward';

            return (
              <div
                key={index}
                className="card"
                style={{
                  padding: '16px',
                  margin: 0,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onClick={() => navigate('/result', { state: { result: item } })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                }}
              >
                {/* Top Row: Status Badge & Timestamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 10px', borderRadius: '20px',
                    backgroundColor: statusConf.bg, color: statusConf.color,
                    fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px'
                  }}>
                    {statusConf.icon}
                    {statusConf.label}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {timeAgo(item.timestamp)}
                  </span>
                </div>

                {/* Content Preview */}
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '15px',
                  color: 'var(--text-main)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}>
                  "{item.originalText || item.title}"
                </p>

                {/* Bottom Row: Source Tag & Chevron */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>
                    {getSourceIcon(sourceTag)}
                    {sourceTag}
                  </div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '14px', backgroundColor: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}