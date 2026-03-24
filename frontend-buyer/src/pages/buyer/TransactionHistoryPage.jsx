import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../utils/api'
import styles from './TransactionHistoryPage.module.css'

const STATUS_COLORS = { pending:'#D4A017',confirmed:'#2D6A4F',processing:'#1565C0',shipped:'#7B1FA2',delivered:'#2D6A4F',cancelled:'#C0392B' }

export default function TransactionHistoryPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { data, isLoading } = useQuery({ queryKey:['orders'], queryFn:()=>api.get('/orders').then(r=>r.data) })

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Transaction History</h1>
        {isLoading ? <div className={styles.loading}>Loading orders...</div> : (
          <div className={styles.layout}>
            <div className={styles.list}>
              {(!data?.data || data.data.length===0) && (
                <div className={styles.empty}><span>📦</span><p>No orders yet</p></div>
              )}
              {data?.data?.map(order=>(
                <div key={order.id} className={`${styles.orderCard} ${selectedOrder?.id===order.id?styles.orderCardActive:''}`} onClick={()=>setSelectedOrder(order)}>
                  <div className={styles.orderTop}>
                    <span className={styles.orderNum}>{order.order_number}</span>
                    <span className={styles.orderStatus} style={{background:STATUS_COLORS[order.status]+'22',color:STATUS_COLORS[order.status]}}>{order.status}</span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span>₱ {Number(order.total_amount).toLocaleString()}</span>
                    <span>{new Date(order.created_at).toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'})}</span>
                  </div>
                  <div className={styles.orderDelivery}>{order.delivery_method === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'} · {order.payment_method.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div className={styles.detail}>
              {selectedOrder ? (
                <div className={styles.detailCard}>
                  <h3>Order Details</h3>
                  <div className={styles.detailRow}><span>Order #</span><span>{selectedOrder.order_number}</span></div>
                  <div className={styles.detailRow}><span>Status</span>
                    <span className={styles.orderStatus} style={{background:STATUS_COLORS[selectedOrder.status]+'22',color:STATUS_COLORS[selectedOrder.status]}}>{selectedOrder.status}</span>
                  </div>
                  <div className={styles.detailRow}><span>Payment</span><span>{selectedOrder.payment_method?.toUpperCase()}</span></div>
                  <div className={styles.detailRow}><span>Delivery</span><span>{selectedOrder.delivery_method}</span></div>
                  {selectedOrder.delivery_address && <div className={styles.detailRow}><span>Address</span><span>{selectedOrder.delivery_address}</span></div>}
                  <div className={styles.itemsSection}>
                    <h4>Items</h4>
                    {selectedOrder.items?.map(item=>(
                      <div key={item.id} className={styles.orderItem}>
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>₱ {Number(item.subtotal).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.totalRow}><span>Total</span><span>₱ {Number(selectedOrder.total_amount).toLocaleString()}</span></div>
                </div>
              ) : <div className={styles.selectHint}>👈 Select an order to view details</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
