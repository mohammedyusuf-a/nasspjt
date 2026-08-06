import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { handleImageError } from '../../utils/imageFallback';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    axios.get('/api/products').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { alert('Failed to delete product.'); }
    finally { setDeleting(null); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Products</h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>{products.length} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary" id="manage-products-add-btn">+ Add Product</Link>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input
          id="admin-product-search"
          type="text"
          className="form-input"
          placeholder="🔍 Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const discounted = p.discount ? +(p.price * (1 - p.discount / 100)).toFixed(2) : p.price;
              return (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} className="table-img" onError={handleImageError} /></td>
                  <td>
                    <div style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  </td>
                  <td><span className="badge badge-purple">{p.category}</span></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>₹{discounted.toLocaleString()}</div>
                    {p.discount > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-400)', textDecoration: 'line-through' }}>₹{p.price}</div>}
                  </td>
                  <td>
                    {p.discount > 0
                      ? <span className="badge badge-green">{p.discount}% off</span>
                      : <span style={{ color: 'var(--text-500)' }}>—</span>
                    }
                  </td>
                  <td>
                    <span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-yellow' : 'badge-red'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="btn btn-secondary btn-sm"
                        id={`edit-product-${p._id}`}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p._id)}
                        disabled={deleting === p._id}
                        id={`delete-product-${p._id}`}
                      >
                        {deleting === p._id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No products found</div>
          </div>
        )}
      </div>
    </div>
  );
}
