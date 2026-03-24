import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../utils/api'
import ProductCard from '../../components/buyer/ProductCard'
import styles from './HomePage.module.css'

const TABS = ['new', 'trending', 'bestsellers']
const TAB_LABELS = { new: 'New Arrivals', trending: 'Trending', bestsellers: 'Best Sellers' }

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('new')

  const { data: tabProducts = [] } = useQuery({
    queryKey: ['products', activeTab],
    queryFn: () => api.get(`/products/${activeTab}`).then(r => r.data),
  })

  return (
    <div>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🌿 Sustainably Made in the Philippines</div>
          <h1>Natural Beauty from <em>Coconut Coir</em></h1>
          <p>Handcrafted products made from coconut husk fiber — honoring Filipino craftsmanship and the abundance of our tropical land. Every piece tells a story of heritage and sustainability.</p>
          <div className={styles.heroCta}>
            <Link to="/products" className={styles.btnHeroPrimary}>Shop Now</Link>
            <Link to="/storefront" className={styles.btnHeroOutline}>View Storefront</Link>
          </div>
        </div>
        <div className={styles.heroCards}>
          <div className={styles.heroCard}>
            <span>🧺</span>
            <div className={styles.heroCardName}>Coir Basket</div>
            <div className={styles.heroCardPrice}>₱ 380</div>
          </div>
          <div className={`${styles.heroCard} ${styles.heroCardFeat}`}>
            <span>🪴</span>
            <div className={styles.heroCardName}>Coir Pot</div>
            <div className={styles.heroCardPrice}>₱ 250</div>
          </div>
          <div className={styles.heroCard}>
            <span>🏠</span>
            <div className={styles.heroCardName}>Coir Mat</div>
            <div className={styles.heroCardPrice}>₱ 520</div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}><span>🌿</span><span>100% Natural Fiber</span></div>
        <div className={styles.trustItem}><span>🚚</span><span>Nationwide Delivery</span></div>
        <div className={styles.trustItem}><span>🤝</span><span>Support Local Artisans</span></div>
        <div className={styles.trustItem}><span>♻️</span><span>Eco-Friendly Products</span></div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Mga Produkto · Our Products</span>
            <h2>Discover Our Collection</h2>
            <p>Handwoven with care from the rich coconut husks of the Philippine archipelago</p>
          </div>

          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {tabProducts.slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className={styles.viewAll}>
            <Link to="/products" className="btn-secondary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT BANNER ── */}
      <section className={styles.aboutBanner}>
        <div className="container">
          <div className={styles.aboutInner}>
            <div className={styles.aboutContent}>
              <h2>Rooted in <em>Filipino</em> Tradition</h2>
              <p>CoirCraft PH bridges the gap between ancient Filipino weaving traditions and the modern consumer. Every product is sourced, made, and shipped from the heart of the Philippine coconut belt — supporting local farming communities along the way.</p>
              <div className={styles.stats}>
                <div className={styles.stat}><div className={styles.statNum}>200+</div><div className={styles.statLabel}>Products</div></div>
                <div className={styles.stat}><div className={styles.statNum}>50+</div><div className={styles.statLabel}>Artisans</div></div>
                <div className={styles.stat}><div className={styles.statNum}>3K+</div><div className={styles.statLabel}>Happy Buyers</div></div>
              </div>
              <Link to="/products" className={styles.btnAbout}>Shop Now</Link>
            </div>
            <div className={styles.aboutEmoji}>🥥</div>
          </div>
        </div>
      </section>
    </div>
  )
}
