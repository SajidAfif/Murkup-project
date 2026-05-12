import React from 'react'
import { MapPin, Users, DoorOpen, Maximize2, Zap } from 'lucide-react'
import { Property } from '../types'
import { Link } from 'react-router-dom'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/property/${property._id}`}>
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
          <div className="absolute top-3 right-3">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {property.rentalType === 'rent' ? 'To Rent' : property.rentalType === 'sale' ? 'For Sale' : 'Sublet'}
            </span>
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
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location.address}</span>
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
