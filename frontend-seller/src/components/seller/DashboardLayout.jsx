import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useSellerAuth } from '../../context/SellerAuthContext'
import { FiGrid, FiPackage, FiBarChart2, FiList, FiShoppingBag, FiLogOut, FiShoppingCart } from 'react-icons/fi'
import styles from './DashboardLayout.module.css'

const NAV = [
  { to: '/dashboard',         icon: <FiGrid />,        label: 'Dashboard'        },
  { to: '/orders',            icon: <FiShoppingCart/>, label: 'Orders'           },
  { to: '/inventory',         icon: <FiPackage />,     label: 'Inventory'        },
  { to: '/storefront',        icon: <FiShoppingBag />, label: 'Storefront'       },
  { to: '/reports',           icon: <FiBarChart2 />,   label: 'Sales Reports'    },
  { to: '/inventory-report',  icon: <FiList />,        label: 'Inventory Report' },
]

export default function DashboardLayout() {
  const { seller, logout } = useSellerAuth()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>C</div>
            <span>Coir<em>Craft</em></span>
          </div>
          <div className={styles.sellerInfo}>
            <div className={styles.sellerAvatar}>{seller?.store_name?.charAt(0)}</div>
            <div className={styles.sellerName}>{seller?.store_name}</div>
            <div className={styles.sellerRole}>Seller Account</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              <span className={styles.navIcon}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FiLogOut /> Sign Out
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarBrand}>🥥 CoirCraft PH — Seller Dashboard</div>
          <div className={styles.topbarSeller}>
            Logged in as <strong>{seller?.email}</strong>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
        <footer className={styles.footer}>
          <span>© 2025 CoirCraft PH · Powerpuff Gurls</span>
          <span>For educational purposes only, and no copyright infringement is intended.</span>
        </footer>
      </div>
    </div>
  )
}
