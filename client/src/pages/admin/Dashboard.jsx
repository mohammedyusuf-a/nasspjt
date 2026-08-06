import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statConfigs = [
  { key: 'totalUsers', icon: '👥', label: 'Total Users', color: 'rgba(124,58,237,0.15)' },
  { key: 'totalProducts', icon: '📦', label: 'Products', color: 'rgba(79,70,229,0.15)' },
  { key: 'totalOrders', icon: '🛒', label: 'Total Orders', color: 'rgba(6,182,212,0.15)' },
  { key: 'totalRevenue', icon: '💰', label: 'Revenue', color: 'rgba(16,185,129,0.15)', currency: true },
  { key: 'pending', icon: '⏳', label: 'Pending Orders', color: 'rgba(245,158,11,0.12)' },
  { key: 'delivered', icon: '✅', label: 'Delivered', color: 'rgba(16,185,129,0.12)' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/orders/stats'),
      axios.get('/api/users/stats'),
      axios.get('/api/products'),
      axios.get('/api/orders')
    ]).then(([orderStats, userStats, products, allOrders]) => {
      setStats({
        totalUsers: userStats.data.total,
        totalProducts: products.data.length,
        totalOrders: orderStats.data.totalOrders,
        totalRevenue: orderStats.data.totalRevenue,
        pending: orderStats.data.pending,
        delivered: orderStats.data.delivered,
      });
      setOrders(allOrders.data.slice(0, 8));
    }).catch((err) => {
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    }).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const STATUS_COLORS = { Processing: 'badge-yellow', Confirmed: 'badge-blue', Shipped: 'badge-cyan', Delivered: 'badge-green', Cancelled: 'badge-red' };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1rem' }}>
      <div style={{ fontSize: '2.5rem' }}>⚠️</div>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-100)' }}>Dashboard Error</div>
      <div style={{ color: 'var(--text-400)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 400 }}>{error}</div>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>🔄 Retry</button>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>Welcome back, Admin! Here's what's happening.</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary" id="dashboard-add-product-btn">+ Add Product</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statConfigs.map(({ key, icon, label, color, currency }) => (
          <div key={key} className="stat-card" style={{ '--stat-color': color }}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-value">
              {currency ? `₹${(stats[key] || 0).toLocaleString()}` : (stats[key] || 0).toLocaleString()}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { to: '/admin/products', icon: '📦', title: 'Manage Products', desc: 'Add, edit, delete products' },
          { to: '/admin/orders', icon: '🛒', title: 'View Orders', desc: 'Track and update orders' },
          { to: '/admin/users', icon: '👥', title: 'Manage Users', desc: 'View and remove users' },
          { to: '/admin/products/add', icon: '➕', title: 'Add Product', desc: 'List a new product' },
        ].map((q) => (
          <Link key={q.to} to={q.to} className="glass glass-hover" style={{ padding: '1.25rem', display: 'block', textDecoration: 'none' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{q.icon}</div>
            <div style={{ fontWeight: 700, color: 'var(--text-100)', fontSize: '0.95rem' }}>{q.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-400)', marginTop: '4px' }}>{q.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="page-header" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: '#a78bfa' }}>View all →</Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>#{o._id.slice(-8).toUpperCase()}</span></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.user?.name || 'N/A'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>{o.user?.email}</div>
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td><strong>₹{o.totalAmount.toLocaleString()}</strong></td>
                  <td><span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{o.paymentStatus}</span></td>
                  <td><span className={`badge ${STATUS_COLORS[o.orderStatus] || 'badge-blue'}`}>{o.orderStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
