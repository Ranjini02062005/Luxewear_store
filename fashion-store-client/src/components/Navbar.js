import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// ── Men has its own route /men, others use /home?category=X ──
const CATEGORIES = [
  { label: 'Men',         route: '/men' },
  { label: 'Women',       route: '/home?category=Women' },
  { label: 'Footwear',    route: '/home?category=Footwear' },
  { label: 'Accessories', route: '/home?category=Accessories' },
  { label: 'Cosmetics',   route: '/home?category=Cosmetics' },
];

function LuxewearLogo() {
  return (
    <svg viewBox="0 0 320 100" width="175" height="55" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lux" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b00" />
          <stop offset="100%" stopColor="#ff9a5a" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="30" stroke="url(#lux)" strokeWidth="2" fill="none" />
      <text x="35" y="58" fontSize="20" fontFamily="Arial, sans-serif" fill="url(#lux)" fontWeight="bold">LW</text>
      <text x="95" y="55" fontSize="28" fontFamily="Arial, sans-serif" fill="#1c1c1c" fontWeight="700">LUXE</text>
      <text x="170" y="55" fontSize="28" fontFamily="Arial, sans-serif" fill="url(#lux)" fontWeight="700">WEAR</text>
      <text x="95" y="74" fontSize="10" fontFamily="Arial, sans-serif" fill="#aaa" letterSpacing="4">FASHION • STYLE</text>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishCount } = useWishlist();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [search,      setSearch]      = useState('');
  const [scrolled,    setScrolled]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/home?search=${encodeURIComponent(search.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMobileOpen(false);
    navigate('/home');
  };

  // Check if a category link is active
  const isActive = (route) => {
    if (route === '/men') return location.pathname === '/men';
    const cat = new URLSearchParams(route.split('?')[1]).get('category');
    return location.search.includes(`category=${cat}`);
  };

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; align-items: center; }
        .nav-hamburger { display: none !important; }
        .nav-mobile-icons { display: none !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; flex-direction: column; gap: 4px; }
          .nav-mobile-icons { display: flex !important; }
        }
        .mobile-menu {
          position: fixed; top: 0; left: 0; width: 280px; height: 100vh;
          background: #fff; z-index: 2000;
          box-shadow: 4px 0 20px rgba(0,0,0,0.13);
          display: flex; flex-direction: column; overflow-y: auto;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.45); z-index: 1999;
        }
        .mobile-overlay.open { display: block; }
        .nav-icon-btn {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          background: none; border: none; cursor: pointer; padding: 6px 8px;
          border-radius: 4px; transition: background 0.2s;
          text-decoration: none; color: inherit;
        }
        .nav-icon-btn:hover { background: #fff4ec; }
        .nav-icon-label { font-size: 0.6rem; font-weight: 700; color: #1c1c1c; white-space: nowrap; }

        /* Men special badge in navbar */
        .men-nav-badge {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 0.65rem; background: #ff6b00; color: #fff;
          padding: 1px 6px; border-radius: 10px; font-weight: 700;
          margin-left: 4px; vertical-align: middle;
        }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)} />

      {/* ── Mobile slide menu ── */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #eaeaec', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <LuxewearLogo />
          <button onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#696b79' }}>
            ✕
          </button>
        </div>

        {user && (
          <div style={{ padding: '0.85rem 1rem', background: '#fff4ec', borderBottom: '1px solid #eaeaec' }}>
            <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1c1c1c', margin: 0 }}>{user.name}</p>
            <p style={{ fontSize: '0.72rem', color: '#696b79', margin: '2px 0 0' }}>{user.email}</p>
          </div>
        )}

        {/* Mobile categories */}
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ff6b00', padding: '0.5rem 1.25rem 0.25rem', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>
            Categories
          </p>

          {/* Men — special link with sub-category hint */}
          <Link to="/men"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1.25rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1c', borderBottom: '1px solid #f5f5f6', background: location.pathname === '/men' ? '#fff4ec' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff4ec'}
            onMouseLeave={e => e.currentTarget.style.background = location.pathname === '/men' ? '#fff4ec' : 'none'}>
            <span>👔 Men</span>
            <span style={{ fontSize: '0.65rem', color: '#ff6b00', fontWeight: 600 }}>Kids · Teens · Jeans →</span>
          </Link>

          {/* Other categories */}
          {CATEGORIES.filter(c => c.label !== 'Men').map(cat => (
            <Link key={cat.label} to={cat.route}
              style={{ display: 'block', padding: '0.7rem 1.25rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, color: '#1c1c1c', borderBottom: '1px solid #f5f5f6' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff4ec'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Mobile account */}
        <div style={{ padding: '0.5rem 0', borderTop: '1px solid #eaeaec' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ff6b00', padding: '0.5rem 1.25rem 0.25rem', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>
            Account
          </p>
          <Link to="/wishlist"
            style={{ display: 'block', padding: '0.7rem 1.25rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#1c1c1c', borderBottom: '1px solid #f5f5f6' }}>
            ❤️ My Wishlist {wishCount > 0 && (
              <span style={{ background: '#ff6b00', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem', marginLeft: '6px' }}>{wishCount}</span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/orders"
                style={{ display: 'block', padding: '0.7rem 1.25rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#1c1c1c', borderBottom: '1px solid #f5f5f6' }}>
                📦 My Orders
              </Link>
              <button onClick={handleLogout}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1.25rem', border: 'none', background: 'none', fontSize: '0.88rem', fontWeight: 700, color: '#ff6b00', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                style={{ display: 'block', padding: '0.7rem 1.25rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, color: '#1c1c1c' }}>
                Login
              </Link>
              <Link to="/register"
                style={{ display: 'block', padding: '0.7rem 1.25rem', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700, color: '#ff6b00' }}>
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000, background: '#fff',
        borderBottom: `1px solid ${scrolled ? '#eaeaec' : 'transparent'}`,
        boxShadow: scrolled ? '0 2px 16px rgba(255,107,0,0.08)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        {/* Top strip */}
        <div style={{ background: 'linear-gradient(90deg,#ff6b00,#ff905a)', padding: '5px 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {['✓ Free Shipping ₹999+', '✓ Easy Returns', '✓ 100% Authentic'].map(t => (
              <span key={t} style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Main bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '1rem', height: '64px' }}>

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '20px', height: '2px', background: '#1c1c1c', borderRadius: '1px' }} />
            ))}
          </button>

          {/* Logo */}
          <Link to="/home" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <LuxewearLogo />
          </Link>

          {/* Desktop nav */}
          <div className="nav-desktop" style={{ flex: 1, gap: '0.5rem' }}>

            {/* ── Category links ── */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {CATEGORIES.map(cat => {
                const active = isActive(cat.route);
                return (
                  <Link key={cat.label} to={cat.route}
                    style={{
                      textDecoration: 'none',
                      padding: cat.label === 'Men' ? '0 0.9rem' : '0 0.8rem',
                      height: '64px',
                      display: 'flex', alignItems: 'center',
                      fontSize: '0.82rem', fontWeight: 700,
                      color: active ? '#ff6b00' : '#1c1c1c',
                      borderBottom: active ? '2.5px solid #ff6b00' : '2.5px solid transparent',
                      transition: 'color 0.2s, border-color 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff6b00'}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#1c1c1c'; }}>

                    {cat.label}

                    {/* NEW badge on Men to show it has sub-categories */}
                    {cat.label === 'Men' && (
                      <span style={{
                        position: 'absolute', top: '10px', right: '-2px',
                        background: '#ff6b00', color: '#fff',
                        fontSize: '0.48rem', fontWeight: 800,
                        padding: '1px 4px', borderRadius: '4px',
                        letterSpacing: '0.3px', lineHeight: 1.4,
                      }}>NEW</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch}
              style={{ flex: 1, maxWidth: '380px', position: 'relative', marginLeft: 'auto' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{ width: '100%', padding: '0.55rem 1rem 0.55rem 2.5rem', border: 'none', borderRadius: '4px', background: '#f5f5f6', fontSize: '0.83rem', color: '#1c1c1c', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 1.5px #ff6b00'; }}
                onBlur={e => { e.target.style.background = '#f5f5f6'; e.target.style.boxShadow = 'none'; }}
              />
              <svg style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
                width="15" height="15" fill="none" stroke="#1c1c1c" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </form>

            {/* Right icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', marginLeft: '0.5rem' }}>

              {/* Profile dropdown */}
              <div ref={dropRef} style={{ position: 'relative' }}>
                <button className="nav-icon-btn"
                  onClick={() => user ? setDropOpen(!dropOpen) : navigate('/login')}>
                  <svg width="20" height="20" fill="none" stroke="#1c1c1c" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="nav-icon-label">{user ? user.name.split(' ')[0] : 'Profile'}</span>
                </button>

                {dropOpen && user && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: '#fff', borderRadius: '8px', minWidth: '200px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', border: '1px solid #eaeaec', zIndex: 200, overflow: 'hidden' }}>
                    <div style={{ padding: '0.85rem 1rem', background: '#fff4ec', borderBottom: '1px solid #eaeaec' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1c1c1c', margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#696b79', margin: '1px 0 0' }}>{user.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setDropOpen(false)}
                      style={{ display: 'flex', gap: '0.6rem', padding: '0.65rem 1rem', textDecoration: 'none', color: '#1c1c1c', fontSize: '0.83rem', fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff4ec'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      📦 My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setDropOpen(false)}
                      style={{ display: 'flex', gap: '0.6rem', padding: '0.65rem 1rem', textDecoration: 'none', color: '#1c1c1c', fontSize: '0.83rem', fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff4ec'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      ❤️ My Wishlist
                    </Link>
                    <button onClick={handleLogout}
                      style={{ width: '100%', padding: '0.65rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#ff6b00', fontSize: '0.83rem', fontWeight: 700, borderTop: '1px solid #f5f5f6' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff4ec'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="nav-icon-btn" style={{ textDecoration: 'none' }}>
                <div style={{ position: 'relative' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24"
                    fill={wishCount > 0 ? '#ff3f6c' : 'none'}
                    stroke={wishCount > 0 ? '#ff3f6c' : '#1c1c1c'}
                    strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishCount > 0 && (
                    <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#ff3f6c', color: '#fff', fontSize: '0.58rem', fontWeight: 700, minWidth: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                      {wishCount}
                    </span>
                  )}
                </div>
                <span className="nav-icon-label">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="nav-icon-btn">
                <div style={{ position: 'relative' }}>
                  <svg width="20" height="20" fill="none" stroke="#1c1c1c" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path strokeLinecap="round" d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#ff6b00', color: '#fff', fontSize: '0.58rem', fontWeight: 700, minWidth: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="nav-icon-label">Bag</span>
              </Link>
            </div>
          </div>

          {/* Mobile right icons */}
          <div className="nav-mobile-icons" style={{ alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
            <Link to="/wishlist"
              style={{ textDecoration: 'none', padding: '6px', position: 'relative', display: 'flex' }}>
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={wishCount > 0 ? '#ff3f6c' : 'none'}
                stroke={wishCount > 0 ? '#ff3f6c' : '#1c1c1c'} strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishCount > 0 && (
                <span style={{ position: 'absolute', top: '0', right: '0', background: '#ff3f6c', color: '#fff', fontSize: '0.58rem', fontWeight: 700, minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {wishCount}
                </span>
              )}
            </Link>
            <button onClick={() => setSearchOpen(s => !s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex' }}>
              <svg width="20" height="20" fill="none" stroke="#1c1c1c" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <Link to="/cart"
              style={{ textDecoration: 'none', padding: '6px', position: 'relative', display: 'flex' }}>
              <svg width="22" height="22" fill="none" stroke="#1c1c1c" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path strokeLinecap="round" d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '0', right: '0', background: '#ff6b00', color: '#fff', fontSize: '0.58rem', fontWeight: 700, minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid #eaeaec', background: '#fff' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
                placeholder="Search products..."
                style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.6rem', border: '1.5px solid #ff6b00', borderRadius: '4px', fontSize: '0.88rem', outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}
                width="16" height="16" fill="none" stroke="#ff6b00" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </form>
          </div>
        )}
      </nav>
    </>
  );
}