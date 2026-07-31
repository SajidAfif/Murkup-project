import React, { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Users, Star, Lock, MessageSquare, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'
import { propertyService } from '../services/api'
import { Property } from '../types'

export default function Home() {
  const [featured, setFeatured] = useState<Property[]>([])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    propertyType: '',
    city: '',
  })

  useEffect(() => {
    loadFeaturedProperties()
  }, [])

  const loadFeaturedProperties = async () => {
    try {
      const { data } = await propertyService.getAll({ limit: 6 })
      setFeatured(data)
    } catch (error) {
      console.error('Failed to load properties', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate with search parameters
    const params = new URLSearchParams()
    if (searchParams.propertyType) params.append('propertyType', searchParams.propertyType)
    if (searchParams.city) params.append('city', searchParams.city)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 dark:from-gray-900 via-white dark:via-gray-950 to-secondary-50 dark:to-gray-900 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 dark:bg-secondary-900/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              Find Your Perfect <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Rental Home</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover thousands of properties for rent, sale, or sublet. Verified landlords, transparent pricing, and reviews from real tenants.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select
                  value={searchParams.propertyType}
                  onChange={(e) => setSearchParams({ ...searchParams, propertyType: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any Type</option>
                  <option value="flat">Flat</option>
                  <option value="room">Room</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <select
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Cities</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Khulna">Khulna</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <span>Search Properties</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose AmarToLet?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Lock, title: 'Verified Owners', desc: 'All owners are verified with NID or utility bills' },
            { icon: Star, title: 'Real Reviews', desc: 'Genuine reviews from real tenants and visitors' },
            { icon: MessageSquare, title: 'Live Chat', desc: 'Chat directly with property owners in real-time' },
            { icon: MapPin, title: 'Location Info', desc: 'See nearby amenities, hospitals, and landmarks' },
            { icon: Zap, title: 'Quick Booking', desc: 'Schedule property visits instantly online' },
            { icon: Users, title: 'Community', desc: 'Join thousands of happy renters and owners' },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group">
                <div className="inline-block p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 dark:bg-gray-900/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Featured Properties</h2>
            <Link to="/search" className="text-primary-600 dark:text-primary-400 hover:gap-2 flex items-center gap-1 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Post Your Property?</h2>
          <p className="text-lg mb-8 opacity-90">
            Reach thousands of potential tenants. List your property for free today!
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { q: 'How do I know if a property is verified?', a: 'Verified properties have a badge from owners who submitted NID or utility bill copies.' },
            { q: 'Can I schedule a property visit?', a: 'Yes! Click on any property and use the booking system to schedule a visit.' },
            { q: 'Is it safe to use AmarToLet?', a: 'We verify all owners and have a review system to maintain trust and safety.' },
            { q: 'How much does it cost to list?', a: 'Listing is completely free! We earn from optional premium features.' },
          ].map((faq, i) => (
            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
