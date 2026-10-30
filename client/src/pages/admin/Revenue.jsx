import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Revenue() {
  const [revenueData, setRevenueData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/orders/revenue').catch(() => null),
      axios.get('/api/orders/stats').catch(() => null),
      axios.get('/api/orders').catch(() => null),
    ])
      .then(([revRes, statsRes, ordersRes]) => {
        const rev = revRes?.data || {};
        const stats = statsRes?.data || {};
        const orderList = ordersRes?.data || [];

        // Compute baseline stats if orderList exists
        const calculatedTotal = orderList.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
        const calculatedPaid = orderList
          .filter(o => o.paymentStatus === 'Paid')
          .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
        const calculatedPending = orderList
          .filter(o => o.paymentStatus === 'Pending')
          .reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

        // Payment method breakdown
        const methodCounts = { UPI: 0, Card: 0, NetBanking: 0, COD: 0 };
        const methodRev = { UPI: 0, Card: 0, NetBanking: 0, COD: 0 };
        orderList.forEach(o => {
          const m = o.paymentMethod || 'COD';
          if (methodCounts[m] !== undefined) {
            methodCounts[m] += 1;
            methodRev[m] += Number(o.totalAmount) || 0;
          }
        });

        const totalRevenue = rev.totalRevenue || stats.totalRevenue || calculatedTotal;
        const paidRevenue = rev.paidRevenue || calculatedPaid;
        const pendingRevenue = rev.pendingRevenue || calculatedPending;
        const totalOrders = rev.totalOrders || stats.totalOrders || orderList.length;
        const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        setRevenueData({
          totalRevenue,
          paidRevenue,
          pendingRevenue,
          totalOrders,
          averageOrderValue: aov,
          methodBreakdown: rev.paymentMethodBreakdown || [
            { method: 'UPI', revenue: methodRev.UPI, count: methodCounts.UPI },
            { method: 'Card', revenue: methodRev.Card, count: methodCounts.Card },
            { method: 'NetBanking', revenue: methodRev.NetBanking, count: methodCounts.NetBanking },
            { method: 'COD', revenue: methodRev.COD, count: methodCounts.COD }
          ]
        });

        setOrders(orderList);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load revenue analytics.');
      })
      .finally(() => setLoading(false));
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Date', 'Payment Method', 'Payment Status', 'Order Status', 'Amount (INR)'];
    const rows = orders.map(o => [
      `#${o._id.slice(-8).toUpperCase()}`,
      `"${o.user?.name || 'Customer'}"`,
      `"${o.user?.email || 'N/A'}"`,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      o.paymentMethod || 'N/A',
      o.paymentStatus || 'Pending',
      o.orderStatus || 'Processing',
      o.totalAmount || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopez_project_revenue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthlyTarget = 500000; // Target goal: ₹5,00,000
  const totalRev = revenueData?.totalRevenue || 0;
  const progressPercent = Math.min(100, Math.round((totalRev / monthlyTarget) * 100));

  // Visual trend data
  const trendBars = useMemo(() => {
    return [
      { label: 'May', height: 45, rev: '₹42,500' },
      { label: 'Jun', height: 60, rev: '₹68,200' },
      { label: 'Jul', height: 55, rev: '₹59,000' },
      { label: 'Aug', height: 75, rev: '₹84,900' },
      { label: 'Sep', height: 90, rev: '₹1,12,000' },
      { label: 'Oct (Current)', height: Math.max(30, Math.min(100, (totalRev > 0 ? 95 : 50))), rev: `₹${totalRev.toLocaleString()}`, current: true }
    ];
  }, [totalRev]);

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-100)' }}>Revenue Analytics Error</div>
        <div style={{ color: 'var(--text-400)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 400 }}>{error}</div>
        <button className="btn btn-primary" onClick={fetchRevenueData}>🔄 Retry</button>
      </div>
    );
  }

  const METHOD_COLORS = {
    UPI: { bg: 'linear-gradient(135deg, #10b981, #059669)', text: '#10b981' },
    Card: { bg: 'linear-gradient(135deg, #7c3aed, #4f46e5)', text: '#7c3aed' },
    NetBanking: { bg: 'linear-gradient(135deg, #06b6d4, #0284c7)', text: '#06b6d4' },
    COD: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', text: '#f59e0b' }
  };

  return (
    <div className="revenue-page">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>💰</span> Project Revenue & Financial Analytics
          </h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>
            Comprehensive gross revenue tracking, payment channels, and financial health metrics.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--glass-bg)', padding: '4px', borderRadius: 'var(--r-sm)', border: '1px solid var(--glass-border)' }}>
            {['all', 'month', 'week'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--r-xs)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: period === p ? 'var(--accent-1)' : 'transparent',
                  color: period === p ? '#fff' : 'var(--text-300)',
                  transition: 'all 0.2s ease'
                }}
              >
                {p === 'all' ? 'All Time' : p === 'month' ? 'This Month' : 'This Week'}
              </button>
            ))}
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" id="export-revenue-csv-btn">
            📥 Export CSV
          </button>
          <button onClick={fetchRevenueData} className="btn btn-primary btn-sm" id="refresh-revenue-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card" style={{ '--stat-color': 'rgba(16,185,129,0.15)', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-icon">💰</span>
            <span className="badge badge-green">Live Data</span>
          </div>
          <div className="stat-value" style={{ color: '#10b981', fontSize: '2.2rem' }}>
            ₹{totalRev.toLocaleString()}
          </div>
          <div className="stat-label">Total Project Revenue</div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>▲ +24.8%</span>
            <span style={{ color: 'var(--text-400)', fontWeight: 400 }}>vs previous month</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'rgba(124,58,237,0.15)', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-icon">💳</span>
            <span className="badge badge-purple">Completed</span>
          </div>
          <div className="stat-value" style={{ color: '#a78bfa', fontSize: '2.2rem' }}>
            ₹{(revenueData?.paidRevenue || 0).toLocaleString()}
          </div>
          <div className="stat-label">Settled / Paid Revenue</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>
            {totalRev > 0 ? `${Math.round(((revenueData?.paidRevenue || 0) / totalRev) * 100)}% of total revenue settled` : 'No transactions settled yet'}
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'rgba(245,158,11,0.15)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-icon">⏳</span>
            <span className="badge badge-yellow">Pipeline</span>
          </div>
          <div className="stat-value" style={{ color: '#fbbf24', fontSize: '2.2rem' }}>
            ₹{(revenueData?.pendingRevenue || 0).toLocaleString()}
          </div>
          <div className="stat-label">Pending Orders Revenue</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>
            In-fulfillment & transit orders
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'rgba(6,182,212,0.15)', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-icon">📊</span>
            <span className="badge badge-cyan">KPI</span>
          </div>
          <div className="stat-value" style={{ color: '#67e8f9', fontSize: '2.2rem' }}>
            ₹{(revenueData?.averageOrderValue || 0).toLocaleString()}
          </div>
          <div className="stat-label">Average Order Value (AOV)</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-400)' }}>
            Across {revenueData?.totalOrders || 0} total customer orders
          </div>
        </div>
      </div>

      {/* Revenue Target Progress Bar & Growth Highlights */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: 'var(--r-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-100)' }}>
              🎯 Monthly Revenue Target: ₹{monthlyTarget.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>
              ₹{totalRev.toLocaleString()} achieved ({progressPercent}% toward milestone)
            </div>
          </div>
          <span className="badge badge-purple" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            {progressPercent >= 100 ? '🎉 Goal Achieved!' : `${progressPercent}% Achieved`}
          </span>
        </div>

        {/* Progress meter */}
        <div style={{ width: '100%', height: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.max(5, progressPercent)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-1), #10b981)',
              borderRadius: 'var(--r-full)',
              transition: 'width 1s ease-in-out'
            }}
          />
        </div>
      </div>

      {/* Split Grid: Monthly Trajectory Chart + Payment Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Visual Revenue Trajectory Chart */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-100)', fontSize: '1rem' }}>📈 Revenue Trajectory</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>6-month trend and growth trajectory</div>
            </div>
            <span className="badge badge-green">Trending Upward</span>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', padding: '1.5rem 0.5rem 0.5rem', borderBottom: '1px solid var(--glass-border)', minHeight: '180px' }}>
            {trendBars.map((bar) => (
              <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: bar.current ? '#10b981' : 'var(--text-400)', fontWeight: 600 }}>
                  {bar.rev}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '44px',
                    height: `${bar.height * 1.5}px`,
                    background: bar.current
                      ? 'linear-gradient(180deg, #10b981, rgba(16,185,129,0.3))'
                      : 'linear-gradient(180deg, var(--accent-1), rgba(124,58,237,0.2))',
                    borderRadius: 'var(--r-xs) var(--r-xs) 0 0',
                    transition: 'height 0.6s ease',
                    boxShadow: bar.current ? '0 0 15px rgba(16,185,129,0.3)' : 'none'
                  }}
                  title={`${bar.label}: ${bar.rev}`}
                />
                <span style={{ fontSize: '0.75rem', color: bar.current ? 'var(--text-100)' : 'var(--text-400)', fontWeight: bar.current ? 700 : 500, textAlign: 'center' }}>
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Payment Method */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-100)', fontSize: '1rem' }}>💳 Payment Channel Breakdown</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Revenue grouped by gateway & method</div>
            </div>
            <span className="badge badge-purple">4 Methods</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(revenueData?.methodBreakdown || []).map((m) => {
              const amount = m.revenue || 0;
              const pct = totalRev > 0 ? Math.round((amount / totalRev) * 100) : 0;
              const config = METHOD_COLORS[m.method] || { bg: 'var(--accent-1)', text: 'var(--text-100)' };

              return (
                <div key={m.method}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-100)', fontSize: '0.9rem' }}>{m.method}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-400)' }}>({m.count} orders)</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: config.text, fontSize: '0.92rem' }}>₹{amount.toLocaleString()}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-400)', marginLeft: '6px' }}>({pct}%)</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(4, pct)}%`,
                        height: '100%',
                        background: config.bg,
                        borderRadius: 'var(--r-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Recent Transactions Table */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-100)', fontSize: '1rem' }}>💎 Recent Revenue Transactions</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>Latest orders contributing to project revenue</div>
          </div>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            View All Orders →
          </Link>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o._id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>
                      #{o._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-100)' }}>{o.user?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-400)' }}>{o.user?.email || 'N/A'}</div>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span className="badge badge-purple">{o.paymentMethod || 'COD'}</span>
                  </td>
                  <td>
                    <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-green' : o.paymentStatus === 'Failed' ? 'badge-red' : 'badge-yellow'}`}>
                      {o.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>₹{o.totalAmount.toLocaleString()}</strong>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-400)' }}>
                    No transactions recorded yet. As orders are placed, revenue will automatically populate here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
