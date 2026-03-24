import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { items, total, fetchCart, updateItem, removeItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{ fetchCart() },[])

  if (items.length === 0) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>🛒</div>
      <h2>Your cart is empty</h2>
      <p>Start adding some amazing coir products!</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Shopping Cart</h1>
        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map(item=>(
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImg}><span>🌿</span></div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.product?.name}</div>
                  <div className={styles.itemPrice}>₱ {Number(item.product?.price).toLocaleString()} each</div>
                </div>
                <div className={styles.qtyCtrl}>
                  <button onClick={()=>updateItem(item.id, Math.max(1, item.quantity-1))}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={()=>updateItem(item.id, item.quantity+1)}>+</button>
                </div>
                <div className={styles.itemSubtotal}>₱ {(item.product?.price * item.quantity).toLocaleString()}</div>
                <button className={styles.removeBtn} onClick={()=>removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className={styles.summary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}><span>Subtotal ({items.length} items)</span><span>₱ {total.toLocaleString()}</span></div>
            <div className={styles.summaryRow}><span>Shipping</span><span className={styles.freeShip}>Calculated at checkout</span></div>
            <div className={styles.summaryTotal}><span>Total</span><span>₱ {total.toLocaleString()}</span></div>
            <button className={styles.checkoutBtn} onClick={()=>navigate('/checkout')}>Proceed to Checkout</button>
            <Link to="/products" className={styles.continueLink}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
