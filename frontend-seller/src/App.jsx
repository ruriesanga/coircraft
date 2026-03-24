import { Routes, Route, Navigate } from 'react-router-dom'
import { useSellerAuth } from './context/SellerAuthContext'
import DashboardLayout from './components/seller/DashboardLayout'
import SellerLoginPage from './pages/seller/SellerLoginPage'
import DashboardPage from './pages/seller/DashboardPage'
import InventoryPage from './pages/seller/InventoryPage'
import ReportsPage from './pages/seller/ReportsPage'
import InventoryReportPage from './pages/seller/InventoryReportPage'
import StorefrontManagePage from './pages/seller/StorefrontManagePage'
import SellerOrdersPage from './pages/seller/SellerOrdersPage'

function ProtectedRoute({ children }) {
  const { seller, loading } = useSellerAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--coir)', fontSize:'18px' }}>
      Loading...
    </div>
  )
  return seller ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<SellerLoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index                  element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"       element={<DashboardPage />} />
        <Route path="orders"          element={<SellerOrdersPage />} />
        <Route path="inventory"       element={<InventoryPage />} />
        <Route path="storefront"      element={<StorefrontManagePage />} />
        <Route path="reports"         element={<ReportsPage />} />
        <Route path="inventory-report"element={<InventoryReportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
