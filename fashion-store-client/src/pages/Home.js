import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const CATEGORIES = ['All', 'Men', 'Women', 'Footwear', 'Accessories', 'Cosmetics'];

const BANNERS = [
  { bg: 'linear-gradient(120deg,#ff6b00 0%,#ff905a 100%)', title: "WOMEN'S EDIT",  sub: 'New Collection 2026', desc: 'Discover the latest styles', cta: 'SHOP NOW', cat: 'Women' },
  { bg: 'linear-gradient(120deg,#1c1c1c 0%,#444 100%)',    title: "MEN'S STYLE",   sub: 'Formals & Casuals',   desc: 'Dress sharp, feel great',  cta: 'EXPLORE',  cat: 'Men' },
  { bg: 'linear-gradient(120deg,#ff905a 0%,#ff6b00 100%)', title: 'STEP IN STYLE', sub: 'Footwear Collection', desc: 'Walk with confidence',      cta: 'DISCOVER', cat: 'Footwear' },
];

// ── Men gets its own route /men, others use /home?category=X ──
const CAT_DATA = [
  { label: 'Men',         icon: '👔', route: '/men',                    bg: '#E8F0FE' },
  { label: 'Women',       icon: '👗', route: '/home?category=Women',    bg: '#FFE4E1' },
  { label: 'Footwear',    icon: '👟', route: '/home?category=Footwear', bg: '#E6FFFA' },
  { label: 'Accessories', icon: '👜', route: '/home?category=Accessories', bg: '#FFF7CC' },
  { label: 'Cosmetics',   icon: '💄', route: '/home?category=Cosmetics', bg: '#F3E8FF' },
];

// Banner CTA routes — Men goes to /men
const BANNER_ROUTES = {
  Women:    '/home?category=Women',
  Men:      '/men',
  Footwear: '/home?category=Footwear',
};

const SORT_OPTIONS = [
  { label: 'Recommended',       value: '' },
  { label: 'Price: Low to High', value: 'asc' },
  { label: 'Price: High to Low', value: 'desc' },
];

