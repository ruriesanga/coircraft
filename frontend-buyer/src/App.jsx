import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './pages/buyer/HomePage'
import LoginPage from './pages/buyer/LoginPage'
import RegisterPage from './pages/buyer/RegisterPage'
import StorefrontPage from './pages/buyer/StorefrontPage'
import ProductsPage from './pages/buyer/ProductsPage'
import ProductDetailPage from './pages/buyer/ProductDetailPage'
import CartPage from './pages/buyer/CartPage'
import CheckoutPage from './pages/buyer/CheckoutPage'
import TransactionHistoryPage from './pages/buyer/TransactionHistoryPage'
import ProfilePage from './pages/buyer/ProfilePage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px',fontSize:'18px',color:'var(--coir)'}}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
          <Route path="/storefront"element={<StorefrontPage />} />
          <Route path="/products"  element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart"      element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout"  element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders"    element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
