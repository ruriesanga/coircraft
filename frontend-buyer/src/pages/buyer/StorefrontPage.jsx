import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import ProductCard from '../../components/buyer/ProductCard'
import styles from './StorefrontPage.module.css'

export default function StorefrontPage() {
  const { data: featured = [] } = useQuery({ queryKey:['featured'], queryFn:()=>api.get('/products/featured').then(r=>r.data) })
  const { data: newArr = [] }   = useQuery({ queryKey:['new'],      queryFn:()=>api.get('/products/new').then(r=>r.data) })
  const { data: trending = [] } = useQuery({ queryKey:['trending'], queryFn:()=>api.get('/products/trending').then(r=>r.data) })
  const { data: best = [] }     = useQuery({ queryKey:['best'],     queryFn:()=>api.get('/products/bestsellers').then(r=>r.data) })

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.bannerPattern}/>
        <div className={styles.bannerContent}>
          <span className={styles.eyebrow}>Tindahan · Our Store</span>
          <h1>CoirCraft PH Storefront</h1>
          <p>Browse our curated collections of handcrafted coconut coir products</p>
        </div>
      </div>

      <div className="container">
        {[{label:'✨ Featured Products',data:featured},{label:'🆕 New Arrivals',data:newArr},{label:'🔥 Trending Now',data:trending},{label:'⭐ Best Sellers',data:best}]
          .filter(s=>s.data.length>0)
          .map(section=>(
          <section key={section.label} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.label}</h2>
            <div className={styles.grid}>
              {section.data.slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
