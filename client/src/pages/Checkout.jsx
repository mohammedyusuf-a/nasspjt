import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const paymentOptions = [
  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { value: 'Card', label: 'Credit / Debit Card', icon: '💳' },
  { value: 'UPI', label: 'UPI Payment', icon: '📱' },
  { value: 'NetBanking', label: 'Net Banking', icon: '🏦' },
];

import { handleImageError } from '../utils/imageFallback';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { deliveryCharge = 49, finalTotal } = location.state || {};

  const [addr, setAddr] = useState({ fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setAddr(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Guard: ensure the user is still authenticated before placing the order
    const token = localStorage.getItem('shopez_token');
    if (!token || !user) {
      navigate(`/login?redirect=${encodeURIComponent('/checkout')}`, { state: { from: location } });
      return;
    }

    const items = cart.items
      ?.filter(i => i && i.product)
      .map(i => {
        const p = i.product;
        const productId = typeof p === 'object' ? p._id : p;
        const price = typeof p === 'object' && p.discount ? +(p.price * (1 - p.discount / 100)).toFixed(2) : (p?.price || 0);
        return {
          product: productId,
          name: p?.name || 'Product',
          image: p?.image || '',
          price: price,
          quantity: i.quantity || 1
        };
      });

    if (!items || items.length === 0) { setError('Your cart is empty.'); return; }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/orders', {
        items,
        shippingAddress: addr,
        paymentMethod,
        totalAmount: finalTotal || cartTotal,
        deliveryCharge
      }, {
        // Explicitly pass the token as a safety net so the order never
        // fails due to a missing Authorization header.
        headers: { Authorization: `Bearer ${token}` }
      });
      await clearCart();
      navigate('/order-success', { state: { orderId: data._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = finalTotal || cartTotal + deliveryCharge;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            Secure <span className="text-gradient-primary">Checkout</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} id="checkout-form">
          <div className="checkout-layout">
            <div className="checkout-section">
              {/* Shipping Address */}
              <div className="checkout-card">
                <div className="checkout-card-header">📦 Shipping Address</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="fullName" className="form-input" placeholder="John Doe" value={addr.fullName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input name="phone" className="form-input" placeholder="10-digit mobile number" value={addr.phone} onChange={handleChange} required pattern="[0-9]{10}" title="10-digit phone number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address Line 1 *</label>
                    <input name="addressLine1" className="form-input" placeholder="House / Flat no., Street" value={addr.addressLine1} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address Line 2</label>
                    <input name="addressLine2" className="form-input" placeholder="Area, Locality (optional)" value={addr.addressLine2} onChange={handleChange} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input name="city" className="form-input" placeholder="City" value={addr.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input name="state" className="form-input" placeholder="State" value={addr.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input name="pincode" className="form-input" placeholder="6-digit PIN" value={addr.pincode} onChange={handleChange} required pattern="[0-9]{6}" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="checkout-card">
                <div className="checkout-card-header">💳 Payment Method</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {paymentOptions.map((opt) => (
                    <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                      />
                      <span className="payment-option-icon">{opt.icon}</span>
                      <span className="payment-option-label">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="cart-summary" style={{ position: 'sticky', top: '90px' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>Order Summary</h3>

              <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.items?.map((item) => {
                  const p = item.product;
                  if (!p) return null;
                  const price = p.discount ? +(p.price * (1 - p.discount / 100)).toFixed(2) : p.price;
                  return (
                    <div key={item._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <img src={p.image} alt={p.name} onError={handleImageError} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--r-xs)' }} />
                      <div style={{ flex: 1, fontSize: '0.82rem' }}>
                        <div style={{ color: 'var(--text-200)', fontWeight: 500, lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ color: 'var(--text-400)' }}>×{item.quantity}</div>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-100)', whiteSpace: 'nowrap' }}>
                        ₹{(price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="summary-row">
                <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span style={{ color: deliveryCharge === 0 ? '#6ee7b7' : 'inherit' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toLocaleString()}`}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="summary-value">₹{total.toLocaleString()}</span>
              </div>

              {error && <div className="alert-error" style={{ marginTop: '1rem' }}><span>⚠️</span> {error}</div>}

              <button
                id="place-order-btn"
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: '1.25rem', padding: '0.85rem' }}
                disabled={loading}
              >
                {loading ? '⏳ Placing Order...' : `🎉 Place Order · ₹${total.toLocaleString()}`}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-400)', textAlign: 'center', marginTop: '0.75rem' }}>
                🔒 Your payment info is secure and encrypted
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
