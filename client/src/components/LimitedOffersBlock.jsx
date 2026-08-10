import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

function CountdownTicker({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const target = targetDate ? new Date(targetDate).getTime() : Date.now() + 14 * 3600 * 1000;
      const difference = Math.max(0, target - Date.now());

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="timer-ticker" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <div className="ticker-unit">
        <span className="ticker-val">{pad(timeLeft.hours)}</span>
        <span className="ticker-label">HRS</span>
      </div>
      <span className="ticker-colon">:</span>
      <div className="ticker-unit">
        <span className="ticker-val">{pad(timeLeft.minutes)}</span>
        <span className="ticker-label">MIN</span>
      </div>
      <span className="ticker-colon">:</span>
      <div className="ticker-unit">
        <span className="ticker-val">{pad(timeLeft.seconds)}</span>
        <span className="ticker-label">SEC</span>
      </div>
    </div>
  );
}

function ItemTimerBadge({ targetDate }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const target = targetDate ? new Date(targetDate).getTime() : Date.now() + 12 * 3600 * 1000;
      const diff = Math.max(0, target - Date.now());

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, '0');
      setTimeStr(`${pad(h)}h ${pad(m)}m ${pad(s)}s`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className="item-timer-badge">
      ⏳ {timeStr}
    </span>
  );
}

export default function LimitedOffersBlock({ offerProducts = [] }) {
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState({});

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingId(product._id);
      await addToCart(product._id, 1, product);
      setAddedIds((prev) => ({ ...prev, [product._id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product._id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to claim deal:', err);
    } finally {
      setAddingId(null);
    }
  };

  if (!offerProducts || offerProducts.length === 0) return null;

  return (
    <section className="limited-offers-section">
      <div className="container">
        {/* Header Bar */}
        <div className="limited-offers-header">
          <div className="header-left">
            <div className="eyebrow-badge">
              <span className="live-dot" />
              ⚡ FLASH DEAL ZONE
            </div>
            <h2 className="section-title">
              Limited Time <span className="text-gradient">Special Offers</span>
            </h2>
            <p className="section-desc">
              Unbeatable discounts on high-demand items. Hurry before stock runs out!
            </p>
          </div>

          <div className="header-right">
            <div className="main-countdown-container">
              <span className="countdown-title">DEALS EXPIRE IN</span>
              <CountdownTicker targetDate={offerProducts[0]?.offerEndsAt} />
            </div>

            <div className="scroll-controls">
              <button
                onClick={() => handleScroll('left')}
                className="scroll-btn"
                aria-label="Scroll Left"
                title="Previous Offers"
              >
                ←
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="scroll-btn"
                aria-label="Scroll Right"
                title="Next Offers"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="limited-offers-scroll-wrapper" ref={scrollRef}>
          {offerProducts.map((product) => {
            const discountedPrice = product.discount
              ? +(product.price * (1 - product.discount / 100)).toFixed(0)
              : product.price;

            const isAdding = addingId === product._id;
            const isAdded = !!addedIds[product._id];
            const claimedPct = product.claimedPercentage || Math.floor(Math.random() * 30 + 65);

            return (
              <div key={product._id} className="limited-offer-card glass-card hover-lift">
                {/* Image Container */}
                <div className="offer-img-box">
                  <Link to={`/products/${product._id}`}>
                    <img src={product.image} alt={product.name} loading="lazy" onError={handleImageError} />
                  </Link>

                  {/* Top Left Discount Badge */}
                  <span className="discount-tag">
                    -{product.discount || 20}% OFF
                  </span>

                  {/* Top Right Countdown Badge */}
                  <ItemTimerBadge targetDate={product.offerEndsAt} />
                </div>

                {/* Card Content */}
                <div className="offer-card-body">
                  <div className="category-row">
                    <span className="category-pill">{product.category}</span>
                    <span className="rating-pill">★ {product.rating || 4.8}</span>
                  </div>

                  <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="offer-title">{product.name}</h3>
                  </Link>

                  {/* Claimed Progress Bar */}
                  <div className="claimed-progress-box">
                    <div className="progress-text">
                      <span>🔥 {claimedPct}% Claimed</span>
                      <span>Only {product.stock} left</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${claimedPct}%` }} />
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="price-box">
                    <div>
                      <span className="current-price">₹{discountedPrice}</span>
                      {product.discount > 0 && (
                        <span className="old-price">₹{product.price}</span>
                      )}
                    </div>
                    <span className="savings-badge">
                      Save ₹{(product.price - discountedPrice).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="offer-card-footer">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isAdding}
                    className={`offer-buy-btn ${isAdded ? 'success' : ''}`}
                  >
                    {isAdding ? '⏳ Adding...' : isAdded ? '✅ Added to Cart' : '⚡ Claim Deal'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
