require('dotenv').config()
const express   = require('express')
const http      = require('http')
const { Server } = require('socket.io')
const cors      = require('cors')

const app    = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_BUYER_URL  || 'http://localhost:5173',
      process.env.FRONTEND_SELLER_URL || 'http://localhost:5174',
    ],
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

// ── Health check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'CoirCraft Node Service', timestamp: new Date() })
})

// ── Order status webhook (called by Laravel after order update) ──
app.post('/webhook/order-updated', (req, res) => {
  const { order_id, user_id, status, order_number } = req.body
  // Notify buyer in real-time
  io.to(`user_${user_id}`).emit('order_status_updated', { order_id, status, order_number })
  // Notify seller dashboard
  io.to('sellers').emit('new_order_notification', { order_id, order_number, status })
  res.json({ sent: true })
})

// ── Socket.IO ────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  // Buyer joins their personal room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`)
    console.log(`User ${userId} joined their room`)
  })

  // Seller joins seller dashboard room
  socket.on('join_seller_room', () => {
    socket.join('sellers')
    console.log(`Seller joined seller room`)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`\n🥥 CoirCraft Node Service running on port ${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/health\n`)
})
