import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useEffect } from 'react'
import { FiShoppingCart, FiUser, FiLogOut, FiPackage } from 'react-icons/fi'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout }   = useAuth()
  const { items, fetchCart } = useCart()
  const navigate             = useNavigate()

  useEffect(() => { if (user) fetchCart() }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoMark}>C</div>
          <span className={styles.brand}>Coir<span>Craft</span> PH</span>
        </Link>

        {/* Links */}
        <ul className={styles.links}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/storefront">Storefront</Link></li>
          <li><Link to="/products">Products</Link></li>
        </ul>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartBtn}>
            <FiShoppingCart size={20} />
            {items.length > 0 && (
              <span className={styles.badge}>{items.length}</span>
            )}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userGreet}>Hi, {user.full_name.split(' ')[0]}</span>
              <Link to="/orders" className={styles.iconBtn} title="Orders"><FiPackage size={18} /></Link>
              <Link to="/profile" className={styles.iconBtn} title="Profile"><FiUser size={18} /></Link>
              <button onClick={handleLogout} className={styles.iconBtn} title="Logout"><FiLogOut size={18} /></button>
            </div>
          ) : (
            <>
              <Link to="/login"    className={styles.btnOutline}>Login</Link>
              <Link to="/register" className={styles.btnFill}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
