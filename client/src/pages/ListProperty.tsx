import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, MapPin, AlertCircle } from 'lucide-react'
import { propertyService } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function ListProperty() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'flat',
    rentalType: 'rent',
    price: '',
    address: '',
    city: 'Dhaka',
    rooms: '',
    bathrooms: '',
    furnishing: 'unfurnished',
    sqft: '',
    floor: '',
    amenities: '',
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const amenities = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a)

      const data = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        rentalType: formData.rentalType,
        price: Number(formData.price),
        location: {
          address: formData.address,
          city: formData.city,
          latitude: 0,
          longitude: 0,
        },
        rooms: formData.rooms ? Number(formData.rooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        furnishing: formData.furnishing,
        sqft: formData.sqft ? Number(formData.sqft) : undefined,
        floor: formData.floor ? Number(formData.floor) : undefined,
        images: [],
        amenities,
      }

      await propertyService.create(data)
      toast.success('Property listed successfully!')
      navigate('/search')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to list property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">List Your Property</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Reach thousands of potential tenants. Fill in the details below to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="border-t pt-6 first:border-t-0 first:pt-0">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Beautiful 2BHK Apartment in Dhaka"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your property..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Type Info */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Property Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="flat">Flat/Apartment</option>
                  <option value="room">Room</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">For *</label>
                <select
                  name="rentalType"
                  value={formData.rentalType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                  <option value="sublet">Sublet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Furnishing</label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="furnished">Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Location</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Address details will be used for map integration
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Street address"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Khulna">Khulna</option>
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rooms</label>
                <input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Size (sqft)</label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleChange}
                  placeholder="e.g., 1200"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Floor</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Price {formData.rentalType === 'rent' ? '(per month)' : ''} *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="Enter price"
                  className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                List amenities (comma-separated)
              </label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., WiFi, Air Conditioning, Gym, Swimming Pool, Parking"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="border-t pt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Listing...' : 'List Property'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
