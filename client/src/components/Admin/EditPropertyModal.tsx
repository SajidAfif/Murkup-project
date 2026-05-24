import React, { useState } from 'react'
import MapPicker from '../MapPicker'

interface EditPropertyModalProps {
  property: any
  onClose: () => void
  onSave: (id: string, data: any) => Promise<void>
}

export default function EditPropertyModal({ property, onClose, onSave }: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: property.title || '',
    description: property.description || '',
    price: property.price || 0,
    propertyType: property.propertyType || 'flat',
    rentalType: property.rentalType || 'rent',
    rooms: property.rooms || 0,
    bathrooms: property.bathrooms || 0,
    sqft: property.sqft || 0,
    furnishing: property.furnishing || 'unfurnished',
    available: property.available !== undefined ? property.available : true,
    latitude: property.location?.latitude || 23.8103,
    longitude: property.location?.longitude || 90.4125,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const updateData = {
      ...formData,
      location: {
        ...property.location,
        latitude: formData.latitude,
        longitude: formData.longitude
      }
    }
    await onSave(property._id, updateData)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Location (Map)</label>
              <p className="text-sm text-gray-500 mb-2">Click to update coordinates</p>
              <MapPicker
                initialLat={formData.latitude}
                initialLng={formData.longitude}
                onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (৳)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Size (sqft)</label>
              <input
                type="number"
                min="0"
                value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="flat">Flat</option>
                <option value="room">Room</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="hostel">Hostel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rental Type</label>
              <select
                value={formData.rentalType}
                onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
                <option value="sublet">Sublet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rooms</label>
              <input
                type="number"
                min="0"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Furnishing</label>
              <select
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-8">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="available" className="text-sm font-medium">Currently Available</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
