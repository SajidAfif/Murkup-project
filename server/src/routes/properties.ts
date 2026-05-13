import express from 'express'
import multer from 'multer'
import path from 'path'
import { auth } from '../middleware/auth.js'
import { Property } from '../models/Property.js'
import { User } from '../models/User.js'
import fs from 'fs'
import path from 'path'

const router = express.Router()

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const { propertyType, rentalType, minPrice, maxPrice, city, furnishing } = req.query

    const filter: any = { available: true }

    if (propertyType) filter.propertyType = propertyType
    if (rentalType) filter.rentalType = rentalType
    if (city) filter['location.city'] = city
    if (furnishing) filter.furnishing = furnishing

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    let properties = await Property.find(filter).populate('owner', 'name phone email')
    // Convert stored paths to absolute URLs so frontend can load images
    const base = `${req.protocol}://${req.get('host')}`
    properties = properties.map((p: any) => {
      const obj = p.toObject ? p.toObject() : p
      obj.images = (obj.images || []).map((img: string) => (img.startsWith('http') ? img : `${base}/${img}`))
      return obj
    })
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' })
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/properties'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.random().toString(36).slice(2)
    const ext = path.extname(file.originalname || '') || ''
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    const allowedMimes = new Set([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/x-icon',
      'image/vnd.microsoft.icon',
      'image/heif',
      'image/heic',
      'image/avif',
    ])

    const allowedExts = new Set([
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
      '.bmp',
      '.tiff',
      '.ico',
      '.heic',
      '.heif',
      '.avif',
      '.jfif',
    ])

    const ext = path.extname(file.originalname || '').toLowerCase()
    if (allowedMimes.has(file.mimetype) || allowedExts.has(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Unsupported file type'))
    }
  },
})

// Create property (owners only). Accepts multipart/form-data with images[]
router.post('/', auth, upload.array('images', 6), async (req, res) => {
  try {
    const requestingUser = await User.findById(req.userId)
    if (!requestingUser || requestingUser.userType !== 'owner') {
      return res.status(403).json({ error: 'Only owners can create properties' })
    }
    // Require owners to be verified (NID/passport) before posting
    if (!requestingUser.verified) {
      return res.status(403).json({ error: 'Owner must be verified with NID or passport before posting properties' })
    }

    const { title, description, propertyType, rentalType, price, location, rooms, bathrooms, furnishing, sqft, amenities } = req.body

    // Parse location if sent as JSON string
    let parsedLocation = location
    try {
      if (location && typeof location === 'string') parsedLocation = JSON.parse(location)
    } catch (err) {
      parsedLocation = location
    }

    const images = (req.files as any[] | undefined)?.map((f) => f.path) || []

    const property = new Property({
      title,
      description,
      owner: req.userId,
      propertyType,
      rentalType,
      price: Number(price),
      location: parsedLocation,
      rooms: rooms ? Number(rooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      furnishing,
      sqft: sqft ? Number(sqft) : undefined,
      images,
      amenities: amenities && typeof amenities === 'string' ? JSON.parse(amenities) : amenities,
      code: `PROP-${Date.now()}`,
    })

    await property.save()
    // return with absolute image urls
    const base = `${req.protocol}://${req.get('host')}`
    const obj = property.toObject()
    obj.images = (obj.images || []).map((img: string) => (img.startsWith('http') ? img : `${base}/${img}`))
    res.status(201).json(obj)
  } catch (error) {
    console.error('Create property error:', error)
    res.status(500).json({ error: 'Failed to create property' })
  }
})

// Update property (owner can update their own property). Accepts multipart (images to add) and JSON fields.
router.patch('/:id', auth, upload.array('images', 6), async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id)
    if (!prop) return res.status(404).json({ error: 'Property not found' })

    // Only owner or admin can update
    const requestingUser = await User.findById(req.userId)
    if (!requestingUser) return res.status(403).json({ error: 'Unauthorized' })
    if (requestingUser.userType !== 'admin' && prop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only the owner or admin can edit this property' })
    }

    const { title, description, propertyType, rentalType, price, location, rooms, bathrooms, furnishing, sqft, amenities, deletedImages } = req.body

    if (title !== undefined) prop.title = title
    if (description !== undefined) prop.description = description
    if (propertyType !== undefined) prop.propertyType = propertyType
    if (rentalType !== undefined) prop.rentalType = rentalType
    if (price !== undefined) prop.price = Number(price)
    if (rooms !== undefined) prop.rooms = rooms ? Number(rooms) : undefined
    if (bathrooms !== undefined) prop.bathrooms = bathrooms ? Number(bathrooms) : undefined
    if (furnishing !== undefined) prop.furnishing = furnishing
    if (sqft !== undefined) prop.sqft = sqft ? Number(sqft) : undefined
    if (amenities !== undefined) prop.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities

    // Parse location if sent as JSON string
    if (location) {
      try {
        prop.location = typeof location === 'string' ? JSON.parse(location) : location
      } catch (err) {
        prop.location = location
      }
    }

    // Handle deleted images (array of paths)
    if (deletedImages) {
      let del = deletedImages
      try {
        if (typeof deletedImages === 'string') del = JSON.parse(deletedImages)
      } catch (err) {
        // ignore
      }
      if (Array.isArray(del)) {
        prop.images = (prop.images || []).filter((img: string) => {
          if (del.includes(img)) {
            // try remove file from disk
            try {
              const p = path.isAbsolute(img) ? img : path.join(process.cwd(), img)
              if (fs.existsSync(p)) fs.unlinkSync(p)
            } catch (e) {}
            return false
          }
          return true
        })
      }
    }

    // Add new uploaded images (append)
    const added = (req.files as any[] | undefined)?.map((f) => f.path) || []
    if (added.length > 0) prop.images = (prop.images || []).concat(added)

    await prop.save()

    const base = `${req.protocol}://${req.get('host')}`
    const obj = prop.toObject()
    obj.images = (obj.images || []).map((img: string) => (img.startsWith('http') ? img : `${base}/${img}`))
    res.json(obj)
  } catch (error) {
    console.error('Update property error:', error)
    res.status(500).json({ error: 'Failed to update property' })
  }
})

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner')
    if (!property) return res.status(404).json({ error: 'Property not found' })
    const base = `${req.protocol}://${req.get('host')}`
    const obj = property.toObject()
    obj.images = (obj.images || []).map((img: string) => (img.startsWith('http') ? img : `${base}/${img}`))
    res.json(obj)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' })
  }
})

// Toggle like for a property
router.post('/:id/like', auth, async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id)
    if (!prop) return res.status(404).json({ error: 'Property not found' })

    const userId = req.userId
    const idx = (prop as any).likes?.findIndex((u: any) => u.toString() === userId)
    let liked = false
    if (idx >= 0) {
      // remove
      (prop as any).likes.splice(idx, 1)
      liked = false
    } else {
      (prop as any).likes = (prop as any).likes || []
      ;(prop as any).likes.push(userId)
      liked = true
    }

    await prop.save()
    res.json({ liked, likesCount: (prop as any).likes.length })
  } catch (error) {
    console.error('Like toggle error:', error)
    res.status(500).json({ error: 'Failed to toggle like' })
  }
})

export default router
