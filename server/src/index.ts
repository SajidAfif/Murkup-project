import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import adminRoutes from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 5000

// Database connection
await connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/admin', adminRoutes)

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

// Ensure uploads directories exist
const uploadsDir = path.join(process.cwd(), 'uploads')
const verificationDir = path.join(uploadsDir, 'verification')
const propertiesDir = path.join(uploadsDir, 'properties')
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
  if (!fs.existsSync(verificationDir)) fs.mkdirSync(verificationDir)
  if (!fs.existsSync(propertiesDir)) fs.mkdirSync(propertiesDir)
} catch (err) {
  console.error('Failed to create uploads directories', err)
}
