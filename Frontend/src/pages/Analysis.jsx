import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, Cpu } from 'lucide-react';
import { analyzeNews } from '../services/api';

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Extracting content...", icon: <Search size={40} className="pulse-icon" color="var(--primary)" /> },
    { text: "Cross-checking facts...", icon: <Cpu size={40} className="pulse-icon" color="var(--warning)" /> },
    { text: "Generating Trust Score...", icon: <ShieldAlert size={40} className="pulse-icon" color="var(--success)" /> }
  ];

  useEffect(() => {
    const payload = location.state || {};
    console.log("🚨 LOCATION STATE:", payload);
    const inputText = typeof payload.text === 'string' ? payload.text.trim() : '';
    if (!inputText) {
      console.log("❌ EMPTY INPUT TEXT");
    }
    const language = payload.language || 'en';
    const hasFile = !!payload.hasFile;

    const sourceType = hasFile
      ? 'Screenshot'
      : inputText.includes('http')
        ? 'Website Link'
        : 'WhatsApp Forward';

    const interval = setInterval(() => {
      setStep(s => {
        if (s >= 2) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 1200);

    let cancelled = false;
    const startTime = Date.now();

    // 🔥 MAIN FUNCTION
    const runAnalysis = async (finalText) => {
      try {
        console.log("🔥 Sending request to backend:", finalText);
        const data = await analyzeNews(finalText, language);
        console.log("✅ Response from backend:", data);
        console.log("🔥 FULL API RESPONSE:", data);

        if (cancelled) return;

        const resultData = data;

        const result = {
          id: Date.now(),
          score: resultData.confidence ?? 0,
          status: resultData.status ?? 'Unknown',
          title: resultData.title ?? 'Analysis Complete',
          explanation: resultData.explanation ?? '',
          signals: Array.isArray(resultData.signals) ? resultData.signals : [],
          sources: Array.isArray(resultData.sources) ? resultData.sources : [],
          sourceType,
          timestamp: new Date().toISOString(),
        };

        // ✅ LOCAL STORAGE
        try {
          const historyStr = localStorage.getItem('checkkaro_history');
          const history = historyStr ? JSON.parse(historyStr) : [];
          history.unshift({
            ...result,
            // FIX: store up to 500 chars so result page doesn't show truncated text
            originalText: finalText.substring(0, 500) + (finalText.length > 500 ? '...' : ''),
          });
          localStorage.setItem('checkkaro_history', JSON.stringify(history));
        } catch (_) { }

        // ✅ BACKEND SAVE
        // FIX: use env variable instead of hardcoded Android emulator address
        const token = localStorage.getItem("factify_token");
        if (token) {
          try {
            const apiBase = import.meta.env.VITE_API_URL || '';
            await fetch(`${apiBase}/api/history`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                input: finalText,
                status: result.status,
                confidence: result.score,
                explanation: result.explanation,
              }),
            });
          } catch (err) {
            // FIX: removed duplicate/misleading console.error that was copy-pasted here
            console.log("❌ Backend save failed:", err);
          }
        }

        const elapsed = Date.now() - startTime;
        const wait = Math.max(0, 3600 - elapsed);

        setTimeout(() => {
          if (!cancelled) navigate('/result', { state: { result } });
        }, wait);

      } catch (err) {
        console.error("🔥 FULL FRONTEND ERROR:", err);

        setTimeout(() => {
          if (!cancelled) {
            navigate('/result', {
              state: {
                error: 'Something went wrong. Please try again.',
              },
            });
          }
        }, 3600);
      }
    };

    // FIX: OCR is already done in Home.jsx — inputText already contains the extracted text.
    // We no longer re-run Tesseract here, which was causing double processing.
    runAnalysis(inputText || "Image uploaded");

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center'
    }}>
      <style>{`
        .pulse-icon {
          animation: pulse 1s infinite alternate;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        {steps[step].icon}
      </div>

      <h2 style={{ color: 'var(--text-main)' }}>{steps[step].text}</h2>
      <p style={{ color: 'var(--text-muted)' }}>
        Please wait while our AI verifies this for you.
      </p>

      <div style={{
        marginTop: '40px',
        width: '200px',
        height: '6px',
        background: 'var(--border-color)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${(step + 1) * 33.33}%`,
          background: 'var(--primary)',
          transition: 'width 0.5s ease'
        }}></div>
      </div>
    </div>
  );
}