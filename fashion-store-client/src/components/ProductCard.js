import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isWished } = useWishlist();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishAnim, setWishAnim] = useState(false);

  const wished = isWished(product.id);
  const discount = ((product.id * 7) % 30) + 10;
  const original = Math.round(product.price * (100 / (100 - discount)));

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/login');
    setAdding(true);
    await addItem(product.id);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setWishAnim(true);
    setTimeout(() => setWishAnim(false), 400);
  };

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.5); }
          70%  { transform: scale(0.88); }
          100% { transform: scale(1); }
        }
        .heart-pop { animation: heartPop 0.4s ease forwards; }

        .pc-side-card {
          display: flex;
          gap: 0;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }
        .pc-side-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.13);
        }

        .pc-img-wrap {
          position: relative;
          width: 44%;
          flex-shrink: 0;
          background: #f5f5f6;
          overflow: hidden;
        }
        .pc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pc-side-card:hover .pc-img-wrap img {
          transform: scale(1.06);
        }

        .pc-info {
          flex: 1;
          padding: 12px 12px 12px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .pc-add-btn {
          margin-top: 8px;
          width: 100%;
          background: #ff6b00;
          color: #fff;
          border: none;
          padding: 8px 6px;
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          transition: background 0.2s ease;
        }
        .pc-add-btn:hover { background: #e65c00; }
        .pc-add-btn:disabled { background: #ccc; cursor: not-allowed; }
        .pc-add-btn.added { background: #14958f; }

        .pc-buy-btn {
          margin-top: 5px;
          width: 100%;
          background: #fff;
          color: #ff6b00;
          border: 1.5px solid #ff6b00;
          padding: 7px 6px;
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .pc-buy-btn:hover {
          background: #ff6b00;
          color: #fff;
        }

        @media (max-width: 480px) {
          .pc-side-card { flex-direction: column; }
          .pc-img-wrap { width: 100%; height: 180px; }
          .pc-info { padding: 10px; }
        }
      `}</style>

      <div
        className="pc-side-card"
        style={{ animationDelay: `${Math.min(index, 7) * 0.07}s` }}>

        {/* ── LEFT: Image ── */}
        <Link to={`/product/${product.id}`} className="pc-img-wrap" style={{ textDecoration: 'none' }}>

          {/* Skeleton */}
          {!imgLoaded && (
            <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
          )}

          <img
            src={product.image_url}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            onError={e => {
              e.target.src = `https://picsum.photos/seed/${product.id}/300/400`;
              setImgLoaded(true);
            }}
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />

          {/* Discount badge */}
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: '#14958f', color: '#fff',
            fontSize: '0.6rem', fontWeight: 700,
            padding: '3px 7px', borderRadius: '4px',
            letterSpacing: '0.3px'
          }}>
            {discount}% OFF
          </span>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.38)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{
                background: 'rgba(255,255,255,0.9)',
                color: '#1c1c1c', fontSize: '0.65rem',
                fontWeight: 700, padding: '4px 10px',
                borderRadius: '3px', letterSpacing: '0.5px'
              }}>OUT OF STOCK</span>
            </div>
          )}

          {/* Wishlist heart */}
          <button
            onClick={handleWish}
            className={wishAnim ? 'heart-pop' : ''}
            title={wished ? 'Remove from wishlist' : 'Save to wishlist'}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: wished ? '#fff4ec' : '#fff',
              border: `1.5px solid ${wished ? '#ff6b00' : '#ddd'}`,
              borderRadius: '50%',
              width: 30, height: 30,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 5px rgba(0,0,0,0.12)',
              transition: 'all 0.2s', zIndex: 2,
              padding: 0
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24"
              fill={wished ? '#ff6b00' : 'none'}
              stroke={wished ? '#ff6b00' : '#888'}
              strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </Link>

        {/* ── RIGHT: Info ── */}
        <div className="pc-info">

          <div>
            {/* Brand */}
            <p style={{
              fontSize: '0.65rem', fontWeight: 700,
              color: '#ff6b00', margin: '0 0 3px',
              letterSpacing: '0.5px'
            }}>LUXEWEAR</p>

            {/* Product name */}
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
              <p style={{
                fontSize: '0.82rem', color: '#1c1c1c',
                fontWeight: 600, margin: '0 0 3px',
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.name}
              </p>
            </Link>

            {/* Subtitle */}
            <p style={{
              fontSize: '0.62rem', color: '#999',
              margin: '0 0 7px', letterSpacing: '0.2px'
            }}>
              Premium Quality • Trending Style
            </p>

            {/* Price row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1c1c1c' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span style={{
                fontSize: '0.72rem', color: '#aaa',
                textDecoration: 'line-through'
              }}>
                ₹{Number(original).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Discount % */}
            <p style={{
              fontSize: '0.65rem', fontWeight: 600,
              color: '#14958f', margin: '2px 0 0'
            }}>
              ({discount}% OFF)
            </p>

            {/* Low stock warning */}
            {product.stock > 0 && product.stock < 5 && (
              <p style={{
                fontSize: '0.62rem', color: '#ff6b00',
                fontWeight: 600, margin: '4px 0 0'
              }}>
                ⚡ Only {product.stock} left!
              </p>
            )}
          </div>

          {/* Buttons */}
          {product.stock > 0 ? (
            <div>
              <button
                className={`pc-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={adding}>
                {adding ? 'ADDING...' : added ? '✓ ADDED TO BAG' : 'ADD TO BAG'}
              </button>
              <button
                className="pc-buy-btn"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!user) return navigate('/login');
                  await addItem(product.id, 1);
                  navigate('/checkout');
                }}>
                ⚡ BUY NOW
              </button>
            </div>
          ) : (
            <button className="pc-add-btn" disabled style={{ background: '#ddd', color: '#888' }}>
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </>
  );
}
