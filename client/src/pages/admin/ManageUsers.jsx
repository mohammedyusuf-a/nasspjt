import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? All their data will be removed.')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch { alert('Failed to delete user.'); }
    finally { setDeleting(null); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  if (loading) return <div className="loader-wrapper"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p style={{ color: 'var(--text-400)', fontSize: '0.9rem', marginTop: 4 }}>{users.length} registered customers</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input
          id="admin-user-search"
          type="text"
          className="form-input"
          placeholder="🔍 Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0
                    }}>{initials(u.name)}</div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-300)' }}>{u.email}</td>
                <td style={{ color: 'var(--text-400)', fontSize: '0.82rem' }}>{formatDate(u.createdAt)}</td>
                <td><span className="badge badge-blue">Customer</span></td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(u._id)}
                    disabled={deleting === u._id}
                    id={`delete-user-${u._id}`}
                  >
                    {deleting === u._id ? '⏳' : '🗑️ Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-icon">👥</div>
            <div className="empty-title">No users found</div>
          </div>
        )}
      </div>
    </div>
  );
}
