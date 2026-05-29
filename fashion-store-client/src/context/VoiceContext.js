import { createContext, useContext, useState, useCallback } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useNavigate } from 'react-router-dom';

const VoiceContext = createContext();

export function VoiceProvider({ children }) {
  const navigate = useNavigate();
  const [modalOpen,   setModalOpen]   = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [feedback,    setFeedback]    = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const voice = useVoiceRecognition();

  const showFeedback = (msg, duration = 3000) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), duration);
  };

  const handleVoiceResult = useCallback((interpreted, rawText) => {
    setLastCommand(rawText);

    if (interpreted.type === 'navigate') {
      const { action } = interpreted;

      const routeMap = {
        Women:      '/home?category=Women',
        Men:        '/home?category=Men',
        Footwear:   '/home?category=Footwear',
        Accessories:'/home?category=Accessories',
        Cosmetics:  '/home?category=Cosmetics',
        cart:       '/cart',
        orders:     '/orders',
        home:       '/home',
        wishlist:   '/wishlist',
        login:      '/login',
      };

      const route = routeMap[action];
      if (route) {
        showFeedback(`🎙️ Going to ${action}...`);
        voice.speak(
          voice.language.startsWith('ta')
            ? `${action} பக்கத்திற்கு செல்கிறோம்`
            : voice.language.startsWith('hi')
            ? `${action} पर जा रहे हैं`
            : `Going to ${action}`
        );
        setTimeout(() => { navigate(route); setModalOpen(false); }, 800);
      }
    } else if (interpreted.type === 'search') {
      const q = interpreted.query;
      setSearchQuery(q);
      showFeedback(`🔍 Searching: "${q}"`);
      voice.speak(
        voice.language.startsWith('ta')
          ? `${q} தேடுகிறோம்`
          : voice.language.startsWith('hi')
          ? `${q} खोज रहे हैं`
          : `Searching for ${q}`
      );
      setTimeout(() => {
        navigate(`/home?search=${encodeURIComponent(q)}`);
        setModalOpen(false);
      }, 800);
    }
  }, [navigate, voice]);

  const openVoice = () => {
    setModalOpen(true);
    setTimeout(() => voice.startListening(handleVoiceResult), 300);
  };

  const closeVoice = () => {
    voice.stopListening();
    setModalOpen(false);
  };

  return (
    <VoiceContext.Provider value={{
      ...voice,
      modalOpen, openVoice, closeVoice,
      lastCommand, feedback, searchQuery,
      handleVoiceResult,
    }}>
      {children}
      {/* Global feedback toast */}
      {feedback && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 9999,
          background: '#1c1c1c', color: '#fff',
          padding: '10px 22px', borderRadius: '50px',
          fontSize: '0.85rem', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          animation: 'fadeUp 0.3s ease',
          whiteSpace: 'nowrap',
          borderLeft: '3px solid #ff6b00',
        }}>
          {feedback}
        </div>
      )}
    </VoiceContext.Provider>
  );
}

export const useVoice = () => useContext(VoiceContext);