import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); setMenuOpen(false); navigate('/'); };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">🛍️ ShopEZ</Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')} end>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>Products</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>Admin</NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {user && (
            <Link to="/cart" className="cart-btn" id="navbar-cart-btn" title="Cart">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-menu-btn" onClick={() => setMenuOpen(v => !v)} id="navbar-user-menu-btn">
                <div className="user-avatar">{initials}</div>
                <span>{user.name.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-400)' }}>{menuOpen ? '▲' : '▼'}</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-400)' }}>
                    Signed in as <strong style={{ color: 'var(--text-200)' }}>{user.email}</strong>
                  </div>
                  <div className="dropdown-divider" />
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)} id="dropdown-admin">
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)} id="dropdown-profile">
                    👤 My Profile
                  </Link>
                  <Link to="/cart" className="dropdown-item" onClick={() => setMenuOpen(false)} id="dropdown-cart">
                    🛒 Cart {cartCount > 0 && <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>{cartCount}</span>}
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout} id="dropdown-logout">
                    🚪 Sign Out
                  </button>
                  <div className="dropdown-divider" />
                  <Link
                    to="/admin"
                    className="dropdown-item admin-portal-item"
                    onClick={() => setMenuOpen(false)}
                    id="dropdown-admin-portal"
                    title="Admin Portal"
                  >
                    <span className="admin-portal-icon">🛡️</span>
                    <span>Admin Portal</span>
                    {isAdmin && <span className="admin-badge-dot" />}
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" id="navbar-login-btn">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="navbar-register-btn">Sign Up</Link>
            </>
          )}

          {/* Admin Icon — always visible in top-right corner */}
          <Link
            to="/admin"
            className={`admin-portal-btn${isAdmin ? ' admin-portal-btn--active' : ''}`}
            id="navbar-admin-portal-btn"
            title="Admin Portal"
          >
            🛡️
            {isAdmin && <span className="admin-portal-pulse" />}
          </Link>
        </div>
      </div>
    </nav>
  );
}
