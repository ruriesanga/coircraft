import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import api from '../../utils/api'
import styles from './ReportsPage.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ReportsPage() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()+1)

  const { data: daily }   = useQuery({ queryKey:['daily'],          queryFn:()=>api.get('/seller/reports/daily').then(r=>r.data) })
  const { data: monthly } = useQuery({ queryKey:['monthly',year,month], queryFn:()=>api.get('/seller/reports/monthly',{params:{year,month}}).then(r=>r.data), keepPreviousData:true })

  const chartData = {
    labels: monthly?.daily?.map(d=>`Day ${d.day}`) || [],
    datasets: [{
      label: 'Daily Sales (₱)',
      data: monthly?.daily?.map(d=>d.total_sales) || [],
      backgroundColor: 'rgba(92,58,30,0.7)',
      borderColor: '#5C3A1E',
      borderWidth: 1,
      borderRadius: 4,
    }],
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

  return (
    <div>
      <h1 className={styles.pageTitle}>Sales Reports</h1>

      <div className={styles.metricRow}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>☀️</div>
          <div className={styles.metricValue}>₱ {Number(daily?.report?.total_sales||0).toLocaleString()}</div>
          <div className={styles.metricLabel}>Today's Total Sales</div>
          <div className={styles.metricSub}>{daily?.report?.order_count||0} orders · {daily?.report?.items_sold||0} items</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📅</div>
          <div className={styles.metricValue}>₱ {Number(monthly?.totals?.total_sales||0).toLocaleString()}</div>
          <div className={styles.metricLabel}>This Month's Total Sales</div>
          <div className={styles.metricSub}>{monthly?.totals?.order_count||0} orders · {monthly?.totals?.items_sold||0} items</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3>Monthly Sales Breakdown</h3>
          <div className={styles.chartControls}>
            <select value={month} onChange={e=>setMonth(+e.target.value)}>
              {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
            </select>
            <select value={year} onChange={e=>setYear(+e.target.value)}>
              {[2023,2024,2025,2026].map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.chart}>
          {monthly?.daily?.length > 0
            ? <Bar data={chartData} options={{ responsive:true, plugins:{ legend:{display:false} }, scales:{ y:{ beginAtZero:true, ticks:{ callback:v=>`₱${v.toLocaleString()}` } } } }}/>
            : <div className={styles.noData}>No sales data for this period</div>
          }
        </div>
      </div>
    </div>
  )
}
