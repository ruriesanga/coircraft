import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import styles from './StorefrontManagePage.module.css'

export default function StorefrontManagePage() {
  const qc = useQueryClient()
  const [storeName, setStoreName]   = useState('')
  const [description, setDescription] = useState('')
  const [featuredIds, setFeaturedIds] = useState([])

  const { data } = useQuery({
    queryKey:['storefrontMgmt'],
    queryFn:()=>api.get('/seller/storefront').then(r=>r.data),
    onSuccess:(d)=>{ setStoreName(d.seller.store_name); setDescription(d.seller.description||''); setFeaturedIds(d.featured_products.map(p=>p.id)) }
  })
  const { data: allProducts } = useQuery({ queryKey:['sellerProductsList'], queryFn:()=>api.get('/seller/products').then(r=>r.data) })

  const mutation = useMutation({
    mutationFn: () => api.put('/seller/storefront',{ store_name:storeName, description, featured_ids:featuredIds }),
    onSuccess: () => { qc.invalidateQueries(['storefrontMgmt']); toast.success('Storefront updated!') },
    onError: () => toast.error('Update failed'),
  })

  const toggleFeatured = (id) => setFeaturedIds(ids => ids.includes(id) ? ids.filter(i=>i!==id) : [...ids, id])

  return (
    <div>
      <h1 className={styles.pageTitle}>Storefront Management</h1>
      <div className={styles.layout}>
        <div className={styles.card}>
          <h3>Store Information</h3>
          <div className={styles.field}><label>Store Name</label>
            <input value={storeName} onChange={e=>setStoreName(e.target.value)} placeholder="Your store name"/>
          </div>
          <div className={styles.field}><label>Store Description</label>
            <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe your store..."/>
          </div>
        </div>
        <div className={styles.card}>
          <h3>Featured Products</h3>
          <p className={styles.hint}>Select products to feature on the storefront</p>
          <div className={styles.productList}>
            {allProducts?.data?.map(p=>(
              <label key={p.id} className={`${styles.productItem} ${featuredIds.includes(p.id)?styles.productSelected:''}`}>
                <input type="checkbox" checked={featuredIds.includes(p.id)} onChange={()=>toggleFeatured(p.id)} style={{width:'auto'}}/>
                <div>
                  <div className={styles.productItemName}>{p.name}</div>
                  <div className={styles.productItemPrice}>₱ {Number(p.price).toLocaleString()}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.saveRow}>
        <button className={styles.saveBtn} onClick={()=>mutation.mutate()} disabled={mutation.isLoading}>{mutation.isLoading?'Saving...':'Save Storefront Changes'}</button>
      </div>
    </div>
  )
}
