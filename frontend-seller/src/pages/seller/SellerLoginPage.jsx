import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSellerAuth } from '../../context/SellerAuthContext'
import toast from 'react-hot-toast'
import styles from './SellerLoginPage.module.css'

export default function SellerLoginPage() {
  const { login } = useSellerAuth()
  const navigate  = useNavigate()
  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm()

  const onSubmit = async (data) => {
    try { await login(data.email, data.password); toast.success('Welcome back!'); navigate('/dashboard') }
    catch(e) { toast.error(e.response?.data?.message || 'Invalid credentials') }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>🥥</div>
          <h2>Seller Login</h2>
          <p>CoirCraft PH — Seller Dashboard</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}><label>Email</label>
            <input type="email" {...register('email',{required:'Required'})} placeholder="seller@coircraft.ph"/>
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>
          <div className={styles.field}><label>Password</label>
            <input type="password" {...register('password',{required:'Required'})} placeholder="••••••••"/>
            {errors.password && <span className="error-msg">{errors.password.message}</span>}
          </div>
          <button type="submit" className={styles.btn} disabled={isSubmitting}>{isSubmitting?'Signing in...':'Sign In to Dashboard'}</button>
        </form>
        <p className={styles.disclaimer}>For educational purposes only, and no copyright infringement is intended.</p>
      </div>
    </div>
  )
}
