import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.brandHeader}>
              <img
                src="/images/powerpuff-gurls-logo.png"
                alt="Powerpuff Gurls Logo"
                className={styles.brandLogo}
              />
              <div className={styles.logo}>Coir<span>Craft</span> PH</div>
            </div>

            <p>Sustainable coconut coir products rooted in Filipino heritage and craftsmanship.</p>
            <div className={styles.groupBadge}>
              <img
                src="/images/powerpuff-gurls-logo.png"
                alt="Powerpuff Gurls Logo"
                className={styles.groupBadgeLogo}
              />
              <span>Powerpuff Gurls — CoirCraft PH</span>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/storefront">New Arrivals</Link></li>
              <li><Link to="/storefront">Best Sellers</Link></li>
              <li><Link to="/storefront">Trending</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">Order History</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Contact</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">coircraft@example.ph</a></li>
              <li><a href="#">+63 917 000 0000</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2025 CoirCraft PH · Powerpuff Gurls · All Rights Reserved</span>
          <span>For educational purposes only, and no copyright infringement is intended.</span>
        </div>
      </div>
    </footer>
  )
}