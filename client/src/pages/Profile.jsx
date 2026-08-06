import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

const STATUS_COLORS = {
  Processing: 'badge-yellow',
  Confirmed: 'badge-blue',
  Shipped: 'badge-cyan',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
};

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('/api/orders/my')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-lg">{initials}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">📧 {user?.email}</div>
            <div className="profile-role">
              <span className={`badge ${user?.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
                {user?.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Outfit',sans-serif", color: 'var(--text-100)' }}>{orders.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Orders</div>
          </div>
        </div>

        {/* Orders */}
        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.3rem' }}>Order History</h2>

        {loading ? (
          <div className="loader-wrapper"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No orders yet</div>
            <div className="empty-desc">You haven't placed any orders. Start shopping to see your orders here!</div>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                <div>
                  <div className="order-id">#{order._id.slice(-10).toUpperCase()}</div>
                  <div className="order-date">{formatDate(order.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-blue'}`}>{order.orderStatus}</span>
                  <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{order.paymentStatus}</span>
                  <div className="order-total">₹{order.totalAmount.toLocaleString()}</div>
                  <span style={{ color: 'var(--text-400)', fontSize: '0.8rem' }}>{expanded === order._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === order._id && (
                <div className="order-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Shipping Address</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-300)', lineHeight: 1.7 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-100)' }}>{order.shippingAddress?.fullName}</div>
                        <div>{order.shippingAddress?.addressLine1}</div>
                        {order.shippingAddress?.addressLine2 && <div>{order.shippingAddress.addressLine2}</div>}
                        <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</div>
                        <div>📞 {order.shippingAddress?.phone}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Payment</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-300)' }}>
                        <div>{order.paymentMethod}</div>
                        <div style={{ marginTop: '4px' }}>Delivery: ₹{order.deliveryCharge || 0}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Items Ordered</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {item.image && <img src={item.image} alt={item.name} onError={handleImageError} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--r-xs)', border: '1px solid var(--glass-border)' }} />}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-100)' }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Qty: {item.quantity} × ₹{item.price}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-100)' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
