import { useEffect, useState } from 'react';
import axios from 'axios';
import { handleImageError } from '../../utils/imageFallback';

const STATUS_COLORS = {
  Processing: 'badge-yellow',
  Confirmed: 'badge-blue',
  Shipped: 'badge-cyan',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
};

const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed'];

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    axios.get('/api/orders')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, field, value) => {
    setUpdating(orderId);
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/status`, { [field]: value });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, ...data } : o));
    } catch { alert('Failed to update status.'); }
    finally { setUpdating(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const filtered = orders.filter(o =>
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;
  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1rem' }}>
      <div style={{ fontSize: '2.5rem' }}>⚠️</div>
      <div style={{ fontWeight: 700, color: 'var(--text-100)' }}>Failed to load orders</div>
      <div style={{ color: 'var(--text-400)', fontSize: '0.9rem' }}>{error}</div>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>🔄 Retry</button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>All Orders</h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>{orders.length} total orders</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input
          id="admin-order-search"
          type="text"
          className="form-input"
          placeholder="🔍 Search by order ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 380 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <div>
                <div className="order-id">#{order._id.slice(-10).toUpperCase()}</div>
                <div className="order-date">{order.user?.name} · {formatDate(order.createdAt)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-blue'}`}>{order.orderStatus}</span>
                <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-green' : order.paymentStatus === 'Failed' ? 'badge-red' : 'badge-yellow'}`}>
                  {order.paymentStatus}
                </span>
                <div className="order-total">₹{order.totalAmount.toLocaleString()}</div>
                <span style={{ color: 'var(--text-400)', fontSize: '0.8rem' }}>{expanded === order._id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === order._id && (
              <div className="order-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {/* Customer */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Customer</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-200)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-100)' }}>{order.user?.name}</div>
                      <div>{order.user?.email}</div>
                    </div>
                  </div>
                  {/* Address */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Shipping</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-300)', lineHeight: 1.6 }}>
                      <div>{order.shippingAddress?.fullName}</div>
                      <div>{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                      <div>📞 {order.shippingAddress?.phone}</div>
                    </div>
                  </div>
                  {/* Payment */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Payment</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-300)' }}>
                      <div>{order.paymentMethod}</div>
                      <div>Total: ₹{order.totalAmount}</div>
                    </div>
                  </div>
                </div>

                {/* Status Controls */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-sm)', marginBottom: '1.25rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-400)', fontWeight: 600 }}>Update Status:</div>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, 'orderStatus', e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', minWidth: 150 }}
                    disabled={updating === order._id}
                    id={`order-status-${order._id}`}
                  >
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', minWidth: 130 }}
                    disabled={updating === order._id}
                    id={`payment-status-${order._id}`}
                  >
                    {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {updating === order._id && <span style={{ fontSize: '0.8rem', color: '#a78bfa' }}>⏳ Saving...</span>}
                </div>

                {/* Items */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Items ({order.items.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {item.image && <img src={item.image} alt={item.name} onError={handleImageError} style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 'var(--r-xs)', border: '1px solid var(--glass-border)' }} />}
                      <div style={{ flex: 1, fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-100)' }}>{item.name}</div>
                        <div style={{ color: 'var(--text-400)' }}>×{item.quantity} @ ₹{item.price}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-100)', fontSize: '0.88rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <div className="empty-title">No orders found</div>
          </div>
        )}
      </div>
    </div>
  );
}
