import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId = state?.orderId;

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-300)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          🎉 Thank you for shopping with ShopEZ! Your order has been successfully placed and is being processed.
        </p>

        {orderId && (
          <div style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 'var(--r-sm)',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.88rem',
            color: '#c4b5fd'
          }}>
            Order ID: <strong>#{orderId.slice(-12).toUpperCase()}</strong>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { icon: '📧', text: "You'll receive an email confirmation shortly" },
            { icon: '🚚', text: "Your order will be shipped within 1-2 business days" },
            { icon: '📦', text: "Track your order in My Profile → Order History" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-300)' }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/profile" className="btn btn-secondary" style={{ flex: 1 }} id="view-orders-btn">
            📦 View My Orders
          </Link>
          <Link to="/products" className="btn btn-primary" style={{ flex: 1 }} id="continue-shopping-success-btn">
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
