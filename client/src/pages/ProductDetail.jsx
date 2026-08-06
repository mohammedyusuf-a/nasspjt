import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

function StarRating({ rating }) {
  return (
    <span style={{ fontSize: '1.1rem' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}>★</span>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;
  if (!product) return null;

  const discountedPrice = product.discount
    ? +(product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product._id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch { setError('Failed to add to cart.'); }
    finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await addToCart(product._id, qty);
      navigate('/cart');
    } catch { setError('Failed. Try again.'); }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">›</span>
          <Link to="/products">Products</Link>
          <span className="sep">›</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="product-detail-layout">
          {/* Image */}
          <div>
            <div style={{ position: 'relative' }}>
              {product.discount > 0 && (
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>
                    -{product.discount}% OFF
                  </span>
                </div>
              )}
              <img src={product.image} alt={product.name} className="product-detail-img" onError={handleImageError} />
            </div>
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <span className="badge badge-purple">{product.category}</span>
            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <StarRating rating={product.rating || 4} />
              <span style={{ color: 'var(--text-300)', fontSize: '0.85rem' }}>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div>
              <div className="product-detail-price">₹{discountedPrice.toLocaleString()}</div>
              {product.discount > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ color: 'var(--text-400)', textDecoration: 'line-through', fontSize: '1rem' }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="badge badge-green">You save ₹{(product.price - discountedPrice).toFixed(0)}</span>
                </div>
              )}
            </div>

            <div className="divider" />

            <div>
              <p style={{ color: 'var(--text-300)', lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-400)' }}>Stock:</span>
              <span className={`badge ${product.stock > 10 ? 'badge-green' : product.stock > 0 ? 'badge-yellow' : 'badge-red'}`}>
                {product.stock > 10 ? `✅ In Stock (${product.stock})` : product.stock > 0 ? `⚠️ Only ${product.stock} left` : '❌ Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="qty-row">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-400)', fontWeight: 600 }}>Qty:</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            {error && <div className="alert-error"><span>⚠️</span> {error}</div>}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                id="product-add-to-cart-btn"
                className={`btn btn-lg ${added ? 'btn-success' : 'btn-primary'}`}
                style={{ flex: 1, minWidth: 160 }}
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
              >
                {adding ? '⏳ Adding...' : added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button
                id="product-buy-now-btn"
                className="btn btn-secondary btn-lg"
                style={{ flex: 1, minWidth: 160 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Quick info */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {['🚚 Free Shipping', '↩️ 30-Day Returns', '🔒 Secure Payment'].map(f => (
                <span key={f} style={{ fontSize: '0.78rem', color: 'var(--text-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
