import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

// ── Sub-category config for Men ──
const MEN_SUBS = [
  {
    key: 'All',
    label: 'All',
    icon: '👕',
    desc: "Complete Men's Collection",
    color: '#1c1c1c',
    bg: 'linear-gradient(135deg,#1c1c1c,#3d3d3d)',
  },
  {
    key: 'T-Shirts',
    label: 'T-Shirts',
    icon: '👕',
    desc: 'Casual & Graphic Tees',
    color: '#e67e22',
    bg: 'linear-gradient(135deg,#e67e22,#f39c12)',
  },
  {
    key: 'Shirts For Boys',
    label: 'Shirts For Boys',
    icon: '👔',
    desc: 'Formal & Casual Shirts',
    color: '#2980b9',
    bg: 'linear-gradient(135deg,#2980b9,#3498db)',
  },
  {
    key: 'Party Wear',
    label: 'Party Wear',
    icon: '🎉',
    desc: 'Blazers, Sets & More',
    color: '#8e44ad',
    bg: 'linear-gradient(135deg,#8e44ad,#9b59b6)',
  },
  {
    key: 'Boys Kurta Pajama',
    label: 'Kurta Pajama',
    icon: '🧥',
    desc: 'Traditional Ethnic Wear',
    color: '#16a085',
    bg: 'linear-gradient(135deg,#16a085,#1abc9c)',
  },
  {
    key: 'Boys Sherwani',
    label: 'Sherwani',
    icon: '🌟',
    desc: 'Wedding & Ceremony Wear',
    color: '#c0392b',
    bg: 'linear-gradient(135deg,#c0392b,#e74c3c)',
  },
  {
    key: 'Jodhpuri Suits',
    label: 'Jodhpuri Suits',
    icon: '🏅',
    desc: 'Bandhgala & Royal Styles',
    color: '#d35400',
    bg: 'linear-gradient(135deg,#d35400,#e67e22)',
  },
  {
    key: 'Suits',
    label: 'Suits',
    icon: '🤵',
    desc: '2-Piece, 3-Piece & Tuxedos',
    color: '#2c3e50',
    bg: 'linear-gradient(135deg,#2c3e50,#34495e)',
  },
  {
    key: 'Jeans',
    label: 'Jeans',
    icon: '👖',
    desc: 'All Denim Styles',
    color: '#2980b9',
    bg: 'linear-gradient(135deg,#1a3a5c,#2980b9)',
  },
  {
    key: 'Teens',
    label: 'Teens',
    icon: '🧑',
    desc: '13 – 18 Years',
    color: '#8e44ad',
    bg: 'linear-gradient(135deg,#8e44ad,#9b59b6)',
    ageRange: '13–18 yrs',
  },
  {
    key: 'Men',
    label: 'Men',
    icon: '🧔',
    desc: 'Adults 18+',
    color: '#c0392b',
    bg: 'linear-gradient(135deg,#c0392b,#e74c3c)',
    ageRange: '18+ yrs',
  },
];

const SUB_DESCRIPTIONS = {
  All: "Shop by style — t-shirts, ethnic wear, suits and more in one place",
  'T-Shirts': 'Casual graphic tees, polo shirts and striped tees for everyday wear',
  'Shirts For Boys': 'Smart formal shirts and breezy casual shirts for every occasion',
  'Party Wear': 'Blazer sets, waistcoats and indo-western styles for celebrations',
  'Boys Kurta Pajama': 'Classic cotton kurtas to embroidered festive sets',
  'Boys Sherwani': 'Premium sherwanis for weddings, ceremonies and special events',
  'Jodhpuri Suits': 'Traditional bandhgala jodhpuri suits with a royal touch',
  Suits: 'Elegant 2-piece, 3-piece suits and tuxedos for formal occasions',
  Jeans: 'Premium denim collection — slim, skinny, relaxed and more',
  Teens: 'Trendy streetwear and casual styles for teenagers (13–18 years)',
  Men: 'Smart formals, casual wear and ethnic styles for adult men',
};

