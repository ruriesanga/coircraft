import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import ProductCard from '../../components/buyer/ProductCard'
import styles from './ProductsPage.module.css'

export default function ProductsPage() {
  const [search, setSearch]   = useState('')
  const [sort, setSort]       = useState('created_at')
  const [page, setPage]       = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['allProducts', debouncedSearch, sort, page],
    queryFn: () => api.get('/products', { params:{ search:debouncedSearch, sort, page } }).then(r=>r.data),
  })

  let timer
  const handleSearch = (v) => {
    setSearch(v)
    clearTimeout(timer)
    timer = setTimeout(()=>{ setDebouncedSearch(v); setPage(1) },400)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1>All Products</h1>
          <p>Explore our complete collection of handcrafted coconut coir items</p>
        </div>
      </div>
      <div className="container">
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="🔍 Search products..."
            value={search}
            onChange={e=>handleSearch(e.target.value)}
          />
          <select value={sort} onChange={e=>setSort(e.target.value)} className={styles.sort}>
            <option value="created_at">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="sales_count">Most Popular</option>
          </select>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Loading products...</div>
        ) : (
          <>
            <div className={styles.grid}>
              {data?.data?.map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
            {data?.last_page > 1 && (
              <div className={styles.pagination}>
                {Array.from({length:data.last_page},(_,i)=>i+1).map(n=>(
                  <button key={n} className={`${styles.pageBtn} ${page===n?styles.pageBtnActive:''}`} onClick={()=>setPage(n)}>{n}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
