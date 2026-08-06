import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">🛍️ ShopEZ</div>
            <p className="footer-desc">
              Your one-stop destination for effortless online shopping. Discover thousands of products with amazing deals, delivered right to your doorstep.
            </p>
          </div>
          <div>
            <div className="footer-heading">Shop</div>
            <div className="footer-links">
              <Link to="/products" className="footer-link">All Products</Link>
              <span className="footer-link">Electronics</span>
              <span className="footer-link">Fashion</span>
              <span className="footer-link">Home & Kitchen</span>
              <span className="footer-link">Sports</span>
            </div>
          </div>
          <div>
            <div className="footer-heading">Account</div>
            <div className="footer-links">
              <Link to="/login" className="footer-link">Login</Link>
              <Link to="/register" className="footer-link">Register</Link>
              <Link to="/profile" className="footer-link">My Orders</Link>
              <Link to="/cart" className="footer-link">Cart</Link>
            </div>
          </div>
          <div>
            <div className="footer-heading">Support</div>
            <div className="footer-links">
              <span className="footer-link">Help Center</span>
              <span className="footer-link">Contact Us</span>
              <span className="footer-link">Shipping Policy</span>
              <span className="footer-link">Returns</span>
              <span className="footer-link">Privacy Policy</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} ShopEZ. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span className="footer-link">Terms of Service</span>
            <span className="footer-link">Privacy</span>
            <span className="footer-link">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
