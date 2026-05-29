import { useState, useEffect, useRef, useCallback } from 'react';

// Supported languages
export const VOICE_LANGUAGES = [
  { code: 'ta-IN', label: 'தமிழ்',   flag: '🇮🇳' },
  { code: 'hi-IN', label: 'हिन्दी',   flag: '🇮🇳' },
  { code: 'en-IN', label: 'English',  flag: '🇮🇳' },
  { code: 'te-IN', label: 'తెలుగు',   flag: '🇮🇳' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ',    flag: '🇮🇳' },
  { code: 'ml-IN', label: 'മലയാളം',   flag: '🇮🇳' },
];

// Tamil keywords → category/action mapping
const KEYWORD_MAP = {
  // Tamil
  'புடவை': 'Women', 'சேலை': 'Women', 'குர்தா': 'Women', 'டிரெஸ்': 'Women',
  'சட்டை': 'Men', 'பேன்ட்': 'Men', 'ஆண்': 'Men',
  'செருப்பு': 'Footwear', 'ஷூ': 'Footwear', 'சப்பாத்து': 'Footwear',
  'பை': 'Accessories', 'மணிக்கட்டு': 'Accessories', 'நகை': 'Accessories',
  'அழகு': 'Cosmetics', 'மேக்கப்': 'Cosmetics', 'க்ரீம்': 'Cosmetics',
  'கார்ட்': 'cart', 'வாங்கு': 'cart', 'ஆர்டர்': 'orders',
  'வீடு': 'home', 'முகப்பு': 'home',
  // Hindi
  'साड़ी': 'Women', 'कुर्ती': 'Women', 'ड्रेस': 'Women', 'महिला': 'Women',
  'शर्ट': 'Men', 'पैंट': 'Men', 'पुरुष': 'Men',
  'जूता': 'Footwear', 'चप्पल': 'Footwear',
  'बैग': 'Accessories', 'घड़ी': 'Accessories',
  'मेकअप': 'Cosmetics', 'क्रीम': 'Cosmetics',
  'कार्ट': 'cart', 'खरीदना': 'cart', 'ऑर्डर': 'orders',
  'घर': 'home',
  // English
  'saree': 'Women', 'dress': 'Women', 'kurti': 'Women', 'women': 'Women',
  'shirt': 'Men', 'pants': 'Men', 'men': 'Men', 'jeans': 'Men',
  'shoes': 'Footwear', 'footwear': 'Footwear', 'sneakers': 'Footwear', 'sandals': 'Footwear',
  'bag': 'Accessories', 'accessories': 'Accessories', 'watch': 'Accessories',
  'cosmetics': 'Cosmetics', 'makeup': 'Cosmetics', 'cream': 'Cosmetics', 'lipstick': 'Cosmetics',
  'cart': 'cart', 'buy': 'cart', 'basket': 'cart',
  'orders': 'orders', 'order': 'orders',
  'home': 'home', 'back': 'home',
  'wishlist': 'wishlist',
  'login': 'login', 'signin': 'login',
};

function interpretVoice(text) {
  const lower = text.toLowerCase().trim();
  // Direct keyword match
  for (const [keyword, action] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword.toLowerCase())) {
      return { type: 'navigate', action, raw: text };
    }
  }
  // Fallback: treat as search query
  return { type: 'search', query: text, raw: text };
}

export function useVoiceRecognition() {
  const [listening,  setListening]  = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error,      setError]      = useState('');
  const [supported,  setSupported]  = useState(false);
  const [language,   setLanguage]   = useState('ta-IN');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = language;
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }, [language]);

  const startListening = useCallback((onResult) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice not supported in this browser. Please use Chrome.');
      return;
    }

    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new SpeechRecognition();
    recognition.lang            = language;
    recognition.continuous      = false;
    recognition.interimResults  = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current      = recognition;

    setError('');
    setTranscript('');
    setListening(true);

    recognition.onresult = (e) => {
      const result = e.results[e.results.length - 1];
      const text   = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) {
        const interpreted = interpretVoice(text);
        onResult && onResult(interpreted, text);
      }
    };

    recognition.onerror = (e) => {
      setListening(false);
      if (e.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (e.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone.');
      } else {
        setError(`Error: ${e.error}`);
      }
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, []);

  return {
    listening, transcript, error, supported, language,
    setLanguage, startListening, stopListening, speak, interpretVoice,
  };
}