const SORT_OPTIONS = [
  { label: 'Recommended',        value: '' },
  { label: 'Price: Low to High', value: 'asc' },
  { label: 'Price: High to Low', value: 'desc' },
  { label: 'New Arrivals',       value: 'new' },
];

export default function MenCategory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate  = useNavigate();
  const activeSub = searchParams.get('sub') || 'All';
  const searchQ   = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sort,     setSort]     = useState('');
  const [search,   setSearch]   = useState(searchQ);

  const currentSub = MEN_SUBS.find(s => s.key === activeSub) || MEN_SUBS[0];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const sub = activeSub === 'All' ? null : activeSub;
      const data = await getProducts('Men', search || null, sub);
      let sorted = [...data];
      if (sort === 'asc')  sorted.sort((a, b) => a.price - b.price);
      if (sort === 'desc') sorted.sort((a, b) => b.price - a.price);
      setProducts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeSub, search, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSubChange = (key) => {
    const params = new URLSearchParams(searchParams);
    params.set('sub', key);
    if (search) params.set('search', search);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) params.set('search', search.trim());
    else params.delete('search');
    setSearchParams(params);
  };

  return (
    <>
      <style>{`
        .men-page { background: #f5f5f6; min-height: 100vh; }

        /* ── Hero ── */
        .men-hero {
          background: linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 60%, #1a0800 100%);
          padding: 2.5rem 0 0;
          position: relative; overflow: hidden;
        }
        .men-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(45deg, rgba(255,107,0,0.04) 0, rgba(255,107,0,0.04) 1px, transparent 0, transparent 50%);
          background-size: 20px 20px;
        }
        .men-hero-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;
          position: relative; z-index: 1;
        }

        /* Breadcrumb */
        .men-breadcrumb {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.72rem; color: rgba(255,255,255,0.5);
          margin-bottom: 1.25rem;
        }
        .men-breadcrumb a { color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
        .men-breadcrumb a:hover { color: #ff6b00; }
        .men-breadcrumb span { color: rgba(255,255,255,0.25); }
        .men-breadcrumb .current { color: #fff; font-weight: 600; }

        /* Hero title */
        .men-hero-title {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700; color: #fff; line-height: 1.1;
          margin-bottom: 0.4rem;
        }
        .men-hero-title span { color: #ff6b00; font-style: italic; }
        .men-hero-desc { font-size: 0.85rem; color: rgba(255,255,255,0.55); margin-bottom: 1.75rem; }

        /* ── Sub-category scroll tabs ── */
        .sub-tabs-wrap {
          display: flex; gap: 10px; overflow-x: auto; padding-bottom: 0;
          scrollbar-width: none;
        }
        .sub-tabs-wrap::-webkit-scrollbar { display: none; }
        .sub-tab {
          display: flex; flex-direction: column; align-items: center;
          gap: 6px; padding: 12px 20px 16px;
          border-radius: 12px 12px 0 0;
          cursor: pointer; flex-shrink: 0;
          border: none; background: rgba(255,255,255,0.06);
          transition: all 0.25s ease; min-width: 90px;
          border-top: 3px solid transparent;
          position: relative; bottom: -1px;
        }
        .sub-tab:hover { background: rgba(255,255,255,0.12); }
        .sub-tab.active {
          background: #f5f5f6;
          border-top-color: #ff6b00;
        }
        .sub-tab-icon { font-size: 1.6rem; line-height: 1; }
        .sub-tab-label {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.3px;
          color: rgba(255,255,255,0.6); white-space: nowrap;
        }
        .sub-tab.active .sub-tab-label { color: #1c1c1c; }
        .sub-tab-age {
          font-size: 0.58rem; color: rgba(255,255,255,0.35);
          font-weight: 600; letter-spacing: 0.3px;
        }
        .sub-tab.active .sub-tab-age { color: #ff6b00; }

        /* ── Sub-category cards ── */
        .sub-cards-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px; padding: 1.5rem 0;
        }
        .sub-card {
          border-radius: 12px; overflow: hidden; cursor: pointer;
          aspect-ratio: 3/2; position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid transparent;
        }
        .sub-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
        .sub-card.active-card { border-color: #ff6b00; }
        .sub-card-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.5rem;
        }
        .sub-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end;
          padding: 0.75rem 0.5rem;
        }
        .sub-card-name { font-size: 0.82rem; font-weight: 800; color: #fff; letter-spacing: 0.3px; text-align: center; }
        .sub-card-count { font-size: 0.6rem; color: rgba(255,255,255,0.6); font-weight: 600; margin-top: 1px; text-align: center; }
        .sub-card-age-badge {
          position: absolute; top: 8px; left: 8px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(4px);
          color: #fff; font-size: 0.6rem; font-weight: 700;
          padding: 2px 8px; border-radius: 20px; letter-spacing: 0.3px;
        }

        /* ── Filter bar ── */
        .filter-bar {
          background: #fff; padding: 0.75rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem; margin-bottom: 12px;
          border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .active-sub-badge {
          display: flex; align-items: center; gap: 8px;
          background: #fff4ec; border: 1px solid rgba(255,107,0,0.2);
          padding: 5px 14px; border-radius: 20px;
          font-size: 0.78rem; font-weight: 700; color: #ff6b00;
        }
        .filter-right { display: flex; align-items: center; gap: 1rem; }
        .filter-count { font-size: 0.8rem; color: #696b79; }
        .filter-select {
          border: 1px solid #eaeaec; border-radius: 4px;
          padding: 0.35rem 0.75rem; font-size: 0.78rem;
          color: #1c1c1c; cursor: pointer; outline: none;
          background: #fff; font-family: inherit;
        }
        .filter-select:focus { border-color: #ff6b00; }

        /* Search */
        .men-search-form { display: flex; align-items: center; gap: 0; }
        .men-search-input {
          border: 1px solid #eaeaec; border-right: none;
          border-radius: 6px 0 0 6px; padding: 7px 14px;
          font-size: 0.82rem; outline: none; width: 200px;
          font-family: inherit; transition: border-color 0.2s;
        }
        .men-search-input:focus { border-color: #ff6b00; }
        .men-search-btn {
          background: #ff6b00; border: none; color: #fff;
          padding: 8px 14px; border-radius: 0 6px 6px 0;
          cursor: pointer; font-size: 0.82rem; transition: background 0.2s;
        }
        .men-search-btn:hover { background: #cc5500; }

        /* ── Product grid ── */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        /* Skeleton */
        .skel-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .skel-card { background: #fff; border-radius: 12px; overflow: hidden; }
        .skel-img  { padding-top: 125%; }
        .skel-info { padding: 10px; display: flex; flex-direction: column; gap: 6px; }

        /* Empty state */
        .empty-state {
          grid-column: 1/-1; background: #fff; border-radius: 12px;
          padding: 3rem; text-align: center;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) { .prod-grid,.skel-grid { grid-template-columns: repeat(3,1fr); } .sub-cards-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 768px)  { .prod-grid,.skel-grid { grid-template-columns: repeat(2,1fr); } .sub-cards-grid { grid-template-columns: repeat(2,1fr); } .filter-bar { flex-direction: column; align-items: flex-start; } .men-search-input { width: 140px; } }
        @media (max-width: 480px)  { .prod-grid,.skel-grid { grid-template-columns: repeat(2,1fr); gap: 8px; } .sub-cards-grid { grid-template-columns: repeat(2,1fr); } }
      `}</style>

      <div className="men-page">

        {/* ── Hero ── */}
        <div className="men-hero">
          <div className="men-hero-inner">

            {/* Breadcrumb */}
            <div className="men-breadcrumb">
              <Link to="/home">Home</Link>
              <span>/</span>
              <span className="current">Men's Collection</span>
              {activeSub !== 'All' && (
                <>
                  <span>/</span>
                  <span className="current">{currentSub.label}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="men-hero-title">
              Men's <span>{currentSub.key === 'All' ? 'Collection' : currentSub.label}</span>
            </h1>
            <p className="men-hero-desc">
              {SUB_DESCRIPTIONS[activeSub] || SUB_DESCRIPTIONS['All']}
            </p>

            {/* Sub-category tabs */}
            <div className="sub-tabs-wrap">
              {MEN_SUBS.map(sub => (
                <button
                  key={sub.key}
                  className={`sub-tab ${activeSub === sub.key ? 'active' : ''}`}
                  onClick={() => handleSubChange(sub.key)}>
                  <span className="sub-tab-icon">{sub.icon}</span>
                  <span className="sub-tab-label">{sub.label}</span>
                  {sub.ageRange && <span className="sub-tab-age">{sub.ageRange}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 1.5rem 3rem' }}>

          {/* Sub-category cards — only when 'All' selected */}
          {activeSub === 'All' && (
            <div className="sub-cards-grid" style={{ marginBottom: '1.25rem' }}>
              {MEN_SUBS.filter(s => s.key !== 'All').map(sub => (
                <div
                  key={sub.key}
                  className="sub-card"
                  onClick={() => handleSubChange(sub.key)}>
                  <div className="sub-card-bg" style={{ background: sub.bg }}>
                    <span>{sub.icon}</span>
                  </div>
                  <div className="sub-card-overlay">
                    <span className="sub-card-name">{sub.label}</span>
                    <span className="sub-card-count">{sub.desc}</span>
                  </div>
                  {sub.ageRange && (
                    <span className="sub-card-age-badge">{sub.ageRange}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Filter bar */}
          <div className="filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="active-sub-badge">
                <span>{currentSub.icon}</span>
                {currentSub.label}
                {currentSub.ageRange && (
                  <span style={{ fontSize: '0.65rem', background: '#ff6b00', color: '#fff', padding: '1px 7px', borderRadius: '10px' }}>
                    {currentSub.ageRange}
                  </span>
                )}
              </div>
              {/* Sub filter pills */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {MEN_SUBS.map(sub => (
                  <button key={sub.key}
                    onClick={() => handleSubChange(sub.key)}
                    style={{
                      padding: '4px 12px', borderRadius: '20px', border: 'none',
                      fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                      background: activeSub === sub.key ? '#1c1c1c' : '#f5f5f6',
                      color: activeSub === sub.key ? '#ff6b00' : '#696b79',
                      transition: 'all 0.2s',
                    }}>
                    {sub.icon} {sub.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-right">
              {/* Search */}
              <form className="men-search-form" onSubmit={handleSearch}>
                <input
                  className="men-search-input"
                  type="text"
                  placeholder="Search in Men..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="men-search-btn" type="submit">🔍</button>
              </form>
              <span className="filter-count">
                <strong style={{ color: '#1c1c1c' }}>{products.length}</strong> items
              </span>
              <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="skel-grid">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skel-card">
                  <div className="skel-img skeleton" />
                  <div className="skel-info">
                    <div className="skeleton" style={{ height: 10, width: '50%' }} />
                    <div className="skeleton" style={{ height: 12, width: '80%' }} />
                    <div className="skeleton" style={{ height: 10, width: '45%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="prod-grid">
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{currentSub.icon}</div>
                <h4 style={{ color: '#1c1c1c', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>
                  No products found in {currentSub.label}
                </h4>
                <p style={{ color: '#696b79', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Try a different category or search term
                </p>
                <button
                  onClick={() => handleSubChange('All')}
                  style={{ background: '#ff6b00', color: '#fff', border: 'none', padding: '9px 24px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  View All Men
                </button>
              </div>
            </div>
          ) : (
            <div className="prod-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}