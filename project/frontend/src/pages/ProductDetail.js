import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishAnim, setWishAnim] = useState(false);
  const [tab, setTab] = useState('desc');
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isWished } = useWishlist();
  const navigate = useNavigate();
  const discount = 20;

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => navigate('/'));
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const wished = product ? isWished(product.id) : false;

  const handleWish = () => {
    if (!product) return;
    toggleWishlist(product);
    setWishAnim(true);
    setTimeout(() => setWishAnim(false), 400);
  };

  const handleAddToBag = async () => {
    if (!user) return navigate('/login');
    await addItem(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Buy Now — add to cart then go directly to checkout
  const handleBuyNow = async () => {
    if (!user) return navigate('/login');
    await addItem(product.id, qty);
    navigate('/checkout');
  };

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #f5f5f6', borderTop: '3px solid #ff6b00', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const original = Math.round(product.price * (100 / (100 - discount)));

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.45); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s ease forwards; }
        .pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .pd-info { padding: 2rem 2rem 2rem 1.5rem; }
        .pd-cta-row { display: flex; gap: 0.75rem; }
        @media (max-width: 768px) {
          .pd-grid { grid-template-columns: 1fr; }
          .pd-info { padding: 1.25rem 1rem 2rem; }
          .pd-title { font-size: 1.4rem !important; }
          .pd-price-main { font-size: 1.3rem !important; }
          .pd-cta-row { flex-direction: column; }
          .pd-cta-row button { width: 100%; }
        }
      `}</style>

      <div style={{ background: '#f5f5f6', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem 1rem 3rem' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.72rem', color: '#696b79', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = '#ff6b00'}
              onMouseLeave={e => e.target.style.color = '#696b79'}>Home</span>
            <span>/</span>
            <span onClick={() => navigate(`/?category=${product.category}`)} style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = '#ff6b00'}
              onMouseLeave={e => e.target.style.color = '#696b79'}>{product.category}</span>
            <span>/</span>
            <span style={{ color: '#1c1c1c', fontWeight: 600 }}>{product.name}</span>
          </div>

          {/* Product card */}
          <div className="pd-grid" style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Image panel */}
            <div style={{ position: 'relative', background: '#f5f5f6' }}>
              {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
              <img src={product.image_url} alt={product.name}
                onLoad={() => setImgLoaded(true)}
                onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/600/800`; setImgLoaded(true); }}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }} />

              {/* Discount badge */}
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#14958f', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '2px' }}>
                {discount}% OFF
              </span>

              {/* Wishlist on image */}
              <button
                onClick={handleWish}
                className={wishAnim ? 'heart-pop' : ''}
                title={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: wished ? '#fff4ec' : '#fff',
                  border: `1.5px solid ${wished ? '#ff6b00' : '#eaeaec'}`,
                  borderRadius: '50%', width: '40px', height: '40px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s'
                }}>
                <svg width="17" height="17" viewBox="0 0 24 24"
                  fill={wished ? '#ff6b00' : 'none'}
                  stroke={wished ? '#ff6b00' : '#696b79'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Details panel */}
            <div className="pd-info">
              <span style={{ background: '#fff4ec', color: '#ff6b00', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {product.category}
              </span>

              <h1 className="pd-title" style={{ fontFamily: 'Georgia, serif', fontSize: '1.7rem', fontWeight: 700, color: '#1c1c1c', margin: '0.75rem 0 0.25rem', lineHeight: 1.2 }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.6rem 0 1rem' }}>
                <div style={{ background: '#14958f', color: '#fff', padding: '2px 8px', borderRadius: '2px', fontSize: '0.72rem', fontWeight: 700 }}>4.2 ★</div>
                <span style={{ fontSize: '0.75rem', color: '#696b79' }}>128 ratings</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', marginBottom: '0.85rem', paddingBottom: '1rem', borderBottom: '1px solid #f5f5f6', flexWrap: 'wrap' }}>
                <span className="pd-price-main" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1c1c1c' }}>
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '1rem', color: '#696b79', textDecoration: 'line-through' }}>
                  ₹{Number(original).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ff905a' }}>({discount}% OFF)</span>
              </div>

              {/* Stock */}
              <p style={{ fontSize: '0.82rem', marginBottom: '1rem', color: product.stock > 0 ? '#14958f' : '#dc3545', fontWeight: 600 }}>
                {product.stock > 0 ? `✓ In Stock · ${product.stock} units left` : '✗ Out of Stock'}
              </p>

              {/* Quantity */}
              {product.stock > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</p>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaec', borderRadius: '4px', overflow: 'hidden', width: 'fit-content' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      style={{ padding: '7px 16px', border: 'none', background: '#f5f5f6', cursor: 'pointer', fontWeight: 700, color: '#1c1c1c', fontSize: '1.1rem' }}>−</button>
                    <span style={{ padding: '7px 18px', fontWeight: 700, fontSize: '0.9rem', minWidth: '44px', textAlign: 'center' }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      style={{ padding: '7px 16px', border: 'none', background: '#f5f5f6', cursor: 'pointer', fontWeight: 700, color: '#1c1c1c', fontSize: '1.1rem' }}>+</button>
                  </div>
                </div>
              )}

              {/* ── CTA Buttons: WISHLIST | ADD TO BAG | BUY NOW ── */}
              {product.stock > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {/* Row 1: Wishlist + Add to Bag */}
                  <div className="pd-cta-row">
                    <button onClick={handleWish}
                      style={{
                        flex: 1, padding: '0.82rem', border: `1.5px solid ${wished ? '#ff6b00' : '#eaeaec'}`,
                        borderRadius: '4px', background: wished ? '#fff4ec' : '#fff',
                        color: wished ? '#ff6b00' : '#1c1c1c',
                        fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                        textTransform: 'uppercase', letterSpacing: '0.4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.2s'
                      }}>
                      <svg width="15" height="15" viewBox="0 0 24 24"
                        fill={wished ? '#ff6b00' : 'none'}
                        stroke={wished ? '#ff6b00' : '#1c1c1c'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {wished ? 'WISHLISTED' : 'WISHLIST'}
                    </button>

                    <button onClick={handleAddToBag}
                      style={{
                        flex: 1, padding: '0.82rem', border: 'none', borderRadius: '4px',
                        background: added ? '#14958f' : '#ff6b00',
                        color: '#fff', fontSize: '0.82rem', fontWeight: 700,
                        cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.4px',
                        transition: 'all 0.2s'
                      }}>
                      {added ? '✓ ADDED TO BAG' : 'ADD TO BAG'}
                    </button>
                  </div>

                  {/* Row 2: Buy Now — full width */}
                  <button onClick={handleBuyNow}
                    style={{
                      width: '100%', padding: '0.9rem', border: '2px solid #ff6b00',
                      borderRadius: '4px', background: '#fff',
                      color: '#ff6b00', fontSize: '0.88rem', fontWeight: 700,
                      cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ff6b00'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ff6b00'; }}>
                    ⚡ BUY NOW
                  </button>
                </div>
              ) : (
                <div style={{ marginBottom: '1.25rem' }}>
                  <button disabled style={{ width: '100%', padding: '0.9rem', border: 'none', borderRadius: '4px', background: '#eaeaec', color: '#888', fontSize: '0.88rem', fontWeight: 700, cursor: 'not-allowed', textTransform: 'uppercase' }}>
                    OUT OF STOCK
                  </button>
                  <button onClick={handleWish} style={{
                    width: '100%', marginTop: '0.6rem', padding: '0.82rem',
                    border: `1.5px solid ${wished ? '#ff6b00' : '#eaeaec'}`, borderRadius: '4px',
                    background: wished ? '#fff4ec' : '#fff', color: wished ? '#ff6b00' : '#1c1c1c',
                    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={wished ? '#ff6b00' : 'none'} stroke={wished ? '#ff6b00' : '#1c1c1c'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {wished ? 'WISHLISTED' : 'NOTIFY WHEN AVAILABLE'}
                  </button>
                </div>
              )}

              {/* Offers */}
              <div style={{ background: '#fff4ec', border: '1px solid #ffd4a8', borderRadius: '6px', padding: '0.9rem 1rem', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff6b00', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Available Offers</p>
                {['Free shipping on orders ₹999+', 'Easy 30-day returns', '100% authentic products'].map(o => (
                  <p key={o} style={{ fontSize: '0.78rem', color: '#1c1c1c', marginBottom: '3px', display: 'flex', gap: '6px' }}>
                    <span style={{ color: '#14958f', fontWeight: 700 }}>✓</span> {o}
                  </p>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ borderTop: '1px solid #f5f5f6', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid #eaeaec', marginBottom: '0.85rem', overflowX: 'auto' }}>
                  {[{ k: 'desc', l: 'Description' }, { k: 'specs', l: 'Specifications' }, { k: 'delivery', l: 'Delivery' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)}
                      style={{ padding: '0.55rem 0.9rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: tab === t.k ? '#ff6b00' : '#696b79', borderBottom: tab === t.k ? '2px solid #ff6b00' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                      {t.l}
                    </button>
                  ))}
                </div>
                {tab === 'desc' && <p style={{ fontSize: '0.83rem', color: '#696b79', lineHeight: 1.7 }}>{product.description}</p>}
                {tab === 'specs' && (
                  <div>
                    {[['Category', product.category], ['Brand', 'LUXEWEAR'], ['Stock', `${product.stock} units`], ['SKU', `LW-${String(product.id).padStart(4, '0')}`]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', padding: '6px 0', borderBottom: '1px solid #f5f5f6', fontSize: '0.82rem' }}>
                        <span style={{ width: '120px', color: '#696b79', flexShrink: 0 }}>{k}</span>
                        <span style={{ color: '#1c1c1c', fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {tab === 'delivery' && (
                  <div style={{ fontSize: '0.82rem', color: '#696b79', lineHeight: 2 }}>
                    <p>🚚 Free delivery on orders above ₹999</p>
                    <p>📦 Delivered in 5–7 business days</p>
                    <p>↩️ Easy 30-day returns</p>
                    <p>✓ 100% authentic guaranteed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}