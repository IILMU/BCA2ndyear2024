import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle, AlertTriangle, XCircle,
  Share2, History as HistoryIcon, ArrowLeft,
  ExternalLink, Zap, BookOpen
} from 'lucide-react';

// ─── Data extraction (handles both wrapped + raw API shapes) ──────────────────
function extractResult(state) {
  if (!state) return null;
  if (state.result && typeof state.result === 'object') {
    const r = state.result;
    return {
      score:       r.score ?? r.confidence ?? 0,
      status:      r.status  ?? 'Unknown',
      title:       typeof r.title === 'string'       ? r.title       : 'Analysis Complete',
      explanation: typeof r.explanation === 'string' ? r.explanation : '',
      signals:     Array.isArray(r.signals)    ? r.signals    : [],
      sources:     Array.isArray(r.sources)    ? r.sources    : [],
      highlights:  Array.isArray(r.highlights) ? r.highlights : [],
    };
  }
  if (state.status || state.confidence != null) {
    return {
      score:       state.confidence ?? 0,
      status:      state.status  ?? 'Unknown',
      title:       typeof state.title === 'string'       ? state.title       : 'Analysis Complete',
      explanation: typeof state.explanation === 'string' ? state.explanation : '',
      signals:     Array.isArray(state.signals) ? state.signals : [],
      sources:     Array.isArray(state.sources) ? state.sources : [],
      highlights:  [],
    };
  }
  return null;
}

// ─── Status theme ─────────────────────────────────────────────────────────────
function getTheme(status) {
  switch (status) {
    case 'Verified':
      return {
        color:      'var(--success)',
        bgLight:    'var(--success-light)',
        ringColor:  '#10B981',
        icon:       <CheckCircle size={22} />,
        badge:      '✔ Trusted Source',
        badgeClass: 'badge-verified',
      };
    case 'Misleading':
      return {
        color:      'var(--warning)',
        bgLight:    'var(--warning-light)',
        ringColor:  '#F59E0B',
        icon:       <AlertTriangle size={22} />,
        badge:      '⚠ Needs Verification',
        badgeClass: 'badge-misleading',
      };
    case 'Fake':
      return {
        color:      'var(--danger)',
        bgLight:    'var(--danger-light)',
        ringColor:  '#EF4444',
        icon:       <XCircle size={22} />,
        badge:      '⛔ Fake Alert',
        badgeClass: 'badge-fake',
      };
    default:
      return {
        color:      'var(--text-muted)',
        bgLight:    'var(--hover-bg)',
        ringColor:  '#6B7280',
        icon:       <CheckCircle size={22} />,
        badge:      'Unknown',
        badgeClass: 'badge-verified',
      };
  }
}

// ─── Score → ring color (independent of status) ────────────────────────────
function getScoreColor(score) {
  if (score >= 75) return '#10B981'; // green
  if (score >= 50) return '#F59E0B'; // yellow
  if (score >= 25) return '#F97316'; // orange
  return '#EF4444';                  // red
}

// ─── SVG confidence ring ──────────────────────────────────────────────────────
function ConfidenceRing({ score, color }) {
  const radius = 52;
  const stroke = 9;
  const normalised = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const filled = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 20px' }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx="65" cy="65" r={normalised}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={stroke}
        />
        {/* Filled arc */}
        <circle
          cx="65" cy="65" r={normalised}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={filled}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {/* Label inside ring */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span className="text-layer-shadow" style={{ fontSize: '26px', fontWeight: 800, color, lineHeight: 1 }}>
          {score}%
        </span>
        <span className="text-layer-shadow" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.5px' }}>
          CONFIDENCE
        </span>
      </div>
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: '1px', background: 'var(--border-color)', margin: '20px 0' }} />;
}

