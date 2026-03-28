import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home as HomeIcon, History as HistoryIcon, User, LogIn } from 'lucide-react';

// Auth
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Splash      from './pages/Splash';
import Onboarding  from './pages/Onboarding';
import AuthLanding from './pages/AuthLanding';
import Login       from './pages/Login';
import Signup      from './pages/Signup';
import Home        from './pages/Home';
import Analysis    from './pages/Analysis';
import Result      from './pages/Result';
import History     from './pages/History';
import Profile     from './pages/Profile';

// ── Protected Route ────────────────────────────────────────────────────────────
// Redirects to /auth if neither logged in nor in guest mode
function ProtectedRoute({ children }) {
  const { isLoggedIn, isGuest } = useAuth();
  if (!isLoggedIn && !isGuest) return <Navigate to="/auth" replace />;
  return children;
}

// ── Bottom Navigation ──────────────────────────────────────────────────────────
function BottomNav() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, isLoggedIn, isGuest } = useAuth();

  const hideNavRoutes = ['/', '/onboarding', '/analysis', '/result', '/auth', '/login', '/signup'];
  if (hideNavRoutes.includes(location.pathname)) return null;

  const displayName = isLoggedIn ? user?.name?.split(' ')[0] : 'Guest';

  return (
    <div className="bottom-nav">
      {/* Desktop Logo */}
      <div className="desktop-logo" onClick={() => navigate('/home')}>
        <img
          src="/logo.png"
          alt="Factify Logo"
          style={{ height: '44px', objectFit: 'contain' }}
          onError={(e) => {
            e.target.style.display = 'none';
            document.getElementById('fallback-text-logo').style.display = 'flex';
          }}
        />
        <div id="fallback-text-logo" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: 'var(--primary)', color: 'rgba(255, 255, 255, 0.85)', borderRadius: '50%',
            padding: '4px', display: 'flex', width: '32px', height: '32px',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px', fontWeight: 800, fontSize: '22px'
            }}>
              Factify
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 400, letterSpacing: '0.3px' }}>
              Cut Through the Noise.
            </span>
          </div>
        </div>
      </div>

      {/* Home */}
      <div
        className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
        onClick={() => navigate('/home')}
        style={{ cursor: 'pointer' }}
      >
        <HomeIcon size={24} />
        <span>Home</span>
      </div>

      {/* History */}
      <div
        className={`nav-item ${location.pathname === '/history' ? 'active' : ''}`}
        onClick={() => navigate('/history')}
        style={{ cursor: 'pointer' }}
      >
        <HistoryIcon size={24} />
        <span>History</span>
      </div>

      {/* Profile / Login */}
      {isLoggedIn || isGuest ? (
        <div
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer' }}
        >
          <User size={24} />
          <span>{displayName}</span>
        </div>
      ) : (
        <div
          className="nav-item"
          onClick={() => navigate('/auth')}
          style={{ cursor: 'pointer' }}
        >
          <LogIn size={24} />
          <span>Login</span>
        </div>
      )}
    </div>
  );
}

// ── App Content ────────────────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ['/', '/onboarding', '/analysis', '/result', '/auth', '/login', '/signup'];
  const hasNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      <div className={`app-container ${hasNav ? '' : 'no-nav-padding'}`}>
        <Routes>
          {/* Public */}
          <Route path="/"           element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth"       element={<AuthLanding />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/signup"     element={<Signup />} />

          {/* Semi-public (guest + logged-in) */}
          <Route path="/home"     element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/result"   element={<ProtectedRoute><Result /></ProtectedRoute>} />

          {/* Protected */}
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
