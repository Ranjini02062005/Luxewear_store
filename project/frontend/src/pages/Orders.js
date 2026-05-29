import { useEffect as useEffectO, useState as useStateO } from 'react';
import { Link as LinkO, useNavigate as useNavO } from 'react-router-dom';
import { getOrders } from '../services/api';
import { useAuth as useAuthO } from '../context/AuthContext';
 
const STATUS = {
  pending:    { bg: '#fff8e6', color: '#b8860b', label: 'Pending' },
  processing: { bg: '#e8f0fe', color: '#1a73e8', label: 'Processing' },
  shipped:    { bg: '#e6f4ea', color: '#137333', label: 'Shipped' },
  delivered:  { bg: '#e6f4ea', color: '#137333', label: 'Delivered' },
};
 
export  default function Orders() {
  const [orders, setOrders] = useStateO([]);
  const [loading, setLoading] = useStateO(true);
  const { user } = useAuthO();
  const navigate = useNavO();
 
  useEffectO(() => {
    if (!user) return navigate('/login');
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, [user, navigate]);
 
  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #f5f5f6', borderTop: '3px solid #ff3f6c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
 
  return (
    <div style={{ background: '#f5f5f6', minHeight: '100vh', padding: '1.5rem 0 3rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#1c1c1c', marginBottom: '1.25rem' }}>My Orders</h2>
 
        {orders.length === 0 ? (
          <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: '4px', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h5 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#1c1c1c', marginBottom: '0.5rem' }}>No orders yet</h5>
            <p style={{ color: '#696b79', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Looks like you haven't ordered anything yet</p>
            <button className="btn-pink" onClick={() => navigate('/')}>START SHOPPING</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orders.map((order, idx) => {
              const sc = STATUS[order.status] || STATUS.pending;
              return (
                <div key={order.id} className="animate-fadeUp" style={{ background: '#fff', borderRadius: '4px', padding: '1.25rem', animationDelay: `${idx * 0.08}s`, opacity: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f5f5f6', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1c1c1c', margin: 0, fontSize: '0.88rem' }}>Order #{order.id}</p>
                      <p style={{ color: '#696b79', fontSize: '0.75rem', margin: '2px 0 0' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '3px 12px', borderRadius: '2px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {sc.label}
                      </span>
                      <span style={{ fontWeight: 700, color: '#1c1c1c', fontSize: '0.95rem' }}>₹{Number(order.total).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {order.items?.map(item => (
                      <LinkO key={item.id} to={`/product/${item.product_id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={item.image_url} alt={item.name} onError={e => { e.target.src = `https://picsum.photos/seed/${item.product_id}/100/133`; }}
                          style={{ width: '52px', height: '70px', objectFit: 'cover', borderRadius: '2px', background: '#f5f5f6' }} />
                        <div>
                          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1c1c1c', margin: 0, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                          <p style={{ fontSize: '0.72rem', color: '#696b79', margin: '2px 0 0' }}>Qty: {item.quantity}</p>
                        </div>
                      </LinkO>
                    ))}
                  </div>
                  {order.address && (
                    <p style={{ fontSize: '0.75rem', color: '#696b79', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f5f5f6', margin: '0.75rem 0 0' }}>
                      📍 {order.address.replace(/\n/g, ', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}