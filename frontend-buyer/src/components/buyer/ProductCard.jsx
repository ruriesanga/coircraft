import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

// Shown only when no product image has been uploaded yet
const FALLBACK_EMOJIS = ['🧺','🌱','🪑','🪴','🏠','🌿','🎋','🛖']
const BG_COLORS = [
  'linear-gradient(135deg,#FDF0E0,#F5DEB3)',
  'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
  'linear-gradient(135deg,#FFF3E0,#FFE0B2)',
  'linear-gradient(135deg,#F3E5F5,#E1BEE7)',
]

export default function ProductCard({ product }) {
  const { user }      = useAuth()
  const { addToCart } = useCart()
  const navigate      = useNavigate()
  const [imgError, setImgError] = useState(false)

  const idx      = product.id % 4
  const hasImage = product.image_url && !imgError

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to add to cart'); navigate('/login'); return }
    await addToCart(product.id, 1)
  }

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div
        className={styles.imgBox}
        style={{ background: hasImage ? '#f7f0e8' : BG_COLORS[idx] }}
      >
        {hasImage ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.img}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={styles.emoji}>{FALLBACK_EMOJIS[product.id % 8]}</span>
        )}
        {product.is_featured   && <span className={`${styles.badge} ${styles.badgeFeat}`}>Featured</span>}
        {product.is_trending   && <span className={`${styles.badge} ${styles.badgeTrend}`}>Hot</span>}
        {product.is_bestseller && <span className={`${styles.badge} ${styles.badgeBest}`}>Best Seller</span>}
        {product.stock === 0   && <div className={styles.soldOut}>Sold Out</div>}
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.desc}>{product.description?.substring(0,70)}...</div>
        <div className={styles.footer}>
          <div className={styles.price}>
            ₱ {Number(product.price).toLocaleString()}
          </div>
          <button
            className={styles.addBtn}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
