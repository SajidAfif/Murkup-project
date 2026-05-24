import { MapPin, Users, DoorOpen, Maximize2, Zap, Trash2, Star, UserCircle } from 'lucide-react'
import { Property } from '../types'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { adminService } from '../services/api'
import toast from 'react-hot-toast'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuthStore()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this post?')) return
    
    try {
      await adminService.deleteProperty(property._id)
      toast.success('Post removed successfully')
      window.location.reload()
    } catch (err) {
      toast.error('Failed to remove post')
    }
  }

  return (
    <Link to={`/property/${property._id}`} className="block">
      <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
          {property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {property.rentalType === 'rent' ? 'To Rent' : property.rentalType === 'sale' ? 'For Sale' : 'Sublet'}
            </span>
            {user?.userType === 'admin' && (
              <button 
                onClick={handleDelete}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md transition-colors"
                title="Remove Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Price */}
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">
            ৳{property.price.toLocaleString()}
            {property.rentalType === 'rent' && <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>}
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location.address}</span>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <UserCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium line-clamp-1 flex-1">
              {property.owner?.name || 'Unknown Owner'}
            </span>
            {property.owner?.verified && (
              <span title="Verified Owner" className="flex-shrink-0">
                <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
              </span>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {property.rooms && (
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                <DoorOpen className="w-4 h-4 mr-1" />
                <span>{property.rooms} rooms</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                <Users className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
            )}
            {property.sqft && (
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                <Maximize2 className="w-4 h-4 mr-1" />
                <span>{property.sqft} sqft</span>
              </div>
            )}
          </div>

          {/* Type Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </span>
            {property.available ? (
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center">
                <Zap className="w-3 h-3 mr-1" /> Available
              </span>
            ) : (
              <span className="text-xs text-red-600 dark:text-red-400 font-semibold">Not Available</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
