import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { handleImageError } from '../utils/imageFallback';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span 
          key={i} 
          style={{ 
            color: i < Math.round(rating) ? '#fbbf24' : 'rgba(255,255,255,0.15)',
            fontSize: '0.85rem',
            filter: i < Math.round(rating) ? 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.4))' : 'none'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountedPrice = product.discount
    ? +(product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = '/login'; return; }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { /* ignore */ }
    finally { setAdding(false); }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-card glass-card hover-lift position-relative">
      <div className="product-img-wrapper" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-md)', aspectRatio: '1/1', background: 'rgba(0,0,0,0.2)' }}>
        <Link to={`/products/${product._id}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy" 
            onError={handleImageError}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            className="product-card-img"
          />
        </Link>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="product-discount-badge" style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'linear-gradient(135deg, #ef4444, #f43f5e)',
            color: '#fff', fontWeight: 700, fontSize: '0.75rem',
            padding: '4px 10px', borderRadius: 'var(--r-full)',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            letterSpacing: '0.5px'
          }}>
            -{product.discount}% OFF
          </span>
        )}

        {/* Category Pill */}
        <span style={{
          position: 'absolute', bottom: '12px', left: '12px',
          background: 'rgba(8, 8, 32, 0.75)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-300)',
          fontWeight: 600, fontSize: '0.7rem', padding: '3px 8px', borderRadius: 'var(--r-xs)'
        }}>
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          title="Save to Wishlist"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(8, 8, 32, 0.65)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease',
            color: isWishlisted ? '#ef4444' : 'var(--text-300)',
            fontSize: '1rem'
          }}
          className="wishlist-btn hover-scale"
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        {/* Quick View Overlay */}
        <div className="product-actions-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4, 4, 15, 0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none'
        }}>
          <Link 
            to={`/products/${product._id}`} 
            className="btn btn-secondary btn-sm"
            style={{ pointerEvents: 'auto', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-md)' }}
          >
            🔍 View Product
          </Link>
        </div>
      </div>

      <div className="product-body" style={{ padding: '1.25rem 1rem 0.5rem' }}>
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="product-name" style={{
            fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-100)',
            lineHeight: '1.4', height: '2.8rem', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            marginBottom: '0.5rem', transition: 'color 0.2s'
          }}>
            {product.name}
          </h3>
        </Link>
        
        <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <StarRating rating={product.rating || 4.5} />
          <span className="rating-count" style={{ fontSize: '0.8rem', color: 'var(--text-400)' }}>
            ({product.reviews || 120})
          </span>
          {product.stock && product.stock <= 30 && (
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#f59e0b', fontWeight: 600 }}>
              🔥 Only {product.stock} left
            </span>
          )}
        </div>

        <div className="product-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="price-current" style={{
            fontSize: '1.25rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            ₹{discountedPrice.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <span className="price-original" style={{
              fontSize: '0.85rem', color: 'var(--text-400)', textDecoration: 'line-through'
            }}>
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="product-footer" style={{ padding: '0.75rem 1rem 1.25rem' }}>
        <button
          id={`add-to-cart-${product._id}`}
          className={`btn btn-full ${added ? 'btn-success' : 'btn-primary'} btn-md`}
          onClick={handleAddToCart}
          disabled={adding}
          style={{
            borderRadius: 'var(--r-md)',
            fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: added ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 4px 15px rgba(124, 58, 237, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {adding ? '⏳ Adding...' : added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}

