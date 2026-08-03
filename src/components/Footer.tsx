export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">Joe Market</div>
          <p>Curation of the finest goods for the modern collector.</p>
        </div>
        <div>
          <h4>Service</h4>
          <a href="#support">Support</a>
          <a href="#shipping">Shipping</a>
          <a href="#returns">Returns</a>
        </div>
        <div>
          <h4>About</h4>
          <a href="#company">Company Info</a>
          <a href="#privacy">Privacy</a>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p>Private access to new collections.</p>
          <label className="newsletter">
            <input placeholder="Email address" />
            <span>→</span>
          </label>
        </div>
      </div>
      <div className="copyright">© 2024 Joe Market. All rights reserved.</div>
    </footer>
  );
}
