import { useVoice } from '../context/VoiceContext';

export default function VoiceButton() {
  const { openVoice, listening, supported } = useVoice();

  if (!supported) return null;

  return (
    <>
      <style>{`
        @keyframes micPulseRed {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.6), 0 6px 24px rgba(0,0,0,0.3); }
          50%      { box-shadow: 0 0 0 16px rgba(255,107,0,0), 0 6px 24px rgba(0,0,0,0.3); }
        }
        @keyframes micFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-5px) scale(1.02); }
        }
        @keyframes rippleOut {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes wvBar {
          0%,100% { transform: scaleY(0.35); }
          50%     { transform: scaleY(1); }
        }

        /* Outer container */
        .vb-outer {
          position: fixed;
          bottom: 26px;
          right: 26px;
          z-index: 8000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        /* Tooltip */
        .vb-tooltip {
          background: #1c1c1c;
          color: #fff;
          padding: 5px 13px;
          border-radius: 8px;
          font-size: 0.68rem;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.3px;
          border-left: 2.5px solid #ff6b00;
          opacity: 0;
          transform: translateY(5px);
          transition: all 0.22s ease;
          pointer-events: none;
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
        }
        .vb-outer:hover .vb-tooltip {
          opacity: 1;
          transform: translateY(0);
        }

        /* Ripple wrapper */
        .vb-ring-wrap {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Ripple rings — appear only while listening */
        .vb-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #ff6b00;
          animation: rippleOut 1.4s ease-out infinite;
          pointer-events: none;
        }
        .vb-ring:nth-child(2) { animation-delay: 0.45s; }
        .vb-ring:nth-child(3) { animation-delay: 0.9s; }

        /* ── MAIN BUTTON ──
           Dark background so it stands out against any orange/light page.
           White border makes it crisp.
           Orange mic icon inside = brand color still visible.
        */
        .vb-btn {
          position: relative;
          z-index: 1;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          background: #1c1c1c;          /* ← DARK = visible on orange */
          color: #ff6b00;               /* ← ORANGE mic inside dark circle */
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 6px 22px rgba(0,0,0,0.28),
            0 2px 6px rgba(0,0,0,0.15);
          transition: background 0.25s ease, color 0.25s ease,
                      transform 0.25s ease, box-shadow 0.25s ease;
          animation: micFloat 3s ease-in-out infinite;
        }

        /* While listening: flip to orange bg, white icon */
        .vb-btn.listening {
          background: #ff6b00;
          color: #ffffff;
          border-color: #ffffff;
          animation: micPulseRed 1.1s ease-in-out infinite;
        }

        .vb-outer:hover .vb-btn {
          transform: scale(1.12);
          box-shadow: 0 10px 32px rgba(0,0,0,0.3);
          animation: none;
        }

        /* SVG size */
        .vb-svg { width: 28px; height: 28px; flex-shrink: 0; }

        /* Bottom label pill */
        .vb-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: #1c1c1c;
          background: #ffffff;
          padding: 3px 10px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.14);
          border: 1.5px solid #eaeaec;
        }
        .vb-label.live {
          background: #ff6b00;
          color: #fff;
          border-color: #ff6b00;
        }
      `}</style>

      <div className="vb-outer">

        {/* Hover tooltip */}
        <div className="vb-tooltip">🎙️ Tap to speak</div>

        {/* Button + ripple rings */}
        <div className="vb-ring-wrap">

          {/* Ripple rings only when actively listening */}
          {listening && (
            <>
              <div className="vb-ring" />
              <div className="vb-ring" />
              <div className="vb-ring" />
            </>
          )}

          <button
            className={`vb-btn ${listening ? 'listening' : ''}`}
            onClick={openVoice}
            title="Voice Search">

            {listening ? (
              /* ── Waveform bars when recording ── */
              <svg className="vb-svg" viewBox="0 0 28 28" fill="none">
                <rect x="2"  y="11" width="3.5" height="10" rx="1.75"
                  fill="currentColor"
                  style={{ animation:'wvBar 0.65s ease-in-out infinite', animationDelay:'0s', transformOrigin:'center' }}/>
                <rect x="7.5" y="7" width="3.5" height="14" rx="1.75"
                  fill="currentColor"
                  style={{ animation:'wvBar 0.65s ease-in-out infinite', animationDelay:'0.13s', transformOrigin:'center' }}/>
                <rect x="13" y="4" width="3.5" height="20" rx="1.75"
                  fill="currentColor"
                  style={{ animation:'wvBar 0.65s ease-in-out infinite', animationDelay:'0.26s', transformOrigin:'center' }}/>
                <rect x="18.5" y="7" width="3.5" height="14" rx="1.75"
                  fill="currentColor"
                  style={{ animation:'wvBar 0.65s ease-in-out infinite', animationDelay:'0.13s', transformOrigin:'center' }}/>
                <rect x="24" y="11" width="3.5" height="10" rx="1.75"
                  fill="currentColor"
                  style={{ animation:'wvBar 0.65s ease-in-out infinite', animationDelay:'0s', transformOrigin:'center' }}/>
              </svg>
            ) : (
              /* ── Clean SVG microphone icon ── */
              <svg className="vb-svg" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Mic capsule body */}
                <rect x="9.5" y="2" width="9" height="15" rx="4.5"
                  fill="currentColor"/>
                {/* Inner highlight stripe */}
                <rect x="11.5" y="4" width="2" height="6" rx="1"
                  fill="rgba(255,255,255,0.25)"/>
                {/* Arc / stand */}
                <path
                  d="M5.5 14a8.5 8.5 0 0 0 17 0"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" fill="none"/>
                {/* Vertical stem */}
                <line x1="14" y1="22.5" x2="14" y2="26"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                {/* Horizontal base */}
                <line x1="9.5" y1="26" x2="18.5" y2="26"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Label pill */}
        <div className={`vb-label ${listening ? 'live' : ''}`}>
          {listening ? '● LIVE' : 'VOICE'}
        </div>

      </div>
    </>
  );
}