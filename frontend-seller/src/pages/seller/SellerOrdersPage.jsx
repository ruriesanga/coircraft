import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import styles from './SellerOrdersPage.module.css'

const STATUSES = ['all','pending','confirmed','processing','shipped','delivered','cancelled']

const STATUS_META = {
  pending:    { label: 'Pending',    color: '#B7770D', bg: '#FFF8E1' },
  confirmed:  { label: 'Confirmed',  color: '#1565C0', bg: '#E3F2FD' },
  processing: { label: 'Processing', color: '#6A1B9A', bg: '#F3E5F5' },
  shipped:    { label: 'Shipped',    color: '#00838F', bg: '#E0F7FA' },
  delivered:  { label: 'Delivered',  color: '#2D6A4F', bg: '#E8F5E9' },
  cancelled:  { label: 'Cancelled',  color: '#C0392B', bg: '#FDECEA' },
}

// The allowed next statuses from a given current status
const NEXT_STATUSES = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered', 'cancelled'],
  delivered:  [],
  cancelled:  [],
}

export default function SellerOrdersPage() {
  const qc = useQueryClient()
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch]             = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedOrder, setSelectedOrder]     = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus]             = useState('')
  const [statusNote, setStatusNote]           = useState('')

  // Fetch orders
  const { data, isLoading } = useQuery({
    queryKey: ['sellerOrders', filterStatus, debouncedSearch],
    queryFn:  () => api.get('/seller/orders', {
      params: { status: filterStatus, search: debouncedSearch }
    }).then(r => r.data),
  })

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status, note }) =>
      api.patch(`/seller/orders/${id}/status`, { status, note }),
    onSuccess: (res) => {
      toast.success(`Order marked as "${res.data.order.status}"`)
      qc.invalidateQueries(['sellerOrders'])
      // Update the selected order panel in-place
      setSelectedOrder(res.data.order)
      closeStatusModal()
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Update failed'),
  })

  // Search debounce
  let timer
  const handleSearch = (v) => {
    setSearch(v)
    clearTimeout(timer)
    timer = setTimeout(() => setDebouncedSearch(v), 400)
  }

  const openStatusModal = (status) => {
    setNewStatus(status)
    setStatusNote('')
    setShowStatusModal(true)
  }

  const closeStatusModal = () => {
    setShowStatusModal(false)
    setNewStatus('')
    setStatusNote('')
  }

  const confirmStatusUpdate = () => {
    if (!selectedOrder || !newStatus) return
    updateMutation.mutate({ id: selectedOrder.id, status: newStatus, note: statusNote })
  }

  const meta = (s) => STATUS_META[s] || STATUS_META.pending

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <h1>Orders</h1>
        <div className={styles.summary}>
          {Object.entries(STATUS_META).map(([s, m]) => {
            const count = data?.data?.filter(o => o.status === s).length || 0
            if (!count) return null
            return (
              <span key={s} className={styles.summaryPill}
                style={{ background: m.bg, color: m.color }}>
                {m.label}: {count}
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="🔍 Search order number..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
        <div className={styles.filterTabs}>
          {STATUSES.map(s => (
            <button
              key={s}
              className={`${styles.filterTab} ${filterStatus === s ? styles.filterTabActive : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All' : STATUS_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main layout: list + detail panel ── */}
      <div className={styles.layout}>

        {/* Order list */}
        <div className={styles.list}>
          {isLoading && (
            <div className={styles.empty}>Loading orders...</div>
          )}
          {!isLoading && (!data?.data || data.data.length === 0) && (
            <div className={styles.empty}>
              <span>📦</span>
              <p>No orders found</p>
            </div>
          )}
          {data?.data?.map(order => {
            const m = meta(order.status)
            const isActive = selectedOrder?.id === order.id
            return (
              <div
                key={order.id}
                className={`${styles.orderCard} ${isActive ? styles.orderCardActive : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className={styles.orderCardTop}>
                  <span className={styles.orderNum}>{order.order_number}</span>
                  <span className={styles.statusBadge}
                    style={{ background: m.bg, color: m.color }}>
                    {m.label}
                  </span>
                </div>
                <div className={styles.orderCardMeta}>
                  <span className={styles.orderBuyer}>
                    👤 {order.user?.full_name || 'Unknown buyer'}
                  </span>
                  <span className={styles.orderAmount}>
                    ₱ {Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
                <div className={styles.orderCardFooter}>
                  <span>{order.delivery_method === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</span>
                  <span>{new Date(order.created_at).toLocaleDateString('en-PH', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className={styles.detail}>
          {!selectedOrder ? (
            <div className={styles.detailEmpty}>
              <span>👈</span>
              <p>Select an order to view details and update its status</p>
            </div>
          ) : (
            <div className={styles.detailCard}>
              {/* Order header */}
              <div className={styles.detailHeader}>
                <div>
                  <div className={styles.detailOrderNum}>{selectedOrder.order_number}</div>
                  <div className={styles.detailDate}>
                    Placed {new Date(selectedOrder.created_at).toLocaleString('en-PH', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <span className={styles.statusBadgeLg}
                  style={{ background: meta(selectedOrder.status).bg, color: meta(selectedOrder.status).color }}>
                  {meta(selectedOrder.status).label}
                </span>
              </div>

              {/* Status update buttons */}
              {NEXT_STATUSES[selectedOrder.status]?.length > 0 && (
                <div className={styles.statusActions}>
                  <div className={styles.statusActionsLabel}>Update Status:</div>
                  <div className={styles.statusBtns}>
                    {NEXT_STATUSES[selectedOrder.status].map(s => (
                      <button
                        key={s}
                        className={`${styles.statusBtn} ${s === 'cancelled' ? styles.statusBtnDanger : styles.statusBtnPrimary}`}
                        onClick={() => openStatusModal(s)}
                      >
                        {s === 'confirmed'  && '✅ Confirm Order'}
                        {s === 'processing' && '⚙️ Mark Processing'}
                        {s === 'shipped'    && '🚚 Mark Shipped'}
                        {s === 'delivered'  && '✅ Mark Delivered'}
                        {s === 'cancelled'  && '✕ Cancel Order'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buyer info */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>👤 Buyer Information</div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}><span>Name</span><span>{selectedOrder.user?.full_name}</span></div>
                  <div className={styles.infoRow}><span>Email</span><span>{selectedOrder.user?.email}</span></div>
                  <div className={styles.infoRow}><span>Mobile</span><span>{selectedOrder.contact_number || selectedOrder.user?.mobile_number || '—'}</span></div>
                </div>
              </div>

              {/* Delivery info */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>🚚 Delivery Information</div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoRow}>
                    <span>Method</span>
                    <span>{selectedOrder.delivery_method === 'delivery' ? '🚚 Home Delivery' : '🏪 Store Pickup'}</span>
                  </div>
                  {selectedOrder.delivery_address && (
                    <div className={styles.infoRow}><span>Address</span><span>{selectedOrder.delivery_address}</span></div>
                  )}
                  <div className={styles.infoRow}>
                    <span>Payment</span>
                    <span>{selectedOrder.payment_method?.toUpperCase()}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Payment Status</span>
                    <span className={styles.payStatus}
                      style={{ color: selectedOrder.payment_status === 'paid' ? '#2D6A4F' : '#B7770D' }}>
                      {selectedOrder.payment_status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className={styles.notes}>📝 {selectedOrder.notes}</div>
                )}
              </div>

              {/* Order items */}
              <div className={styles.section}>
                <div className={styles.sectionTitle}>📦 Order Items</div>
                <div className={styles.itemsList}>
                  {selectedOrder.items?.map(item => (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.product_name}</div>
                        <div className={styles.itemQty}>qty: {item.quantity}</div>
                      </div>
                      <div className={styles.itemPrice}>
                        ₱ {Number(item.subtotal).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>₱ {Number(selectedOrder.total_amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Status Update Confirmation Modal ── */}
      {showStatusModal && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) closeStatusModal() }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Update Order Status</h3>
              <button className={styles.closeBtn} onClick={closeStatusModal}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <span>Order</span>
                <strong>{selectedOrder?.order_number}</strong>
              </div>
              <div className={styles.modalInfo}>
                <span>New Status</span>
                <span className={styles.statusBadge}
                  style={{ background: meta(newStatus).bg, color: meta(newStatus).color }}>
                  {meta(newStatus).label}
                </span>
              </div>
              {newStatus === 'cancelled' && (
                <div className={styles.warningBox}>
                  ⚠️ Cancelling will restore product stock. This cannot be undone.
                </div>
              )}
              {newStatus === 'delivered' && selectedOrder?.payment_method === 'cod' && (
                <div className={styles.infoBox}>
                  💡 Payment status will automatically be marked as <strong>Paid</strong> (Cash on Delivery).
                </div>
              )}
              <div className={styles.field}>
                <label>Note (optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. 'Package handed to rider', 'Awaiting payment confirmation'..."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeStatusModal}>Cancel</button>
              <button
                className={`${styles.confirmBtn} ${newStatus === 'cancelled' ? styles.confirmBtnDanger : ''}`}
                onClick={confirmStatusUpdate}
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? 'Updating...' : `Confirm — ${meta(newStatus).label}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
