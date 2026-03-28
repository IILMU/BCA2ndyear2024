import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Camera, Upload, Lock, ShieldCheck,
  CheckCircle, AlertCircle, X, Globe, ChevronDown
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import './Home.css';

const OCR_IDLE = 'idle';
const OCR_READING = 'reading';
const OCR_DONE = 'done';
const OCR_ERROR = 'error';

export default function Home() {
  const navigate = useNavigate();
  const fileInput = useRef(null);
  const dropZone = useRef(null);

  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [langOpen, setLangOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [ocrStatus, setOcrStatus] = useState(OCR_IDLE);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [ocrError, setOcrError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  /* ─── OCR ──────────────────────────────────────────────────────────── */
  const runOcr = async (imageFile) => {
    setOcrStatus(OCR_READING);
    setOcrProgress(0);
    setOcrError('');
    setOcrText('');
    try {
      const { data } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text')
            setOcrProgress(Math.round(m.progress * 100));
        },
      });
      const extracted = data.text?.trim() ?? '';
      if (!extracted) {
        setOcrStatus(OCR_ERROR);
        setOcrError("Couldn't read any text from this image.");
      } else {
        setOcrText(extracted);
        setOcrStatus(OCR_DONE);
      }
    } catch {
      setOcrStatus(OCR_ERROR);
      setOcrError('Failed to process image.');
    }
  };

  /* ─── File handlers ─────────────────────────────────────────────────── */
  const pickFile = (picked) => {
    if (!picked) return;
    setFile(picked);
    setPreviewUrl(URL.createObjectURL(picked));
    runOcr(picked);
  };

  const handleFileChange = (e) => pickFile(e.target.files?.[0]);

  const clearFile = () => {
    setFile(null);
    setPreviewUrl('');
    setOcrStatus(OCR_IDLE);
    setOcrProgress(0);
    setOcrText('');
    setOcrError('');
    if (fileInput.current) fileInput.current.value = '';
  };

  /* Drag & Drop */
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  /* ─── Submit ────────────────────────────────────────────────────────── */
  const handleScan = () => {
    if (text.trim()) {
      navigate('/analysis', { state: { text: text.trim(), language, hasFile: false } });
      return;
    }
    if (file && ocrStatus === OCR_DONE && ocrText.trim()) {
      // FIX: pass ocrText as `text` instead of passing the File object.
      // File objects cannot be reliably serialised in router state across all browsers.
      // OCR is already complete here — no need to re-run it in Analysis.jsx.
      navigate('/analysis', { state: { text: ocrText.trim(), language, hasFile: true } });
    }
  };

  // FIX: require at least 10 characters to prevent meaningless 1-char submissions
  const canSubmit = text.trim().length > 10 || (file && ocrStatus === OCR_DONE && ocrText.trim().length > 10);
  const ocrInProgress = file && ocrStatus === OCR_READING;

  const progressLabel =
    ocrProgress < 10 ? 'Loading image…' :
      ocrProgress < 60 ? 'Reading text…' :
        ocrProgress < 90 ? 'Processing…' : 'Finalising…';

  const langLabel = language === 'en' ? 'EN' : 'HI';

  /* ─── Render ────────────────────────────────────────────────────────── */
  return (
    <div className="home-page fade-in">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-left">
          <div className="home-hero-title-row">
            <span className="hero-shield-icon">
              <ShieldCheck size={34} strokeWidth={2.2} />
            </span>
            <h1 className="home-hero-title">Verify Information Instantly</h1>
          </div>
          <p className="home-hero-sub">Cut Through the Noise. Know what's real.</p>
        </div>

        {/* Language picker */}
        <div className="lang-picker" onClick={() => setLangOpen(o => !o)}>
          <Globe size={15} />
          <span>{langLabel}</span>
          <ChevronDown size={13} className={`lang-chevron ${langOpen ? 'open' : ''}`} />
          {langOpen && (
            <ul className="lang-dropdown">
              {[['en', 'English (EN)'], ['hi', 'Hindi (HI)']].map(([val, label]) => (
                <li key={val} className={language === val ? 'active' : ''}
                  onClick={(e) => { e.stopPropagation(); setLanguage(val); setLangOpen(false); }}>
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Two-column input area ─────────────────────────────────────── */}
      <div className="home-inputs-row">

        {/* LEFT — Text paste card */}
        <div className="input-card">
          <div className="input-card-header">
            <span className="input-card-icon text-icon"><FileText size={18} /></span>
            <span className="input-card-title">Paste Here</span>
          </div>
          <textarea
            className="home-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the WhatsApp forward or suspicious news article here..."
            rows={9}
          />
        </div>

        {/* OR Divider */}
        <div className="or-divider-v">
          <div className="or-line" />
          <span className="or-label">OR</span>
          <div className="or-line" />
        </div>

        {/* RIGHT — Upload card */}
        <div className="input-card">
          <div className="input-card-header">
            <span className="input-card-icon camera-icon"><Camera size={18} /></span>
            <span className="input-card-title">Upload Screenshot</span>
          </div>

          {/* No file yet → drop zone */}
          {!file && (
            <div
              ref={dropZone}
              className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInput.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="upload-icon-wrap">
                <Upload size={28} />
              </div>
              <p className="upload-main-text">Tap to upload a screenshot</p>
              <p className="upload-sub-text">Text will be extracted automatically</p>
              <span className="upload-formats">PNG, JPG, WEBP</span>
            </div>
          )}

          {/* File selected → status area */}
          {file && (
            <div className="ocr-status-area">
              {/* Image preview */}
              {previewUrl && (
                <div className="preview-wrap">
                  <img src={previewUrl} alt="Preview" className="preview-img" />
                  <button className="preview-clear" onClick={clearFile} title="Remove">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* OCR states */}
              {ocrStatus === OCR_READING && (
                <div className="ocr-progress-row">
                  <div className="ocr-progress-bar">
                    <div className="ocr-progress-fill" style={{ width: `${ocrProgress}%` }} />
                  </div>
                  <span className="ocr-progress-label">{progressLabel} {ocrProgress}%</span>
                </div>
              )}

              {ocrStatus === OCR_DONE && (
                <div className="ocr-success-row">
                  <CheckCircle size={16} className="ocr-success-icon" />
                  <span>Text extracted successfully</span>
                </div>
              )}

              {ocrStatus === OCR_ERROR && (
                <div className="ocr-error-row">
                  <AlertCircle size={16} />
                  <span>{ocrError}</span>
                  <button className="ocr-retry-btn" onClick={clearFile}>Try again</button>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div className="home-cta-wrap">
        <button
          className={`home-cta-btn check-btn ${canSubmit && !ocrInProgress ? 'active' : 'disabled'}`}
          onClick={handleScan}
          disabled={!canSubmit || ocrInProgress}
        >
          <ShieldCheck size={20} className="cta-icon" />
          Check Authenticity
        </button>

        <p className="home-privacy-note">
          <Lock size={12} />
          Your data is checked privately and not stored
        </p>
      </div>

    </div>
  );
}