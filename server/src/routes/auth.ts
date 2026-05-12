import express from 'express'
import { auth } from '../middleware/auth.js'
import { CustomRequest, AppError } from '../middleware/errorHandler.js'
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Sign up
router.post('/signup', async (req: CustomRequest, res) => {
  try {
    const { name, email, password, userType } = req.body
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' })
    }
    
    const user = new User({
      name,
      email,
      password,
      userType: userType || 'tenant',
    })
    
    await user.save()
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Sign up failed' })
  }
})

// Login
router.post('/login', async (req: CustomRequest, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        verified: user.verified,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get profile
router.get('/profile', auth, async (req: CustomRequest, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

export default router
