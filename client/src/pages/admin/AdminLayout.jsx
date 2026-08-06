import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/products', icon: '📦', label: 'Products' },
  { to: '/admin/orders', icon: '🛒', label: 'All Orders' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
];

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-label">Main</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            id={`sidebar-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="dropdown-divider" style={{ margin: '0.75rem 0' }} />
        <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-400)', borderRadius: 'var(--r-sm)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-200)' }}>Admin</div>
          <div style={{ marginTop: 2 }}>{user?.email}</div>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
