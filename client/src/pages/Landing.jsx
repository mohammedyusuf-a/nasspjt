import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LimitedOffersBlock from '../components/LimitedOffersBlock';
import { handleImageError } from '../utils/imageFallback';

const features = [
  { icon: '🚀', title: 'Express Delivery', desc: 'Free delivery on orders above ₹499. Lightning fast delivery nationwide.' },
  { icon: '🛡️', title: '100% Authentic', desc: 'Directly sourced from official brand partners with full warranty.' },
  { icon: '💳', title: 'Secure Checkout', desc: 'Bank-level SSL encryption keeping all your payment data safe.' },
  { icon: '💬', title: '24/7 VIP Support', desc: 'Dedicated customer assistance around the clock via live chat & email.' },
];

const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'Verified Buyer',
    avatar: '👨‍💼',
    rating: 5,
    comment: 'ShopEZ has completely transformed my online shopping! Delivery was super fast and the noise-cancelling headphones exceeded all expectations.',
  },
  {
    name: 'Priya Patel',
    role: 'Tech Enthusiast',
    avatar: '👩‍💻',
    rating: 5,
    comment: 'The interface is so smooth and sleek. Ordered the Smart Watch Pro X and it arrived in perfect condition within 24 hours!',
  },
  {
    name: 'Rohan Mehta',
    role: 'Regular Shopper',
    avatar: '👨‍🎨',
    rating: 5,
    comment: 'Great discounts, genuine products, and hassle-free returns. By far the best e-commerce platform I have used this year.',
  },
];