// ─── Util: is string a URL? ───────────────────────────────────────────────────
function isUrl(str) {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── Error screen ────────────────────────────────────────────────────────────
  const errorMsg = location.state?.error;
  if (errorMsg) {
    return (
      <div className="fade-in" style={{ padding: '0' }}>
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <button onClick={() => navigate('/home')} style={{ background: 'transparent', padding: '8px', margin: '-8px' }}>
            <ArrowLeft size={24} color="var(--text-main)" />
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Analysis Result</h1>
        </header>
        <div className="card analysis-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <XCircle size={52} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h2 className="text-layer-shadow" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>Analysis Failed</h2>
          <p className="text-layer-shadow" style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>{errorMsg}</p>
          <button className="btn btn-primary" style={{ maxWidth: '220px', margin: '0 auto' }} onClick={() => navigate('/home')}>Try Again</button>
        </div>
      </div>
    );
  }

  // ── Extract + guard ─────────────────────────────────────────────────────────
  const result = extractResult(location.state);
  if (!result) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>No result found. Please try again.</p>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>Go Home</button>
      </div>
    );
  }

  const { score, status, title, explanation, signals, sources, highlights } = result;
  const theme = getTheme(status);
  const allSignals = [...new Set([...signals, ...highlights])];

  // WhatsApp share
  const handleShare = () => {
    const msg = `Factify Analysis:\nStatus: ${status}\nConfidence: ${score}%\nExplanation: ${explanation || 'N/A'}\n\n"Know what's real." – via Factify App`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '8px' }}>

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '16px' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', padding: '8px', margin: '-8px' }}>
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Analysis Result</h1>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN CARD
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="card analysis-card" style={{
        padding: '28px 24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        border: `1px solid var(--border-color)`,
        marginBottom: '16px',
      }}>

        {/* ── 1. Confidence Ring ──────────────────────────────────────────── */}
        <div style={{ textAlign: 'center' }}>
          <ConfidenceRing score={score} color={getScoreColor(score)} />

          {/* ── 2. Big status text ─────────────────────────────────────── */}
          <h2 className="text-layer-shadow" style={{
            fontSize: '32px',
            fontWeight: 800,
            color: theme.color,
            margin: '0 0 10px',
            letterSpacing: '-0.5px',
          }}>
            {status}
          </h2>

          {/* ── 3. Badge sub-label ─────────────────────────────────────── */}
          <span className={`badge ${theme.badgeClass} badge-shadow`} style={{
            fontSize: '13px',
            padding: '5px 14px',
          }}>
            {theme.icon}
            {theme.badge}
          </span>
        </div>

        <Divider />

        {/* ── 4. Title ────────────────────────────────────────────────────── */}
        <div>
          <p className="text-layer-shadow" style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px'
          }}>
            Title
          </p>
          <p className="text-layer-shadow" style={{
            fontSize: '17px', fontWeight: 700, color: 'var(--text-main)',
            lineHeight: 1.4, margin: 0,
          }}>
            {title}
          </p>
        </div>

        <Divider />

        {/* ── 5. Explanation ──────────────────────────────────────────────── */}
        <div>
          <p className="text-layer-shadow" style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px'
          }}>
            Explanation
          </p>
          <p className="text-layer-shadow" style={{
            fontSize: '15px',
            color: 'var(--text-main)',
            lineHeight: 1.75,
            margin: 0,
            fontWeight: 400,
          }}>
            {explanation || 'No explanation available.'}
          </p>
        </div>

        {/* ── 6. Signals ──────────────────────────────────────────────────── */}
        {allSignals.length > 0 && (
          <>
            <Divider />
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px'
              }}>
                <Zap size={16} color={theme.color} />
                <p className="text-layer-shadow" style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0
                }}>
                  Detailed Analysis Signals
                </p>
              </div>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'grid',
                gridTemplateColumns: allSignals.length > 2 ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
                gap: '10px',
              }}>
                {allSignals.map((s, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: theme.bgLight,
                    fontSize: '13px',
                    color: 'var(--text-main)',
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}>
                    <span style={{
                      flexShrink: 0, marginTop: '2px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: theme.color, color: 'rgba(255, 255, 255, 0.85)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 800,
                    }}>
                      {i + 1}
                    </span>
                    <span className="text-layer-shadow">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ── 7. Sources ──────────────────────────────────────────────────── */}
        {sources.length > 0 && (
          <>
            <Divider />
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px'
              }}>
                <BookOpen size={16} color="var(--primary)" />
                <p className="text-layer-shadow" style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0
                }}>
                  Verified Sources
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sources.map((src, i) =>
                  isUrl(src) ? (
                    <a
                      key={i}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-card"
                    >
                      <ExternalLink size={14} style={{ flexShrink: 0 }} />
                      <span className="text-layer-shadow">{src}</span>
                    </a>
                  ) : (
                    <div
                      key={i}
                      className="source-card"
                    >
                      <BookOpen size={14} style={{ flexShrink: 0 }} />
                      <span className="text-layer-shadow">{src}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

      </div>{/* end main card */}

      {/* ── 8. Action buttons ────────────────────────────────────────────────── */}
      <button
        className="btn btn-primary"
        onClick={handleShare}
        style={{ backgroundColor: '#25D366', marginBottom: '10px' }}
      >
        <Share2 size={20} style={{ marginRight: '8px' }} />
        Share to WhatsApp
      </button>

      <button
        className="btn btn-outline"
        onClick={() => navigate('/history')}
      >
        <HistoryIcon size={20} style={{ marginRight: '8px' }} />
        View History
      </button>

    </div>
  );
}
