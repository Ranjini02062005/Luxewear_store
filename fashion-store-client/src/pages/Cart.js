import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateItem, removeItem, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  if (!user) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f6' }}>
      <div className="animate-fadeUp" style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛍️</div>
        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#1c1c1c', marginBottom: '0.5rem' }}>Please Login</h4>
        <p style={{ color: '#696b79', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Login to view your bag</p>
        <button className="btn-orange" onClick={() => navigate('/login')} style={{ borderRadius: '4px' }}>LOGIN</button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f6' }}>
      <div className="animate-fadeUp" style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '8px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
        <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#1c1c1c', marginBottom: '0.5rem' }}>Your bag is empty!</h4>
        <p style={{ color: '#696b79', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Add items to it now</p>
        <button className="btn-orange" onClick={() => navigate('/')} style={{ borderRadius: '4px' }}>SHOP NOW</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f5f5f6', minHeight: '100vh', padding: '1.5rem 0 3rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#1c1c1c', marginBottom: '1.25rem', fontWeight: 700 }}>
          My Bag
          <span style={{ fontSize: '1rem', fontFamily: 'DM Sans, sans-serif', color: '#696b79', fontWeight: 400, marginLeft: '8px' }}>
            ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', alignItems: 'start' }}>

          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cart.map((item, idx) => (
              <div key={item.id} className="animate-fadeUp" style={{
                background: '#fff', borderRadius: '8px', padding: '1.25rem',
                animationDelay: `${idx * 0.07}s`, opacity: 0,
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to={`/product/${item.product_id}`}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      onError={e => { e.target.src = `https://picsum.photos/seed/${item.product_id}/200/267`; }}
                      style={{ width: '90px', height: '120px', objectFit: 'cover', borderRadius: '6px', background: '#f5f5f6', flexShrink: 0 }}
                    />
                  </Link>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff6b00', letterSpacing: '0.5px', marginBottom: '3px', textTransform: 'uppercase' }}>LUXEWEAR</p>
                    <Link to={`/product/${item.product_id}`} style={{ textDecoration: 'none' }}>
                      <p style={{ fontSize: '0.9rem', color: '#1c1c1c', fontWeight: 500, marginBottom: '6px', lineHeight: 1.3 }}>{item.name}</p>
                    </Link>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c1c1c', marginBottom: '0.75rem' }}>
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#696b79', fontWeight: 600 }}>QTY:</span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaec', borderRadius: '4px', overflow: 'hidden' }}>
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          style={{ padding: '5px 13px', border: 'none', background: '#f5f5f6', cursor: 'pointer', fontWeight: 700, color: '#1c1c1c', fontSize: '1rem', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.target.style.background = '#fff4ec'}
                          onMouseLeave={e => e.target.style.background = '#f5f5f6'}>
                          −
                        </button>
                        <span style={{ padding: '5px 12px', borderLeft: '1px solid #eaeaec', borderRight: '1px solid #eaeaec', fontWeight: 700, fontSize: '0.85rem', minWidth: '38px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          style={{ padding: '5px 13px', border: 'none', background: '#f5f5f6', cursor: 'pointer', fontWeight: 700, color: '#1c1c1c', fontSize: '1rem', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.target.style.background = '#fff4ec'}
                          onMouseLeave={e => e.target.style.background = '#f5f5f6'}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal + Remove */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1c1c1c' }}>
                      ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#696b79', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: '4px', transition: 'color 0.2s', textTransform: 'uppercase', letterSpacing: '0.3px' }}
                      onMouseEnter={e => e.target.style.color = '#ff6b00'}
                      onMouseLeave={e => e.target.style.color = '#696b79'}>
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', opacity: 0, animationDelay: '0.1s', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#696b79', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eaeaec' }}>
                Price Details ({cart.length} Items)
              </h5>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#1c1c1c' }}>Total MRP</span>
                  <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#1c1c1c' }}>Discount on MRP</span>
                  <span style={{ fontWeight: 600, color: '#14958f' }}>−₹0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#1c1c1c' }}>Shipping Fee</span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? '#14958f' : '#1c1c1c' }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p style={{ fontSize: '0.72rem', color: '#ff6b00', background: '#fff4ec', padding: '7px 10px', borderRadius: '4px', margin: 0, fontWeight: 500 }}>
                    Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for FREE delivery!
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#1c1c1c', paddingTop: '0.75rem', borderTop: '1px solid #eaeaec', marginBottom: '1.25rem' }}>
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                className="btn-orange"
                style={{ width: '100%', borderRadius: '4px', fontSize: '0.9rem', padding: '0.85rem' }}
                onClick={() => navigate('/checkout')}>
                PLACE ORDER
              </button>

              <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '0.9rem', color: '#696b79', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#ff6b00'}
                onMouseLeave={e => e.target.style.color = '#696b79'}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}