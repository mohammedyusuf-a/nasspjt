import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    axios.get('/api/products/categories').then(({ data }) => setCategories(['All', ...data]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory !== 'All') params.category = activeCategory;
    axios.get('/api/products', { params })
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  let debounceTimer;
  const handleSearch = (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setSearch(e.target.value), 400);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
            All <span className="text-gradient-primary">Products</span>
          </h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem' }}>
            {products.length} products found
            {activeCategory !== 'All' && ` in "${activeCategory}"`}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="product-search-input"
              type="text"
              className="search-input"
              placeholder="Search products..."
              onChange={handleSearch}
              defaultValue=""
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills" style={{ marginBottom: '2rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-pill-${cat.toLowerCase().replace(/\s/g, '-')}`}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loader-wrapper"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No products found</div>
            <div className="empty-desc">Try adjusting your search or filter to find what you're looking for.</div>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
