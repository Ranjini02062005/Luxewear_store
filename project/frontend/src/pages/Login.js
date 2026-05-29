import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

function LuxewearLogo({ white = false }) {
  return (
    <svg viewBox="0 0 320 100" width="220" height="68" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxLogin" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={white ? '#fff' : '#ff6b00'} />
          <stop offset="100%" stopColor={white ? 'rgba(255,255,255,0.7)' : '#ff9a5a'} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="30" stroke="url(#luxLogin)" strokeWidth="2" fill="none" />
      <text x="35" y="58" fontSize="20" fontFamily="Arial, sans-serif" fill="url(#luxLogin)" fontWeight="bold">LW</text>
      <text x="100" y="52" fontSize="28" fontFamily="Arial, sans-serif" fill={white ? '#fff' : '#222'} fontWeight="700" letterSpacing="3">LUXEWEAR</text>
      <text x="100" y="72" fontSize="10" fontFamily="Arial, sans-serif" fill={white ? 'rgba(255,255,255,0.7)' : '#888'} letterSpacing="4">FASHION • STYLE</text>
    </svg>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      loginUser(data);
      navigate('/home'); // ✅ Goes to home page after login
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .login-left { display: none !important; }
          .login-right { padding: 2rem 1.5rem !important; }
          .login-box { flex-direction: column !important; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#f5f5f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div className="login-box animate-fadeUp" style={{ display: 'flex', width: '100%', maxWidth: '820px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>

          {/* Left panel */}
          <div className="login-left" style={{ flex: '0 0 42%', background: 'linear-gradient(150deg, #ff6b00 0%, #ff905a 100%)', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <LuxewearLogo white={true} />
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1rem', position: 'relative' }}>
              Welcome Back!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '2rem', position: 'relative' }}>
              Login to access your orders, wishlist and exclusive member deals.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', position: 'relative' }}>
              {['Exclusive member offers', 'Track your orders', 'Easy 30-day returns', 'Personalised recommendations'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="login-right" style={{ flex: 1, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#1c1c1c', marginBottom: '0.25rem' }}>Sign In</h3>
            <p style={{ color: '#696b79', fontSize: '0.83rem', marginBottom: '1.75rem' }}>Enter your credentials to continue</p>

            {error && (
              <div className="animate-slideDown" style={{ background: '#fff4ec', border: '1px solid #ffd4a8', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#cc5500', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email Address</label>
                <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@email.com" />
              </div>
              <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Password</label>
                <input type={showPass ? 'text' : 'password'} className="input-field" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Enter your password" style={{ paddingRight: '3.5rem' }} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: '0.9rem', bottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b00', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#696b79', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                By continuing, you agree to LUXEWEAR's{' '}
                <span style={{ color: '#ff6b00', cursor: 'pointer', fontWeight: 600 }}>Terms of Use</span> and{' '}
                <span style={{ color: '#ff6b00', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>.
              </p>
              <button type="submit" disabled={loading} className="btn-orange" style={{ width: '100%', borderRadius: '4px', padding: '0.85rem', fontSize: '0.88rem' }}>
                {loading ? 'SIGNING IN...' : 'LOGIN'}
              </button>
            </form>

            <div style={{ textAlign: 'center', margin: '1.5rem 0', position: 'relative' }}>
              <div style={{ height: '1px', background: '#eaeaec', position: 'absolute', top: '50%', left: 0, right: 0 }} />
              <span style={{ background: '#fff', padding: '0 1rem', fontSize: '0.75rem', color: '#696b79', position: 'relative', fontWeight: 600, letterSpacing: '0.5px' }}>NEW TO LUXEWEAR?</span>
            </div>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn-outline-orange" style={{ width: '100%', borderRadius: '4px', padding: '0.82rem', fontSize: '0.88rem' }}>CREATE ACCOUNT</button>
            </Link>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: '#696b79' }}>
              <Link to="/" style={{ color: '#ff6b00', textDecoration: 'none', fontWeight: 600 }}>← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}