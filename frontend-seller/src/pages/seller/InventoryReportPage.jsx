import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import styles from './InventoryReportPage.module.css'

export default function InventoryReportPage() {
  const { data, isLoading } = useQuery({ queryKey:['inventoryReport'], queryFn:()=>api.get('/seller/inventory').then(r=>r.data) })
  const { data: lowStock }  = useQuery({ queryKey:['lowStockReport'],  queryFn:()=>api.get('/seller/inventory/low-stock').then(r=>r.data) })

  const getStockClass = (stock) => stock === 0 ? styles.stockOut : stock <= 5 ? styles.stockCritical : stock <= 10 ? styles.stockLow : styles.stockOk

  return (
    <div>
      <h1 className={styles.pageTitle}>Inventory Report</h1>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryNum}>{data?.total||0}</div>
          <div className={styles.summaryLabel}>Total Products</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryNum} ${styles.warnColor}`}>{lowStock?.length||0}</div>
          <div className={styles.summaryLabel}>Low Stock (≤10)</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryNum} ${styles.dangerColor}`}>{data?.data?.filter(p=>p.stock===0).length||0}</div>
          <div className={styles.summaryLabel}>Out of Stock</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryNum} ${styles.okColor}`}>{data?.data?.filter(p=>p.is_active).length||0}</div>
          <div className={styles.summaryLabel}>Active Listings</div>
        </div>
      </div>

      {isLoading ? <div className={styles.loading}>Loading inventory...</div> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Product Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Sales Count</th></tr></thead>
            <tbody>
              {data?.data?.map(p=>(
                <tr key={p.id}>
                  <td className={styles.prodName}>{p.name}</td>
                  <td>{p.category?.name||'—'}</td>
                  <td>₱ {Number(p.price).toLocaleString()}</td>
                  <td><span className={`${styles.stockBadge} ${getStockClass(p.stock)}`}>{p.stock}</span></td>
                  <td><span className={`${styles.statusBadge} ${p.is_active?styles.active:styles.inactive}`}>{p.is_active?'Active':'Hidden'}</span></td>
                  <td>{p.sales_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
