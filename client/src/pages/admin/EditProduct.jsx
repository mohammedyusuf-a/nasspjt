import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys', 'Groceries', 'Other'];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', discount: '0', category: '', image: '', stock: '100', rating: '4.0', reviews: '0' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/products/${id}`).then(({ data }) => {
      setForm({
        name: data.name, description: data.description, price: String(data.price),
        discount: String(data.discount || 0), category: data.category, image: data.image,
        stock: String(data.stock), rating: String(data.rating || 4), reviews: String(data.reviews || 0)
      });
    }).catch(() => navigate('/admin/products')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
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
      await axios.put(`/api/products/${id}`, payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit Product</h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>Update the product information</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/products')} id="edit-product-back-btn">← Back</button>
      </div>

      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}><span>⚠️</span> {error}</div>}

      <form onSubmit={handleSubmit} id="edit-product-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="checkout-card" style={{ gridColumn: '1 / -1' }}>
            <div className="checkout-card-header">📦 Basic Information</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} required rows={4} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input name="image" className="form-input" type="url" value={form.image} onChange={handleChange} required />
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
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input name="price" type="number" min="0" step="0.01" className="form-input" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input name="discount" type="number" min="0" max="100" className="form-input" value={form.discount} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input name="stock" type="number" min="0" className="form-input" value={form.stock} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-card-header">⭐ Ratings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rating (0–5)</label>
                <input name="rating" type="number" min="0" max="5" step="0.1" className="form-input" value={form.rating} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Reviews Count</label>
                <input name="reviews" type="number" min="0" className="form-input" value={form.reviews} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button id="edit-product-submit-btn" type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
