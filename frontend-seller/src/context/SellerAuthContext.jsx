import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function SellerAuthProvider({ children }) {
  const [seller, setSeller]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('seller_token')
    if (token) {
      api.get('/seller/me').then(r => setSeller(r.data))
        .catch(() => localStorage.removeItem('seller_token'))
        .finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/seller/login', { email, password })
    localStorage.setItem('seller_token', data.token)
    setSeller(data.seller)
    return data
  }

  const logout = async () => {
    try { await api.post('/seller/logout') } catch {}
    localStorage.removeItem('seller_token')
    setSeller(null)
  }

  return (
    <AuthContext.Provider value={{ seller, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSellerAuth = () => useContext(AuthContext)