export default function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/products')
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports'];

  const limitedOffers = products.filter(p => p.isLimitedOffer || p.discount >= 20);

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeCategory).slice(0, 8);

  const featuredSpotlight = products.find(p => p.discount >= 15) || products[0];

  return (
    <div className="landing-page">
      {/* ─── Hero Section ─── */}
      <section className="hero" style={{ padding: '4rem 0 6rem', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg" />
        <div className="hero-orbs">
          <div className="orb orb-1" style={{ width: '400px', height: '400px', top: '-50px', left: '-100px' }} />
          <div className="orb orb-2" style={{ width: '500px', height: '500px', bottom: '-100px', right: '-100px' }} />
          <div className="orb orb-3" style={{ width: '300px', height: '300px', top: '40%', left: '50%' }} />
        </div>

        <div className="container hero-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="hero-eyebrow" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem', borderRadius: 'var(--r-full)',
              background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem'
            }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              ⚡ Limited Time Deals — Up to 50% Off Top Brands
            </div>

            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Next-Gen Shopping for the <br />
              <span className="text-gradient">Modern Lifestyle</span>
            </h1>

            <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: 'var(--text-300)', marginBottom: '2rem', maxWidth: '540px' }}>
              Discover thousands of handpicked premium products with instant delivery, exclusive member pricing, and 100% verified quality.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '6px', borderRadius: 'var(--r-lg)', border: '1px solid var(--glass-border)', maxWidth: '500px', marginBottom: '2rem', backdropFilter: 'blur(16px)' }}>
              <input
                type="text"
                placeholder="Search products, brands & categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', padding: '0.75rem 1rem', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--r-md)', fontWeight: 600 }}>
                🔍 Search
              </button>
            </form>

            <div className="hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-now-btn" style={{ boxShadow: 'var(--shadow-glow)' }}>
                🛍️ Explore All Products
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg" id="hero-register-btn">
                ✨ Join VIP Free
              </Link>
            </div>

            <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              {[
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Happy Buyers' },
                { value: '4.9★', label: 'Rating' },
                { value: '24/7', label: 'Support' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="hero-stat-value" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-100)' }}>{s.value}</div>
                  <div className="hero-stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-400)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Floating Hero Showcase Card */}
          {featuredSpotlight && (
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div className="glass-card hover-lift" style={{
                width: '100%', maxWidth: '380px', borderRadius: 'var(--r-xl)', padding: '1.5rem',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    🔥 Top Trending #1
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> In Stock
                  </span>
                </div>

                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '1.25rem', position: 'relative' }}>
                  <img src={featuredSpotlight.image} alt={featuredSpotlight.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImageError} />
                  {featuredSpotlight.discount > 0 && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff',
                      fontWeight: 800, fontSize: '0.8rem', padding: '4px 10px', borderRadius: 'var(--r-full)'
                    }}>
                      -{featuredSpotlight.discount}% OFF
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {featuredSpotlight.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-300)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {featuredSpotlight.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-400)' }}>Special Price</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a78bfa' }}>
                      ₹{featuredSpotlight.discount ? (featuredSpotlight.price * (1 - featuredSpotlight.discount / 100)).toFixed(0) : featuredSpotlight.price}
                    </div>
                  </div>
                  <Link to={`/products/${featuredSpotlight._id}`} className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--r-md)', fontWeight: 600 }}>
                    Buy Now →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="section-sm" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card glass-card hover-lift" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)' }}>
                <div className="feature-icon" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div className="feature-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{f.title}</div>
                <div className="feature-desc" style={{ fontSize: '0.85rem', color: 'var(--text-300)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Limited Offers Scrolling Block with Live Countdown Timer ─── */}
      <LimitedOffersBlock offerProducts={limitedOffers} />

      {/* ─── Featured Products Showcase with Category Tabs ─── */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="hero-eyebrow" style={{ display: 'inline-block', margin: '0 auto 1rem' }}>🔥 Curated Catalog</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Explore <span className="text-gradient">Featured Products</span>
            </h2>
            <p style={{ color: 'var(--text-300)', maxWidth: '560px', margin: '0.5rem auto 0' }}>
              Handpicked premium items with top customer ratings and massive discount offers.
            </p>

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.5rem 1.25rem', borderRadius: 'var(--r-full)', fontSize: '0.9rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    background: activeCategory === cat ? 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' : 'var(--glass-bg)',
                    border: '1px solid ' + (activeCategory === cat ? 'transparent' : 'var(--glass-border)'),
                    color: activeCategory === cat ? '#fff' : 'var(--text-300)',
                    boxShadow: activeCategory === cat ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  {cat === 'All' ? '✨ All Picks' : cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loader-wrapper" style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" /></div>
          ) : (
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
              {filteredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" className="btn btn-outline btn-lg" id="view-all-products-btn" style={{ borderRadius: 'var(--r-lg)', padding: '0.85rem 2.5rem' }}>
              Browse Complete Catalog ({products.length} Items) →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Deal of the Day Banner ─── */}
      {featuredSpotlight && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="glass-card" style={{
              borderRadius: 'var(--r-xl)', padding: '3rem 2rem',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)',
              border: '1px solid rgba(124,58,237,0.3)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: '0.8rem',
                    padding: '4px 12px', borderRadius: 'var(--r-full)', marginBottom: '1rem'
                  }}>
                    ⏰ DEAL OF THE DAY
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
                    {featuredSpotlight.name}
                  </h2>
                  <p style={{ color: 'var(--text-300)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                    {featuredSpotlight.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
                      ₹{(featuredSpotlight.price * (1 - (featuredSpotlight.discount || 10) / 100)).toFixed(0)}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-400)', textDecoration: 'line-through' }}>
                      ₹{featuredSpotlight.price}
                    </span>
                    <span style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.8rem', padding: '2px 8px', borderRadius: 'var(--r-xs)' }}>
                      Save {featuredSpotlight.discount || 10}%
                    </span>
                  </div>

                  <Link to={`/products/${featuredSpotlight._id}`} className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--r-md)', fontWeight: 700 }}>
                    ⚡ Claim Deal Now
                  </Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={featuredSpotlight.image}
                    alt={featuredSpotlight.name}
                    onError={handleImageError}
                    style={{ maxHeight: '320px', borderRadius: 'var(--r-lg)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Shop by Category Grid ─── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p style={{ color: 'var(--text-300)' }}>Quickly find products curated specifically for your needs.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '📱', label: 'Electronics', count: '1,200+ Items' },
              { icon: '👗', label: 'Fashion', count: '3,400+ Items' },
              { icon: '🏠', label: 'Home & Kitchen', count: '850+ Items' },
              { icon: '⚽', label: 'Sports', count: '620+ Items' },
              { icon: '📚', label: 'Books', count: '1,500+ Items' },
              { icon: '💄', label: 'Beauty', count: '940+ Items' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={`/products?category=${cat.label}`}
                id={`cat-${cat.label.toLowerCase().replace(/\s/g,'-')}`}
                className="glass-card hover-lift"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textCenter: 'center',
                  padding: '2rem 1rem', borderRadius: 'var(--r-lg)', textDecoration: 'none',
                  background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-200)', transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{cat.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-400)', marginTop: '4px' }}>{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof & Testimonials ─── */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="hero-eyebrow" style={{ display: 'inline-block', margin: '0 auto 1rem' }}>💬 Customer Love</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p style={{ color: 'var(--text-300)' }}>Read what our verified buyers have to say about their experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card hover-lift" style={{ padding: '1.75rem', borderRadius: 'var(--r-lg)', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2.2rem' }}>{t.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>✓ {t.role}</div>
                  </div>
                </div>
                <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color: 'var(--text-300)', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{t.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section style={{
        padding: '5rem 0', background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))',
        borderTop: '1px solid rgba(124,58,237,0.3)', borderBottom: '1px solid rgba(124,58,237,0.3)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
            Ready to Upgrade Your <span className="text-gradient">Shopping Experience?</span>
          </h2>
          <p style={{ color: 'var(--text-200)', marginBottom: '2.25rem', fontSize: '1.1rem' }}>
            Join 50,000+ satisfied shoppers. Create a free account now to get 15% off your first purchase!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn" style={{ padding: '0.85rem 2.25rem', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-glow)' }}>
              Create Free VIP Account
            </Link>
            <Link to="/products" className="btn btn-secondary btn-lg" id="cta-browse-btn" style={{ padding: '0.85rem 2.25rem', borderRadius: 'var(--r-lg)' }}>
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

