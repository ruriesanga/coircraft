import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { register, handleSubmit, formState:{isSubmitting} } = useForm({
    defaultValues:{ full_name:user?.full_name||'', mobile_number:user?.mobile_number||'', address:user?.address||'' }
  })

  const onSubmit = async (data) => {
    try { await api.put('/profile', data); toast.success('Profile updated!') }
    catch { toast.error('Update failed') }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.sidebar}>
            <div className={styles.avatar}>{user?.full_name?.charAt(0).toUpperCase()}</div>
            <div className={styles.name}>{user?.full_name}</div>
            <div className={styles.email}>{user?.email}</div>
            <button className={styles.logoutBtn} onClick={logout}>Sign Out</button>
          </div>
          <div className={styles.main}>
            <div className={styles.card}>
              <h2>Personal Information</h2>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.field}><label>Full Name</label><input {...register('full_name')}/></div>
                <div className={styles.field}><label>Email Address</label><input value={user?.email} disabled className={styles.disabled}/></div>
                <div className={styles.field}><label>Mobile Number</label><input {...register('mobile_number')}/></div>
                <div className={styles.field}><label>Address</label><textarea rows={3} {...register('address')}/></div>
                <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>{isSubmitting?'Saving...':'Save Changes'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
