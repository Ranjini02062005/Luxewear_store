import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function LuxewearLogo({ white = false }) {
  return (
    <svg viewBox="0 0 320 100" width="220" height="68" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="luxReg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={white ? '#fff' : '#ff6b00'} />
          <stop offset="100%" stopColor={white ? 'rgba(255,255,255,0.7)' : '#ff9a5a'} />
        </linearGradient>
      </defs>
      {/* Circle */}
      <circle cx="50" cy="50" r="30"
        stroke="url(#luxReg)" strokeWidth="2" fill="none" />
      {/* LW */}
      <text x="35" y="58" fontSize="20" fontFamily="Arial, sans-serif"
        fill="url(#luxReg)" fontWeight="bold">LW</text>
      {/* LUXEWEAR */}
      <text x="100" y="52" fontSize="28" fontFamily="Arial, sans-serif"
        fill={white ? '#fff' : '#222'} fontWeight="700" letterSpacing="3">LUXEWEAR</text>
      {/* Tagline */}
      <text x="100" y="72" fontSize="10" fontFamily="Arial, sans-serif"
        fill={white ? 'rgba(255,255,255,0.7)' : '#888'} letterSpacing="4">FASHION • STYLE</text>
    </svg>
  );
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Please enter your full name');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name',    label: 'Full Name',       type: 'text',     placeholder: 'Your full name' },
    { key: 'email',   label: 'Email Address',    type: 'email',    placeholder: 'you@email.com' },
    { key: 'password',label: 'Password',         type: 'password', placeholder: 'Minimum 6 characters' },
    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password' },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .reg-left { display: none !important; }
          .reg-right { padding: 2rem 1.5rem !important; }
          .reg-box { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5f5f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div className="reg-box animate-fadeUp" style={{ display: 'flex', width: '100%', maxWidth: '820px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>

          {/* ── Left panel ── */}
          <div className="reg-left" style={{
            flex: '0 0 42%',
            background: 'linear-gradient(150deg, #ff6b00 0%, #ff905a 100%)',
            padding: '3rem 2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

            {/* Your exact SVG logo — white version */}
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <LuxewearLogo white={true} />
            </div>

            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1rem', position: 'relative' }}>
              Join LUXEWEAR
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '2rem', position: 'relative' }}>
              Create your account and discover the latest in fashion, style and elegance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', position: 'relative' }}>
              {['Free shipping on first order', 'Exclusive member deals', 'Early access to sales', 'Easy returns & refunds'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="reg-right" style={{ flex: 1, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 700, color: '#1c1c1c', marginBottom: '0.25rem' }}>
              Create Account
            </h3>
            <p style={{ color: '#696b79', fontSize: '0.83rem', marginBottom: '1.5rem' }}>
              Fill in your details to get started
            </p>

            {error && (
              <div className="animate-slideDown" style={{ background: '#fff4ec', border: '1px solid #ffd4a8', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.1rem', fontSize: '0.83rem', color: '#cc5500', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {fields.map(f => (
                <div key={f.key} style={{ marginBottom: '0.9rem', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type === 'password' && showPass ? 'text' : f.type}
                    className="input-field"
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    required
                    placeholder={f.placeholder}
                    style={f.type === 'password' ? { paddingRight: '3.5rem' } : {}}
                  />
                  {f.key === 'password' && (
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: '0.9rem', bottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b00', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                      {showPass ? 'HIDE' : 'SHOW'}
                    </button>
                  )}
                </div>
              ))}

              <p style={{ fontSize: '0.72rem', color: '#696b79', marginBottom: '1.25rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                By creating an account, you agree to LUXEWEAR's{' '}
                <span style={{ color: '#ff6b00', cursor: 'pointer', fontWeight: 600 }}>Terms of Use</span> and{' '}
                <span style={{ color: '#ff6b00', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>.
              </p>

              <button type="submit" disabled={loading} className="btn-orange"
                style={{ width: '100%', borderRadius: '4px', padding: '0.85rem', fontSize: '0.88rem' }}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div style={{ textAlign: 'center', margin: '1.25rem 0', position: 'relative' }}>
              <div style={{ height: '1px', background: '#eaeaec', position: 'absolute', top: '50%', left: 0, right: 0 }} />
              <span style={{ background: '#fff', padding: '0 1rem', fontSize: '0.75rem', color: '#696b79', position: 'relative', fontWeight: 600, letterSpacing: '0.5px' }}>
                ALREADY HAVE AN ACCOUNT?
              </span>
            </div>

            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-outline-orange"
                style={{ width: '100%', borderRadius: '4px', padding: '0.82rem', fontSize: '0.88rem' }}>
                LOGIN
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}