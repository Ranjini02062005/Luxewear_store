import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';

export default function Checkout() {
  const { cart, cartTotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total = cartTotal + shipping;

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.phone.length !== 10) return setError('Please enter a valid 10-digit mobile number');
    if (form.pincode.length !== 6) return setError('Please enter a valid 6-digit pincode');
    setLoading(true);
    const fullAddress = `${form.name}, ${form.phone}\n${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
    try {
      await placeOrder(fullAddress);
      await refreshCart();
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2800);
    } catch (err) {
      setError(err.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-fadeUp" style={{ background: '#fff', padding: '3rem 3.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
        <div style={{
          width: '76px', height: '76px', borderRadius: '50%',
          background: 'linear-gradient(135deg,#ff6b00,#ff905a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '2rem', color: '#fff',
          boxShadow: '0 4px 20px rgba(255,107,0,0.35)'
        }}>✓</div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#1c1c1c', marginBottom: '0.5rem', fontWeight: 700 }}>
          Order Placed!
        </h3>
        <p style={{ color: '#696b79', fontSize: '0.88rem' }}>Redirecting to your orders...</p>
        <div style={{ marginTop: '1.5rem', width: '200px', height: '3px', background: '#f5f5f6', borderRadius: '2px', margin: '1.5rem auto 0', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#ff6b00,#ff905a)', borderRadius: '2px', animation: 'shimmer 2.8s linear forwards', backgroundSize: '400px 100%' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f5f5f6', minHeight: '100vh', padding: '1.5rem 0 3rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#1c1c1c', marginBottom: '1.5rem', fontWeight: 700 }}>
          Checkout
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem', alignItems: 'start' }}>

          {/* Delivery Form */}
          <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: '8px', padding: '2rem', opacity: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#696b79', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eaeaec' }}>
              Delivery Address
            </h5>

            {error && (
              <div className="animate-slideDown" style={{ background: '#fff4ec', border: '1px solid #ffd4a8', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.83rem', color: '#cc5500', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1: Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Full Name *</label>
                  <input type="text" className="input-field" required value={form.name}
                    onChange={e => handleChange('name', e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Mobile Number *</label>
                  <input type="tel" className="input-field" required value={form.phone}
                    onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile" maxLength={10} />
                </div>
              </div>

              {/* Row 2: Address */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Address *</label>
                <textarea className="input-field" required rows={3} value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder="House no, Building, Street, Area, Landmark"
                  style={{ resize: 'none', lineHeight: 1.6 }} />
              </div>

              {/* Row 3: City + State + Pincode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>City *</label>
                  <input type="text" className="input-field" required value={form.city}
                    onChange={e => handleChange('city', e.target.value)} placeholder="City" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>State *</label>
                  <input type="text" className="input-field" required value={form.state}
                    onChange={e => handleChange('state', e.target.value)} placeholder="State" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#696b79', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Pincode *</label>
                  <input type="text" className="input-field" required value={form.pincode}
                    onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit" maxLength={6} />
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ background: '#fff4ec', border: '1px solid #ffd4a8', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cc5500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Payment Method</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #ff6b00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff6b00' }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#1c1c1c', fontWeight: 500 }}>💵 Cash on Delivery</span>
                </div>
              </div>

              <button type="submit" disabled={loading || cart.length === 0}
                className="btn-orange"
                style={{ width: '100%', borderRadius: '4px', fontSize: '0.92rem', padding: '0.9rem' }}>
                {loading ? 'PLACING ORDER...' : `PLACE ORDER  ·  ₹${total.toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', opacity: 0, animationDelay: '0.1s', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#696b79', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eaeaec' }}>
                Order Summary ({cart.length})
              </h5>

              <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.9rem', alignItems: 'center' }}>
                    <img src={item.image_url} alt={item.name}
                      onError={e => { e.target.src = `https://picsum.photos/seed/${item.product_id}/80/107`; }}
                      style={{ width: '52px', height: '70px', objectFit: 'cover', borderRadius: '4px', background: '#f5f5f6', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1c1c1c', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#696b79', margin: '2px 0 0' }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1c1c1c', flexShrink: 0 }}>
                      ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #eaeaec', paddingTop: '0.75rem' }}>
                {[
                  { label: 'Total MRP', value: `₹${cartTotal.toLocaleString('en-IN')}`, green: false },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}`, green: shipping === 0 },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '6px' }}>
                    <span style={{ color: '#696b79' }}>{row.label}</span>
                    <span style={{ fontWeight: 600, color: row.green ? '#14958f' : '#1c1c1c' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#1c1c1c', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eaeaec' }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#ff6b00' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}