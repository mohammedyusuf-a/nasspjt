import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { handleImageError } from '../utils/imageFallback';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  const items = cart.items || [];
  const deliveryCharge = cartTotal >= 2999 ? 0 : 99;
  const finalTotal = cartTotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state" style={{ minHeight: '60vh' }}>
            <div className="empty-icon">🛒</div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-desc">Looks like you haven't added anything to your cart yet. Start shopping!</div>
            <Link to="/products" className="btn btn-primary btn-lg" id="cart-empty-shop-btn">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            Shopping <span className="text-gradient-primary">Cart</span>
          </h1>
          <p style={{ color: 'var(--text-400)', marginTop: '4px' }}>{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => {
              const p = item.product;
              if (!p) return null;
              const price = p.discount ? +(p.price * (1 - p.discount / 100)).toFixed(2) : p.price;
              const subtotal = price * item.quantity;
              return (
                <div key={item._id} className="cart-item">
                  <img src={p.image} alt={p.name} className="cart-item-img" onError={handleImageError} />
                  <div className="cart-item-info">
                    <div className="cart-item-category">{p.category}</div>
                    <div className="cart-item-name">{p.name}</div>
                    <div className="cart-item-price">₹{price.toLocaleString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity - 1)}>−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                      </div>
                      <span style={{ color: 'var(--text-400)', fontSize: '0.85rem' }}>
                        Subtotal: <strong style={{ color: 'var(--text-100)' }}>₹{subtotal.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ alignSelf: 'flex-start', flexShrink: 0 }}
                    onClick={() => removeItem(item._id)}
                    title="Remove item"
                    id={`remove-cart-item-${item._id}`}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <span className="summary-value">₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span className="summary-value" style={{ color: deliveryCharge === 0 ? '#6ee7b7' : 'inherit' }}>
                {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge.toLocaleString()}`}
              </span>
            </div>
            {deliveryCharge > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-400)', marginTop: '-0.25rem' }}>
                Add ₹{(2999 - cartTotal).toLocaleString()} more for free delivery
              </p>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span className="summary-value">₹{finalTotal.toLocaleString()}</span>
            </div>
            <button
              id="proceed-to-checkout-btn"
              className="btn btn-primary btn-full"
              style={{ marginTop: '1.25rem', padding: '0.8rem' }}
              onClick={() => navigate('/checkout', { state: { cartTotal, deliveryCharge, finalTotal } })}
            >
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-secondary btn-full" style={{ marginTop: '0.75rem' }} id="continue-shopping-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
