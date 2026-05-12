import mongoose from 'mongoose'

interface IProperty {
  title: string
  description: string
  owner: mongoose.Schema.Types.ObjectId
  propertyType: 'flat' | 'room' | 'office' | 'shop' | 'hostel'
  rentalType: 'rent' | 'sale' | 'sublet'
  price: number
  location: {
    address: string
    city: string
    latitude: number
    longitude: number
  }
  rooms?: number
  bathrooms?: number
  furnishing: 'furnished' | 'unfurnished' | 'semi-furnished'
  sqft?: number
  floor?: number
  images: string[]
  amenities: string[]
  available: boolean
  code: string
  createdAt: Date
}

const propertySchema = new mongoose.Schema<IProperty>(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['flat', 'room', 'office', 'shop', 'hostel'],
      required: true,
    },
    rentalType: {
      type: String,
      enum: ['rent', 'sale', 'sublet'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      address: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    rooms: Number,
    bathrooms: Number,
    furnishing: {
      type: String,
      enum: ['furnished', 'unfurnished', 'semi-furnished'],
    },
    sqft: Number,
    floor: Number,
    images: [String],
    amenities: [String],
    available: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

export const Property = mongoose.model<IProperty>('Property', propertySchema)
