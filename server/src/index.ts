import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000

// Database connection
await connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handler
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
