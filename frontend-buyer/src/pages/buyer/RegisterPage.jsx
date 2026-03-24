import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './AuthPage.module.css'

const schema = yup.object({
  full_name:             yup.string().required('Full name is required'),
  email:                 yup.string().email('Invalid email format').required('Email is required'),
  password:              yup.string().min(8,'At least 8 characters').required('Password is required'),
  password_confirmation: yup.string().oneOf([yup.ref('password')],'Passwords do not match').required('Please confirm password'),
  mobile_number:         yup.string().matches(/^[0-9+\-\s]{7,15}$/,'Invalid mobile number').required('Mobile number is required'),
  address:               yup.string().required('Address is required'),
})

export default function RegisterPage() {
  const { register: regCtx } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await regCtx(data)
      toast.success('Account created! Welcome to CoirCraft PH 🥥')
      navigate('/')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <div className={styles.header}>
          <div className={styles.logo}>🥥</div>
          <h2>Create Account</h2>
          <p>Join CoirCraft PH — support local artisans!</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input placeholder="Juan dela Cruz" {...register('full_name')} />
              {errors.full_name && <span className="error-msg">{errors.full_name.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" placeholder="juan@example.ph" {...register('email')} />
              {errors.email && <span className="error-msg">{errors.email.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input type="password" placeholder="Min. 8 characters" {...register('password')} />
              {errors.password && <span className="error-msg">{errors.password.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Confirm Password</label>
              <input type="password" placeholder="Re-enter password" {...register('password_confirmation')} />
              {errors.password_confirmation && <span className="error-msg">{errors.password_confirmation.message}</span>}
            </div>
            <div className={styles.field}>
              <label>Mobile Number</label>
              <input placeholder="09171234567" {...register('mobile_number')} />
              {errors.mobile_number && <span className="error-msg">{errors.mobile_number.message}</span>}
            </div>
          </div>
          <div className={styles.field}>
            <label>Complete Address</label>
            <textarea rows={3} placeholder="House No., Street, Barangay, City, Province" {...register('address')} />
            {errors.address && <span className="error-msg">{errors.address.message}</span>}
          </div>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
