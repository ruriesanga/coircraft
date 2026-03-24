import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { data: daily }   = useQuery({ queryKey:['daily'],   queryFn:()=>api.get('/seller/reports/daily').then(r=>r.data) })
  const { data: monthly } = useQuery({ queryKey:['monthly'], queryFn:()=>api.get('/seller/reports/monthly').then(r=>r.data) })
  const { data: top }     = useQuery({ queryKey:['summary'], queryFn:()=>api.get('/seller/reports/summary').then(r=>r.data) })
  const { data: lowStock} = useQuery({ queryKey:['lowstock'],queryFn:()=>api.get('/seller/inventory/low-stock').then(r=>r.data) })

  const metrics = [
    { label:"Today's Sales",   value:`₱ ${Number(daily?.report?.total_sales||0).toLocaleString()}`, icon:'💰', sub:`${daily?.report?.order_count||0} orders` },
    { label:"Month's Sales",   value:`₱ ${Number(monthly?.totals?.total_sales||0).toLocaleString()}`, icon:'📅', sub:`${monthly?.totals?.order_count||0} orders` },
    { label:'Items Sold Today',value:daily?.report?.items_sold||0, icon:'📦', sub:'units' },
    { label:'Low Stock Items', value:lowStock?.length||0, icon:'⚠️', sub:'need restocking' },
  ]

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      <div className={styles.metricGrid}>
        {metrics.map(m=>(
          <div key={m.label} className={styles.metricCard}>
            <div className={styles.metricIcon}>{m.icon}</div>
            <div className={styles.metricValue}>{m.value}</div>
            <div className={styles.metricLabel}>{m.label}</div>
            <div className={styles.metricSub}>{m.sub}</div>
          </div>
        ))}
      </div>
      {top?.top_products?.length > 0 && (
        <div className={styles.section}>
          <h3>Top Selling Products</h3>
          <table className={styles.table}>
            <thead><tr><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
            <tbody>{top.top_products.map((p,i)=>(
              <tr key={i}><td>{p.name}</td><td>{p.qty_sold}</td><td>₱ {Number(p.revenue).toLocaleString()}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {lowStock?.length > 0 && (
        <div className={styles.section}>
          <h3>⚠️ Low Stock Alert</h3>
          <div className={styles.alertList}>
            {lowStock.map(p=>(
              <div key={p.id} className={styles.alertItem}>
                <span className={styles.alertName}>{p.name}</span>
                <span className={styles.alertStock}>{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
