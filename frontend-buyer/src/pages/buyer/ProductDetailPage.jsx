import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './ProductDetailPage.module.css'

const FALLBACK_EMOJIS = ['🧺','🌱','🪑','🪴','🏠','🌿','🎋','🛖']
const BG_COLORS = [
  'linear-gradient(135deg,#FDF0E0,#F5DEB3)',
  'linear-gradient(135deg,#E8F5E9,#C8E6C9)',
  'linear-gradient(135deg,#FFF3E0,#FFE0B2)',
  'linear-gradient(135deg,#F3E5F5,#E1BEE7)',
]

const BACKEND_URL = 'http://127.0.0.1:8000'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [imgError, setImgError] = useState(false)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data),
  })

  const handleAdd = async () => {
    if (!user) {
      toast.error('Please login first')
      navigate('/login')
      return
    }
    await addToCart(product.id, qty)
  }

  if (isLoading) return <div className={styles.loading}>Loading product...</div>
  if (!product) return <div className={styles.loading}>Product not found.</div>

  const imageSrc = product.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : `${BACKEND_URL}${product.image_url}`
    : null

  const hasImage = imageSrc && !imgError
  const bgStyle = hasImage
    ? { background: '#f7f0e8' }
    : { background: BG_COLORS[product.id % 4] }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <span onClick={() => navigate('/products')} className={styles.breadLink}>Products</span>
          <span> / </span>
          <span>{product.name}</span>
        </div>

        <div className={styles.detail}>
          <div className={styles.imgBox} style={bgStyle}>
            {hasImage ? (
              <img
                src={imageSrc}
                alt={product.name}
                className={styles.img}
                onError={() => setImgError(true)}
              />
            ) : (
              <span className={styles.emoji}>{FALLBACK_EMOJIS[product.id % 8]}</span>
            )}
          </div>

          <div className={styles.info}>
            {product.category && <span className={styles.cat}>{product.category.name}</span>}
            <h1>{product.name}</h1>
            <div className={styles.price}>₱ {Number(product.price).toLocaleString()}</div>
            <p className={styles.desc}>{product.description}</p>

            <div className={styles.stock}>
              {product.stock > 0
                ? <span className={styles.inStock}>✓ In Stock ({product.stock} available)</span>
                : <span className={styles.outStock}>✗ Out of Stock</span>}
            </div>

            {product.stock > 0 && (
              <div className={styles.qtyRow}>
                <label>Quantity</label>
                <div className={styles.qtyCtrl}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <button className={styles.addBtn} onClick={handleAdd} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}