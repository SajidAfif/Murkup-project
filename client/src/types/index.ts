export interface User {
  id: string
  _id?: string
  name: string
  email: string
  userType: 'tenant' | 'owner' | 'admin'
  verified: boolean
  isBlocked?: boolean
  profileImage?: string
  phone?: string
}

export interface SiteSettings {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  phone?: string
  email?: string
}

export interface Property {
  _id: string
  title: string
  description: string
  owner: User
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
  createdAt: string
}

export interface Review {
  _id: string
  property: string
  reviewer: User
  rating: number
  comment: string
  createdAt: string
}

export interface BookingSlot {
  _id: string
  property: string
  visitor: User
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
}
