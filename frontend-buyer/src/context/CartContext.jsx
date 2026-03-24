import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await api.get('/cart')
      setItems(data.items || [])
      setTotal(data.total || 0)
    } catch {}
  }, [])

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { product_id: productId, quantity })
    await fetchCart()
    toast.success('Added to cart!')
  }

  const updateItem = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`)
    await fetchCart()
    toast.success('Removed from cart')
  }

  const clearCart = async () => {
    await api.delete('/cart')
    setItems([])
    setTotal(0)
  }

  return (
    <CartContext.Provider value={{ items, total, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
