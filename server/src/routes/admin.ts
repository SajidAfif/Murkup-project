import express from 'express'
import { auth } from '../middleware/auth.js'
import { adminOnly } from '../middleware/admin.js'
import { User } from '../models/User.js'
import { Property } from '../models/Property.js'

const router = express.Router()

// Users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

router.get('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.patch('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowed = ['name', 'email', 'userType', 'verified', 'nid']
    const isValid = updates.every((u) => allowed.includes(u))
    if (!isValid) return res.status(400).json({ error: 'Invalid updates' })

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Properties
router.get('/properties', auth, adminOnly, async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email')
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' })
  }
})

router.get('/properties/:id', auth, adminOnly, async (req, res) => {
  try {
    const p = await Property.findById(req.params.id).populate('owner')
    if (!p) return res.status(404).json({ error: 'Property not found' })
    res.json(p)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' })
  }
})

router.patch('/properties/:id', auth, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!property) return res.status(404).json({ error: 'Property not found' })
    res.json(property)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' })
  }
})

router.delete('/properties/:id', auth, adminOnly, async (req, res) => {
  try {
    const p = await Property.findByIdAndDelete(req.params.id)
    if (!p) return res.status(404).json({ error: 'Property not found' })
    res.json({ message: 'Property deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' })
  }
})

// Admin can create property on behalf of any owner
router.post('/properties', auth, adminOnly, async (req, res) => {
  try {
    const { ownerId, ...data } = req.body
    if (!ownerId) return res.status(400).json({ error: 'ownerId is required' })
    const property = new Property({ ...data, owner: ownerId })
    await property.save()
    res.status(201).json(property)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' })
  }
})

export default router
