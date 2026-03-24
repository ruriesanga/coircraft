import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import styles from './InventoryPage.module.css'

export default function InventoryPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const qc = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting }
  } = useForm()

  // Watch the file input live so we can read it on submit
  const watchedImage = watch('image')

  const { data, isLoading } = useQuery({
    queryKey: ['sellerProducts'],
    queryFn: () => api.get('/seller/products').then(r => r.data)
  })

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const fd = new FormData()
      const boolFields = ['is_featured', 'is_trending', 'is_bestseller', 'is_active']

      // Append all non-image, non-empty fields
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'image') return
        if (v === undefined || v === null || v === '') return
        if (boolFields.includes(k)) {
          fd.append(k, v ? '1' : '0')
          return
        }
        fd.append(k, v)
      })

      // Read the file from the watched value — FileList from the input
      const fileList = watchedImage
      const file = fileList?.[0]
      if (file && file instanceof File && file.size > 0) {
        fd.append('image', file)
      }

      if (editing) {
        return api.post(`/seller/products/${editing.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      return api.post('/seller/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      qc.invalidateQueries(['sellerProducts'])
      toast.success(editing ? 'Product updated!' : 'Product added!')
      closeModal()
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to save product'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/seller/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(['sellerProducts'])
      toast.success('Product deleted')
    },
  })

  const openEdit = (p) => {
    setEditing(p)
    setShowModal(true)
    setTimeout(() => {
      // Set all fields EXCEPT image — never pre-fill file inputs
      Object.entries(p).forEach(([k, v]) => {
        if (k === 'image') return
        setValue(k, v)
      })
    }, 0)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    reset()
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>Inventory Management</h1>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Add Product</button>
      </div>

      {isLoading ? <div className={styles.loading}>Loading products...</div> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.prodCell}>
                      <div className={styles.prodThumb}>
                        {p.image_url
                          ? <img src={p.image_url} alt={p.name} onError={e => e.target.style.display = 'none'} />
                          : <span>🌿</span>
                        }
                      </div>
                      <div className={styles.prodName}>{p.name}</div>
                    </div>
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>₱ {Number(p.price).toLocaleString()}</td>
                  <td><span className={p.stock <= 10 ? styles.lowStock : ''}>{p.stock}</span></td>
                  <td>
                    <span className={`${styles.statusBadge} ${p.is_active ? styles.active : styles.inactive}`}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button className={styles.delBtn} onClick={() => {
                      if (confirm('Delete this product?')) deleteMutation.mutate(p.id)
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal} className={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className={styles.modalForm}>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label>Product Name *</label>
                  <input {...register('name', { required: true })} placeholder="e.g. Coir Doormat" />
                </div>
                <div className={styles.field}>
                  <label>Price (₱) *</label>
                  <input type="number" step="0.01" {...register('price', { required: true })} placeholder="0.00" />
                </div>
                <div className={styles.field}>
                  <label>Stock *</label>
                  <input type="number" {...register('stock', { required: true })} placeholder="0" />
                </div>
                <div className={styles.field}>
                  <label>Category</label>
                  <select {...register('category_id')}>
                    <option value="">Select category</option>
                    <option value="1">Mats & Rugs</option>
                    <option value="2">Baskets</option>
                    <option value="3">Garden & Planters</option>
                    <option value="4">Home Decor</option>
                    <option value="5">Storage</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>Description</label>
                <textarea rows={3} {...register('description')} placeholder="Product description..." />
              </div>

              <div className={styles.field}>
                <label>
                  Product Image
                  {editing?.image_url && (
                    <span className={styles.currentImg}> — current image will keep if no new file selected</span>
                  )}
                </label>
                {/* Use a plain ref-based input so we can always read FileList correctly */}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ padding: '6px' }}
                  {...register('image')}
                />
                {/* Preview the current image when editing */}
                {editing?.image_url && (
                  <img
                    src={editing.image_url}
                    alt="Current"
                    className={styles.previewImg}
                  />
                )}
              </div>

              <div className={styles.checkboxRow}>
                <label><input type="checkbox" {...register('is_featured')} /> Featured</label>
                <label><input type="checkbox" {...register('is_trending')} /> Trending</label>
                <label><input type="checkbox" {...register('is_bestseller')} /> Best Seller</label>
                <label><input type="checkbox" {...register('is_active')} defaultChecked /> Active</label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}