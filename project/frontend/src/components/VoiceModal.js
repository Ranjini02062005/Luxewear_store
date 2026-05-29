import { useEffect } from 'react';
import { useVoice } from '../context/VoiceContext';
import { VOICE_LANGUAGES } from '../hooks/useVoiceRecognition';

export default function VoiceModal() {
  const {
    modalOpen, closeVoice, listening,
    transcript, error, language, setLanguage,
    startListening, handleVoiceResult,
  } = useVoice();

  if (!modalOpen) return null;

  const langLabel = VOICE_LANGUAGES.find(l => l.code === language);

  const HINTS = {
    'ta-IN': ['புடவை சொல்லுங்க', 'ஷூ வேணும்', 'கார்ட் காட்டு', 'ஆண் ஆடை', 'மேக்கப்'],
    'hi-IN': ['साड़ी दिखाओ', 'जूता चाहिए', 'कार्ट खोलो', 'ऑर्डर देखो', 'मेकअप'],
    'en-IN': ['Show sarees', 'I want shoes', 'Open cart', 'Men\'s shirts', 'Cosmetics'],
    'te-IN': ['చీరలు చూపించు', 'చెప్పులు కావాలి', 'కార్ట్ తెరవు'],
    'kn-IN': ['ಸೀರೆ ತೋರಿಸಿ', 'ಶೂ ಬೇಕು', 'ಕಾರ್ಟ್ ತೆರೆ'],
    'ml-IN': ['സാരി കാണിക്കൂ', 'ചെരിപ്പ് വേണം', 'കാർട്ട് തുറക്കൂ'],
  };

  const hints = HINTS[language] || HINTS['en-IN'];

  return (
    <>
      <style>{`
        @keyframes voicePulse {
          0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(255,107,0,0.4); }
          50%      { transform:scale(1.06); box-shadow:0 0 0 18px rgba(255,107,0,0); }
        }
        @keyframes waveBar {
          0%,100% { height:6px; }
          50%      { height:32px; }
        }
        @keyframes modalSlideUp {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.92); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes overlayFade { from{opacity:0} to{opacity:1} }
        .vm-overlay {
          position:fixed; inset:0; z-index:9000;
          background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);
          animation:overlayFade 0.2s ease;
        }
        .vm-box {
          position:fixed; top:50%; left:50%;
          transform:translate(-50%,-50%);
          z-index:9001;
          background:#fff; border-radius:24px;
          width:min(90vw,440px);
          box-shadow:0 24px 80px rgba(0,0,0,0.2);
          overflow:hidden;
          animation:modalSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .vm-header {
          background:linear-gradient(135deg,#ff6b00,#ff8c42);
          padding:1.5rem 1.75rem 1rem;
          display:flex; justify-content:space-between; align-items:flex-start;
        }
        .vm-title { font-size:1.05rem; font-weight:700; color:#fff; margin:0; }
        .vm-subtitle { font-size:0.75rem; color:rgba(255,255,255,0.8); margin-top:3px; }
        .vm-close { background:rgba(255,255,255,0.2); border:none; color:#fff; width:30px; height:30px; border-radius:50%; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
        .vm-close:hover { background:rgba(255,255,255,0.35); }
        .vm-body { padding:1.75rem; }

        /* Language selector */
        .vm-lang-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:1.5rem; }
        .vm-lang-btn { padding:5px 12px; border-radius:20px; border:1.5px solid #eaeaec; background:#fff; font-size:0.72rem; font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:4px; }
        .vm-lang-btn.active { background:#ff6b00; border-color:#ff6b00; color:#fff; }
        .vm-lang-btn:not(.active):hover { border-color:#ff6b00; color:#ff6b00; }

        /* Mic button */
        .vm-mic-wrap { display:flex; flex-direction:column; align-items:center; margin:1.5rem 0; }
        .vm-mic-btn {
          width:80px; height:80px; border-radius:50%; border:none;
          background:linear-gradient(135deg,#ff6b00,#ff8c42);
          color:#fff; font-size:2rem; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 28px rgba(255,107,0,0.4);
          transition:all 0.2s ease;
        }
        .vm-mic-btn.listening { animation:voicePulse 1.2s ease-in-out infinite; background:linear-gradient(135deg,#e05000,#ff6b00); }
        .vm-mic-btn:not(.listening):hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(255,107,0,0.5); }

        /* Waveform */
        .vm-wave { display:flex; align-items:center; gap:4px; height:40px; margin:0.5rem 0; }
        .vm-wave-bar {
          width:4px; border-radius:2px; background:#ff6b00; height:6px;
          animation:waveBar 0.7s ease-in-out infinite;
        }
        .vm-wave-bar:nth-child(1){ animation-delay:0s; }
        .vm-wave-bar:nth-child(2){ animation-delay:0.1s; }
        .vm-wave-bar:nth-child(3){ animation-delay:0.2s; }
        .vm-wave-bar:nth-child(4){ animation-delay:0.3s; }
        .vm-wave-bar:nth-child(5){ animation-delay:0.4s; }
        .vm-wave-bar:nth-child(6){ animation-delay:0.3s; }
        .vm-wave-bar:nth-child(7){ animation-delay:0.2s; }
        .vm-wave-bar:nth-child(8){ animation-delay:0.1s; }
        .vm-wave-bar:nth-child(9){ animation-delay:0s; }

        /* Transcript box */
        .vm-transcript {
          background:#f8f6f3; border:1.5px solid #eaeaec; border-radius:10px;
          padding:0.85rem 1rem; min-height:48px;
          font-size:0.9rem; color:#1c1c1c; font-weight:500;
          text-align:center; margin-bottom:1rem; line-height:1.5;
          transition:border-color 0.2s;
        }
        .vm-transcript.has-text { border-color:#ff6b00; }
        .vm-transcript.placeholder { color:#aaa; font-style:italic; }
        .vm-error { color:#dc3545; font-size:0.78rem; text-align:center; margin-bottom:0.75rem; background:#fff5f5; padding:6px 12px; border-radius:6px; }

        /* Hint chips */
        .vm-hints-label { font-size:0.65rem; font-weight:700; color:#888; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; text-align:center; }
        .vm-hints { display:flex; gap:6px; flex-wrap:wrap; justify-content:center; }
        .vm-hint-chip { background:#fff4ec; border:1px solid rgba(255,107,0,0.2); color:#ff6b00; padding:5px 12px; border-radius:20px; font-size:0.72rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .vm-hint-chip:hover { background:#ff6b00; color:#fff; }

        /* Status label */
        .vm-status { text-align:center; font-size:0.78rem; font-weight:600; margin-bottom:0.5rem; }
        .vm-status.listening { color:#ff6b00; }
        .vm-status.idle { color:#888; }
      `}</style>

      {/* Overlay */}
      <div className="vm-overlay" onClick={closeVoice} />

      {/* Modal */}
      <div className="vm-box" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="vm-header">
          <div>
            <p className="vm-title">🎙️ Voice Search</p>
            <p className="vm-subtitle">Speak to search products or navigate</p>
          </div>
          <button className="vm-close" onClick={closeVoice}>✕</button>
        </div>

        <div className="vm-body">
          {/* Language selector */}
          <div className="vm-lang-row">
            {VOICE_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                className={`vm-lang-btn ${language === lang.code ? 'active' : ''}`}
                onClick={() => setLanguage(lang.code)}>
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>

          {/* Mic button */}
          <div className="vm-mic-wrap">
            <button
              className={`vm-mic-btn ${listening ? 'listening' : ''}`}
              onClick={() => {
                if (listening) {
                  // do nothing, let it finish
                } else {
                  startListening(handleVoiceResult);
                }
              }}>
              🎤
            </button>

            {/* Waveform — only when listening */}
            {listening ? (
              <div className="vm-wave">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="vm-wave-bar" />
                ))}
              </div>
            ) : (
              <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Tap mic to speak</span>
              </div>
            )}

            <div className={`vm-status ${listening ? 'listening' : 'idle'}`}>
              {listening ? '🔴 Listening...' : 'Ready'}
            </div>
          </div>

          {/* Transcript display */}
          <div className={`vm-transcript ${transcript ? 'has-text' : 'placeholder'}`}>
            {transcript || (listening ? 'Speak now...' : 'Your speech will appear here')}
          </div>

          {/* Error */}
          {error && <div className="vm-error">⚠️ {error}</div>}

          {/* Example hints */}
          <div className="vm-hints-label">Try saying</div>
          <div className="vm-hints">
            {hints.map((h, i) => (
              <span key={i} className="vm-hint-chip"
  onClick={() => {
    const words = h.toLowerCase();
    handleVoiceResult(
      words.includes('cart') || words.includes('கார்ட்') || words.includes('कार्ट')
        ? { type: 'navigate', action: 'cart', raw: h }
        : words.includes('order') || words.includes('ஆர்டர்')
        ? { type: 'navigate', action: 'orders', raw: h }
        : { type: 'search', query: h, raw: h },
      h
    );
  }}>
  {h}
</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}