import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { SellerAuthProvider } from './context/SellerAuthContext'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SellerAuthProvider>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#5C3A1E', color: '#FDF6EC', fontFamily: 'Lato, sans-serif' }
          }} />
        </SellerAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
