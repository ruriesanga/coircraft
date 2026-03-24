import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import styles from './CheckoutPage.module.css'

export default function CheckoutPage() {
  const { items, total, fetchCart, clearCart } = useCart()
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState:{errors} } = useForm({
    defaultValues:{ delivery_method:'delivery', payment_method:'cod', contact_number: user?.mobile_number||'', delivery_address: user?.address||'' }
  })
  const deliveryMethod = watch('delivery_method')

  useEffect(()=>{ fetchCart() },[])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const order = await api.post('/orders', data)
      await clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/orders')
    } catch(e) {
      toast.error(e.response?.data?.message || 'Order failed')
    } finally { setLoading(false) }
  }

  if (items.length === 0) { navigate('/cart'); return null }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.layout}>
          <div className={styles.left}>
            <div className={styles.section}>
              <h3>Delivery Method</h3>
              <div className={styles.optionGroup}>
                {['delivery','pickup'].map(m=>(
                  <label key={m} className={`${styles.option} ${watch('delivery_method')===m?styles.optionActive:''}`}>
                    <input type="radio" value={m} {...register('delivery_method')} hidden/>
                    <span className={styles.optionIcon}>{m==='delivery'?'🚚':'🏪'}</span>
                    <div><div className={styles.optionTitle}>{m==='delivery'?'Home Delivery':'Pickup at Store'}</div>
                    <div className={styles.optionDesc}>{m==='delivery'?'Delivered to your address':'Pick up from our store'}</div></div>
                  </label>
                ))}
              </div>
            </div>

            {deliveryMethod==='delivery' && (
              <div className={styles.section}>
                <h3>Delivery Details</h3>
                <div className={styles.field}><label>Delivery Address</label>
                  <textarea rows={3} {...register('delivery_address',{required:'Address is required'})} placeholder="Complete delivery address"/>
                  {errors.delivery_address && <span className="error-msg">{errors.delivery_address.message}</span>}
                </div>
                <div className={styles.field}><label>Contact Number</label>
                  <input {...register('contact_number',{required:'Contact number required'})} placeholder="09XXXXXXXXX"/>
                  {errors.contact_number && <span className="error-msg">{errors.contact_number.message}</span>}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h3>Payment Method</h3>
              <div className={styles.optionGroup}>
                {[{v:'cod',icon:'💵',title:'Cash on Delivery',desc:'Pay when you receive'},{v:'gcash',icon:'📱',title:'GCash',desc:'Pay via GCash e-wallet'},{v:'paymaya',icon:'💳',title:'PayMaya',desc:'Pay via PayMaya'}].map(m=>(
                  <label key={m.v} className={`${styles.option} ${watch('payment_method')===m.v?styles.optionActive:''}`}>
                    <input type="radio" value={m.v} {...register('payment_method')} hidden/>
                    <span className={styles.optionIcon}>{m.icon}</span>
                    <div><div className={styles.optionTitle}>{m.title}</div><div className={styles.optionDesc}>{m.desc}</div></div>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}><label>Order Notes (optional)</label>
              <textarea rows={2} {...register('notes')} placeholder="Any special instructions..."/>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>
              {items.map(item=>(
                <div key={item.id} className={styles.orderItem}>
                  <span>{item.product?.name} × {item.quantity}</span>
                  <span>₱ {(item.product?.price*item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className={styles.orderTotal}><span>Total</span><span>₱ {total.toLocaleString()}</span></div>
              <button type="submit" className={styles.placeBtn} disabled={loading}>
                {loading ? 'Placing order...' : 'Place Order 🌿'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
