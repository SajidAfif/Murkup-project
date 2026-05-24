import { useState } from 'react'
import { Filter } from 'lucide-react'

interface FilterPanelProps {
  onFilterChange: (filters: any) => void
  isOpen: boolean
  onToggle: () => void
}

export default function FilterPanel({ onFilterChange, isOpen, onToggle }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    propertyType: '',
    rentalType: '',
    minPrice: '',
    maxPrice: '',
    furnishing: '',
    rooms: '',
    city: '',
  })

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6 md:mb-0">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        <button
          onClick={onToggle}
          className="md:hidden text-gray-500 dark:text-gray-400"
        >
          {isOpen ? '✕' : '⋮'}
        </button>
      </div>

      {(isOpen || window.innerWidth >= 768) && (
        <div className="space-y-4">
          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="flat">Flat</option>
              <option value="room">Room</option>
              <option value="office">Office</option>
              <option value="shop">Shop</option>
              <option value="hostel">Hostel</option>
            </select>
          </div>

          {/* Rental Type */}
          <div>
            <label className="block text-sm font-medium mb-2">For</label>
            <select
              value={filters.rentalType}
              onChange={(e) => handleChange('rentalType', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
              <option value="sublet">Sublet</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Cities</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Khulna">Khulna</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-sm font-medium mb-2">Furnishing</label>
            <select
              value={filters.furnishing}
              onChange={(e) => handleChange('furnishing', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
            </select>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium mb-2">Rooms</label>
            <select
              value={filters.rooms}
              onChange={(e) => handleChange('rooms', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Any</option>
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
              <option value="4">4+ Rooms</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFilters({
                propertyType: '',
                rentalType: '',
                minPrice: '',
                maxPrice: '',
                furnishing: '',
                rooms: '',
                city: '',
              })
              onFilterChange({})
            }}
            className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
