import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys', 'Groceries', 'Other'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', discount: '0', category: '', image: '', stock: '100', rating: '4.0', reviews: '0' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        image: form.image.trim(),
        price: parseFloat(form.price) || 0,
        discount: parseFloat(form.discount) || 0,
        stock: parseInt(form.stock) || 0,
        rating: parseFloat(form.rating) || 4.0,
        reviews: parseInt(form.reviews) || 0
      };
      await axios.post('/api/products', payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add New Product</h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>Fill in the details to list a new product</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/products')} id="add-product-back-btn">← Back</button>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}><span>⚠️</span> {error}</div>}

      <form onSubmit={handleSubmit} id="add-product-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="checkout-card" style={{ gridColumn: '1 / -1' }}>
            <div className="checkout-card-header">📦 Basic Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input name="name" className="form-input" placeholder="e.g. Premium Wireless Headphones" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-textarea" placeholder="Detailed product description..." value={form.description} onChange={handleChange} required rows={4} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input name="image" className="form-input" type="url" placeholder="https://..." value={form.image} onChange={handleChange} required />
                {form.image && (
                  <img src={form.image} alt="Preview" style={{ marginTop: '0.5rem', width: 120, height: 90, objectFit: 'cover', borderRadius: 'var(--r-sm)', border: '1px solid var(--glass-border)' }} onError={(e) => e.target.style.display = 'none'} />
                )}
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-card-header">💰 Pricing & Inventory</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Original Price (₹) *</label>
                <input name="price" type="number" min="0" step="0.01" className="form-input" placeholder="299" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input name="discount" type="number" min="0" max="100" className="form-input" placeholder="0" value={form.discount} onChange={handleChange} />
                {form.price && form.discount > 0 && (
                  <p style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: 4 }}>
                    Final price: ₹{+(parseFloat(form.price) * (1 - parseFloat(form.discount) / 100)).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input name="stock" type="number" min="0" className="form-input" placeholder="100" value={form.stock} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-card-header">⭐ Ratings & Reviews</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rating (0–5)</label>
                <input name="rating" type="number" min="0" max="5" step="0.1" className="form-input" placeholder="4.0" value={form.rating} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Reviews</label>
                <input name="reviews" type="number" min="0" className="form-input" placeholder="0" value={form.reviews} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button id="add-product-submit-btn" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '⏳ Adding...' : '✅ Add Product'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
