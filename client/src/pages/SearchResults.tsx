import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import FilterPanel from '../components/FilterPanel'
import Pagination from '../components/Pagination'
import { propertyService } from '../services/api'
import { Property } from '../types'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const resultsPerPage = 12

  useEffect(() => {
    loadProperties()
  }, [filters, searchParams])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const params = {
        ...filters,
        q: searchParams.get('q'),
      }
      const { data } = await propertyService.getAll(params)
      setProperties(data)
      setCurrentPage(1)
    } catch (error) {
      console.error('Failed to load properties', error)
    } finally {
      setLoading(false)
    }
  }

  const paginatedProperties = properties.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  )
  const totalPages = Math.ceil(properties.length / resultsPerPage)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Search Results</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <FilterPanel
            onFilterChange={setFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : paginatedProperties.length > 0 ? (
            <>
              <div className="mb-6 text-gray-600 dark:text-gray-400">
                Found <span className="font-bold">{properties.length}</span> properties
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {paginatedProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No properties found</p>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
