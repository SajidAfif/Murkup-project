import express from 'express'
import { auth } from '../middleware/auth.js'
import { Property } from '../models/Property.js'

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
    
    const properties = await Property.find(filter).populate('owner', 'name phone email')
    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' })
  }
})

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner')
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json(property)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' })
  }
})

// Create property
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, propertyType, rentalType, price, location, rooms, bathrooms, furnishing, sqft, images, amenities } = req.body
    
    const property = new Property({
      title,
      description,
      owner: req.userId,
      propertyType,
      rentalType,
      price,
      location,
      rooms,
      bathrooms,
      furnishing,
      sqft,
      images,
      amenities,
      code: `PROP-${Date.now()}`,
    })
    
    await property.save()
    res.status(201).json(property)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create property' })
  }
})

export default router
