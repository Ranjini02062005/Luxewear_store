import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stockOnly, setStockOnly] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  const filtered = stockOnly ? wishlist.filter(p => p.stock > 0) : wishlist;

  const handleAddToCart = async (product) => {
    if (!user) return navigate('/login');
    await addItem(product.id, 1);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 2000);
  };

  const handleBuyNow = async (product) => {
    if (!user) return navigate('/login');
    await addItem(product.id, 1);
    navigate('/checkout');
  };

  return (
    <>
      <style>{`
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 10px;
        }
        @media (min-width: 640px) {
          .wl-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 12px; }
        }
        @media (min-width: 1024px) {
          .wl-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; padding: 16px; }
        }
        .wl-card {
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 1px 6px rgba(0,0,0,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .wl-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 18px rgba(0,0,0,0.12);
        }
        .wl-card-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .wl-card:hover .wl-card-actions {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .wl-card-actions { opacity: 1 !important; }
        }
        @keyframes heartBeat {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.35); }
          60%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .heart-beat { animation: heartBeat 0.35s ease forwards; }
      `}</style>

      <div style={{ background: '#f5f5f6', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #eaeaec', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', height: '56px', gap: '1rem' }}>
            <button onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#1c1c1c', display: 'flex', alignItems: 'center', padding: '4px' }}>
              ←
            </button>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#1c1c1c', margin: 0, flex: 1, letterSpacing: '0.5px' }}>
              MY WISHLIST
              {wishlist.length > 0 && (
                <span style={{ fontSize: '0.78rem', color: '#696b79', fontWeight: 400, marginLeft: '6px' }}>
                  ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </h1>
            {wishlist.length > 0 && (
              <button onClick={clearWishlist}
                style={{ background: 'none', border: '1px solid #eaeaec', borderRadius: '4px', padding: '5px 10px', fontSize: '0.72rem', fontWeight: 600, color: '#696b79', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6b00'; e.currentTarget.style.color = '#ff6b00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaeaec'; e.currentTarget.style.color = '#696b79'; }}>
                CLEAR ALL
              </button>
            )}
          </div>

          {/* Tabs row */}
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '0', borderTop: '1px solid #f5f5f6' }}>
            {['Wishlist', 'Shared', 'Viewed'].map((tab, i) => (
              <button key={tab}
                style={{
                  padding: '0.6rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 700,
                  color: i === 0 ? '#ff6b00' : '#696b79',
                  borderBottom: i === 0 ? '2.5px solid #ff6b00' : '2.5px solid transparent',
                  transition: 'all 0.2s'
                }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stock filter toggle */}
        {wishlist.length > 0 && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 1rem', background: '#fff', borderBottom: '1px solid #eaeaec', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: '#1c1c1c', fontWeight: 500 }}>
              Show in stock products only
            </span>
            <div
              onClick={() => setStockOnly(s => !s)}
              style={{
                width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                background: stockOnly ? '#ff6b00' : '#ccc',
                position: 'relative', transition: 'background 0.25s ease'
              }}>
              <div style={{
                position: 'absolute', top: '3px',
                left: stockOnly ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {wishlist.length === 0 && (
          <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤍</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1c1c1c', marginBottom: '0.5rem' }}>
              Your wishlist is empty
            </h3>
            <p style={{ color: '#696b79', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Tap the heart on any product to save it here
            </p>
            <button onClick={() => navigate('/')} className="btn-orange" style={{ borderRadius: '4px', padding: '0.75rem 2rem' }}>
              EXPLORE PRODUCTS
            </button>
          </div>
        )}

        {/* Wishlist grid */}
        {filtered.length > 0 && (
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="wl-grid">
              {filtered.map((product, idx) => (
                <WishlistCard
                  key={product.id}
                  product={product}
                  index={idx}
                  onRemove={() => removeFromWishlist(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  onBuyNow={() => handleBuyNow(product)}
                  isAdded={addedIds.includes(product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stock-filtered empty */}
        {wishlist.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📦</p>
            <p style={{ color: '#696b79', fontSize: '0.88rem' }}>
              No in-stock items in your wishlist right now
            </p>
            <button onClick={() => setStockOnly(false)}
              style={{ marginTop: '1rem', background: 'none', border: '1px solid #ff6b00', color: '#ff6b00', padding: '0.5rem 1.25rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}>
              SHOW ALL
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function WishlistCard({ product, index, onRemove, onAddToCart, onBuyNow, isAdded }) {
  const [heartAnim, setHeartAnim] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const discount = ((product.id * 7) % 30) + 10;
  const original = Math.round(product.price * (100 / (100 - discount)));
  const outOfStock = product.stock === 0;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnim(true);
    setTimeout(() => { onRemove(); }, 200);
  };

  return (
    <div className="wl-card" style={{ animation: `fadeUp 0.4s ease forwards ${Math.min(index, 7) * 0.05}s`, opacity: 0 }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>

        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '120%', background: '#f0ede8', overflow: 'hidden' }}>
          {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
          <img
            src={product.image_url}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/300/360`; setImgLoaded(true); }}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.3s, transform 0.4s',
              filter: outOfStock ? 'brightness(0.65)' : 'none'
            }}
          />

          {/* Out of stock overlay */}
          {outOfStock && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{
                background: 'rgba(255,255,255,0.92)', color: '#1c1c1c',
                fontSize: '0.75rem', fontWeight: 700, padding: '6px 14px',
                borderRadius: '2px', letterSpacing: '0.5px', textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>OUT OF STOCK</span>
            </div>
          )}

          {/* Red heart — always visible, filled */}
          <button
            onClick={handleRemove}
            className={heartAnim ? 'heart-beat' : ''}
            title="Remove from wishlist"
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: '#fff', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 6px rgba(0,0,0,0.15)', zIndex: 2,
              transition: 'transform 0.2s'
            }}>
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill="#ff3f6c" stroke="#ff3f6c" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Discount badge */}
          {!outOfStock && (
            <span style={{
              position: 'absolute', top: '8px', left: '8px',
              background: '#14958f', color: '#fff',
              fontSize: '0.6rem', fontWeight: 700,
              padding: '2px 7px', borderRadius: '2px', zIndex: 1
            }}>{discount}% OFF</span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '0.55rem 0.6rem 0.4rem' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ff6b00', margin: '0 0 2px', letterSpacing: '0.3px' }}>
            LUXEWEAR
          </p>
          <p style={{ fontSize: '0.78rem', color: '#1c1c1c', fontWeight: 500, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
            {product.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1c1c1c' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#696b79', textDecoration: 'line-through' }}>
              ₹{Number(original).toLocaleString('en-IN')}
            </span>
          </div>
          <p style={{ fontSize: '0.68rem', color: '#14958f', fontWeight: 600, margin: 0 }}>
            ({discount}% OFF)
          </p>
        </div>
      </Link>

      {/* Action buttons */}
      {!outOfStock && (
        <div className="wl-card-actions" style={{ padding: '0 0.6rem 0.6rem', display: 'flex', gap: '6px' }}>
          <button
            onClick={e => { e.preventDefault(); onAddToCart(); }}
            style={{
              flex: 1, padding: '7px 4px', border: '1.5px solid #ff6b00',
              borderRadius: '3px', background: isAdded ? '#ff6b00' : '#fff',
              color: isAdded ? '#fff' : '#ff6b00',
              fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.3px', textTransform: 'uppercase',
              transition: 'all 0.2s'
            }}>
            {isAdded ? '✓ ADDED' : 'ADD TO BAG'}
          </button>
          <button
            onClick={e => { e.preventDefault(); onBuyNow(); }}
            style={{
              flex: 1, padding: '7px 4px', border: 'none',
              borderRadius: '3px', background: '#ff6b00',
              color: '#fff', fontSize: '0.65rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.3px',
              textTransform: 'uppercase', transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#cc5500'}
            onMouseLeave={e => e.currentTarget.style.background = '#ff6b00'}>
            BUY NOW
          </button>
        </div>
      )}
    </div>
  );
}