export default function Home() {
  const navigate = useNavigate();
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [sort,       setSort]       = useState('');
  const [bannerIdx,  setBannerIdx]  = useState(0);
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category') || 'All';
  const search   = searchParams.get('search')   || '';

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(category, search)
      .then(data => {
        let sorted = [...data];
        if (sort === 'asc')  sorted.sort((a, b) => a.price - b.price);
        if (sort === 'desc') sorted.sort((a, b) => b.price - a.price);
        setProducts(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const banner = BANNERS[bannerIdx];

  // ── Category pill click — Men goes to /men ──
  const handleCatPill = (cat) => {
    if (cat === 'Men') {
      navigate('/men');
    } else if (cat === 'All') {
      navigate('/home');
    } else {
      navigate(`/home?category=${cat}`);
    }
  };

  return (
    <>
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .product-grid { grid-template-columns: 1fr; gap: 10px; } }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        @media (max-width: 1100px) { .skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px)  { .skeleton-grid { grid-template-columns: 1fr; } }

        .cat-strip { overflow-x: auto; }
        .cat-strip::-webkit-scrollbar { display: none; }

        .cat-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .cat-pills { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 2px; }
          .cat-pills::-webkit-scrollbar { display: none; }
        }

        /* Men category card special badge */
        .men-sub-hint {
          display: block;
          font-size: 0.55rem;
          color: #ff6b00;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin-top: 2px;
        }
      `}</style>

      <div style={{ background: '#f5f5f6', minHeight: '100vh' }}>

        {/* ── Hero banner ── */}
        {!search && category === 'All' && (
          <div style={{ background: '#fff', marginBottom: '8px' }}>
            <div style={{
              background: banner.bg, minHeight: '200px', position: 'relative',
              overflow: 'hidden', display: 'flex', alignItems: 'center',
              transition: 'background 0.8s ease'
            }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.25rem', width: '100%', position: 'relative', zIndex: 1 }}>
                <p className="animate-fadeUp" key={bannerIdx + 's'}
                  style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  {banner.sub}
                </p>
                <h1 className="animate-fadeUp" key={bannerIdx + 't'}
                  style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '0.6rem', opacity: 0, animationDelay: '0.05s' }}>
                  {banner.title}
                </h1>
                <p className="animate-fadeUp" key={bannerIdx + 'd'}
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem', marginBottom: '1.25rem', opacity: 0, animationDelay: '0.1s' }}>
                  {banner.desc}
                </p>

                {/* ── Banner CTA — Men goes to /men ── */}
                <Link
                  to={BANNER_ROUTES[banner.cat] || `/home?category=${banner.cat}`}
                  style={{ display: 'inline-block', background: '#fff', color: '#ff6b00', padding: '0.55rem 1.5rem', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px', textDecoration: 'none', transition: 'transform 0.2s,box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {banner.cta}
                </Link>
              </div>

              {/* Banner dots */}
              <div style={{ position: 'absolute', bottom: '0.75rem', right: '1.25rem', display: 'flex', gap: '5px', zIndex: 1 }}>
                {BANNERS.map((_, i) => (
                  <button key={i} onClick={() => setBannerIdx(i)}
                    style={{ width: i === bannerIdx ? '18px' : '6px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.3s', padding: 0 }} />
                ))}
              </div>
              <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', zIndex: 0 }} />
              <div style={{ position: 'absolute', right: '60px', bottom: '-70px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', zIndex: 0 }} />
            </div>

            {/* ── Category icons strip ── */}
            <div className="cat-strip" style={{ padding: '1.25rem 1rem', maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', minWidth: 'max-content', margin: '0 auto' }}>
                {CAT_DATA.map(item => (
                  <Link key={item.label} to={item.route} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      background: item.bg, borderRadius: '8px', cursor: 'pointer',
                      padding: '0.85rem 1.1rem', transition: 'all 0.2s', minWidth: '76px',
                      position: 'relative'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,107,0,0.18)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1c1c1c', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                      {/* Sub-category hint only for Men */}
                      {item.label === 'Men' && (
                        <span className="men-sub-hint">Kids·Teens·Jeans</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Products section ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 0.75rem 3rem' }}>

          {/* Filter bar */}
          <div style={{
            background: '#fff', padding: '0.7rem 1rem',
            marginBottom: '12px', borderRadius: '8px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem'
          }}>
            <div className="cat-pills">
              {CATEGORIES.map(cat => {
                // Men pill is active only when on /men route (not here)
                const active = cat === category;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCatPill(cat)}
                    style={{
                      padding: '0.28rem 0.85rem', borderRadius: '20px',
                      textDecoration: 'none', fontSize: '0.76rem', fontWeight: 600,
                      background: active ? '#ff6b00' : 'transparent',
                      color: active ? '#fff' : '#696b79',
                      border: `1px solid ${active ? '#ff6b00' : '#eaeaec'}`,
                      transition: 'all 0.2s', whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}>
                    {cat}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#696b79' }}>
                <strong style={{ color: '#1c1c1c' }}>{products.length}</strong> items
              </span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ border: '1px solid #eaeaec', borderRadius: '4px', padding: '0.32rem 0.7rem', fontSize: '0.78rem', color: '#1c1c1c', cursor: 'pointer', outline: 'none', background: '#fff' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* ── Men category redirect banner ── */}
          {category === 'Men' && (
            <div style={{
              background: 'linear-gradient(135deg,#1c1c1c,#333)',
              borderRadius: '8px', padding: '1rem 1.5rem',
              marginBottom: '12px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '0.75rem'
            }}>
              <div>
                <p style={{ color: '#ff6b00', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 3px' }}>
                  NEW FEATURE
                </p>
                <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                  Shop Men's by Age Group — Kids, Children, Teens, Jeans & More
                </p>
              </div>
              <button
                onClick={() => navigate('/men')}
                style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#cc5500'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ff6b00'; }}>
                Explore Men's Collection →
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="skeleton-grid">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', height: '140px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div className="skeleton" style={{ width: '44%', flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '10px', width: '40%' }} />
                    <div className="skeleton" style={{ height: '12px', width: '85%' }} />
                    <div className="skeleton" style={{ height: '10px', width: '60%' }} />
                    <div className="skeleton" style={{ height: '28px', width: '100%', marginTop: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div style={{ background: '#fff', padding: '3rem 1rem', textAlign: 'center', borderRadius: '12px' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</p>
              <h4 style={{ color: '#1c1c1c', fontSize: '1.25rem', fontFamily: 'Georgia,serif' }}>No products found</h4>
              <p style={{ color: '#696b79', fontSize: '0.85rem', marginTop: '0.4rem' }}>Try a different search or category</p>
            </div>
          )}

          {/* Product grid */}
          {!loading && products.length > 0 && (
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ background: '#1c1c1c', color: '#fff', padding: '2.5rem 1rem 1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <svg viewBox="0 0 320 100" width="160" height="50" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="luxF" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff6b00"/><stop offset="100%" stopColor="#ff9a5a"/>
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="30" stroke="url(#luxF)" strokeWidth="2" fill="none"/>
                  <text x="35" y="58" fontSize="20" fontFamily="Arial" fill="url(#luxF)" fontWeight="bold">LW</text>
                  <text x="100" y="52" fontSize="26" fontFamily="Arial" fill="#fff" fontWeight="700" letterSpacing="2">LUXEWEAR</text>
                  <text x="100" y="72" fontSize="9" fontFamily="Arial" fill="#888" letterSpacing="3">FASHION • STYLE</text>
                </svg>
                <p style={{ color: '#888', fontSize: '0.78rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
                  Your destination for premium fashion at affordable prices.
                </p>
              </div>
              {[
                { title: 'Shop',  links: ['Men', 'Women', 'Footwear', 'Accessories', 'Cosmetics'] },
                { title: 'Help',  links: ['FAQs', 'Shipping', 'Returns', 'Track Order', 'Contact Us'] },
                { title: 'About', links: ['About Us', 'Careers', 'Press', 'Privacy Policy'] },
              ].map(col => (
                <div key={col.title}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff6b00', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.85rem' }}>{col.title}</p>
                  {col.links.map(link => (
                    <p key={link}
                      onClick={() => link === 'Men' ? navigate('/men') : null}
                      style={{ fontSize: '0.82rem', color: '#888', marginBottom: '0.45rem', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#ff6b00'}
                      onMouseLeave={e => e.target.style.color = '#888'}>
                      {link}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#555' }}>© 2026 LUXEWEAR. All rights reserved.</p>
              <p style={{ fontSize: '0.75rem', color: '#555' }}>Made with ❤️ in India</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}