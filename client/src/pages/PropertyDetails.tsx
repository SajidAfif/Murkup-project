import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Mail, Calendar, DoorOpen, Maximize2, Star, Heart, MessageSquare, Check, AlertCircle, Bath } from 'lucide-react'
import { Link } from 'react-router-dom'
import { propertyService, adminService } from '../services/api'
import { Property } from '../types'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import EditPropertyModal from '../components/Admin/EditPropertyModal'

export default function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [property, setProperty] = useState<Property | null>(null)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
  })

  useEffect(() => {
    loadProperty()
  }, [id])

  // autoplay effect
  useEffect(() => {
    if (!autoplay) return
    const t = setInterval(() => {
      setSelectedImage((s) => {
        if (!property || !property.images || property.images.length === 0) return 0
        return (s + 1) % property.images.length
      })
    }, 3500)
    return () => clearInterval(t)
  }, [autoplay, property])

  const loadProperty = async () => {
    try {
      const { data } = await propertyService.getById(id!)
      setProperty(data)
      setLikesCount(data.likes ? data.likes.length : 0)
      setLiked(user ? (data.likes || []).some((u: any) => u._id === user.id || u === user.id) : false)
    } catch (error) {
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const { data } = await propertyService.toggleLike(id!)
      setLiked(data.liked)
      setLikesCount(data.likesCount)
    } catch (err) {
      toast.error('Unable to update like')
    }
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    toast.success('Booking request sent! We will contact you soon.')
    setShowBookingForm(false)
    setBookingData({ date: '', time: '' })
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      await adminService.deleteProperty(id!)
      toast.success('Property deleted successfully')
      navigate('/')
    } catch (err: any) {
      toast.error('Failed to delete property')
    }
  }

  const handleEditSave = async (propertyId: string, data: any) => {
    try {
      const res = await adminService.updateProperty(propertyId, data)
      setProperty(res.data)
      setIsEditing(false)
      toast.success('Property updated successfully')
    } catch (err: any) {
      toast.error('Failed to update property')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Property not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-96 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden mb-4">
              {property.images.length > 0 ? (
                  <img
                    src={property.images[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
                {/* Slideshow controls */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + property.images.length) % property.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:scale-105"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>

                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % property.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:scale-105"
                      aria-label="Next image"
                    >
                      ›
                    </button>

                    <button
                      onClick={() => setAutoplay((a) => !a)}
                      className="absolute left-4 bottom-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg text-sm"
                    >
                      {autoplay ? 'Pause' : 'Play'}
                    </button>
                  </>
                )}
              <button
                onClick={handleToggleLike}
                className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Heart className={`w-5 h-5 ${liked ? 'text-red-600' : ''}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{likesCount}</span>
              </button>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-primary-500'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <img src={image} alt={`View ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  {property.location.address}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  ৳{property.price.toLocaleString()}
                </div>
                {property.rentalType === 'rent' && (
                  <div className="text-sm text-gray-500">/month</div>
                )}
              </div>
            </div>

            {/* Owner/Admin controls */}
            {(user?.id === property.owner._id || user?.userType === 'admin') && (
              <div className="mb-4 space-x-2">
                {user?.id === property.owner._id ? (
                  <Link to={`/edit-property/${property._id}`} className="px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500">
                    Edit Post
                  </Link>
                ) : null}

                {user?.userType === 'admin' && (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500"
                    >
                      Admin Edit
                    </button>
                    <button 
                      onClick={handleDelete} 
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700"
                    >
                      Delete Post
                    </button>
                  </>
                )}
              </div>
            )}

            {property.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">{property.description}</p>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              {property.rooms && (
                <div className="text-center">
                  <DoorOpen className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                  <div className="font-semibold">{property.rooms}</div>
                  <div className="text-sm text-gray-500">Rooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
              )}
              {property.sqft && (
                <div className="text-center">
                  <Maximize2 className="w-6 h-6 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                  <div className="font-semibold">{property.sqft}</div>
                  <div className="text-sm text-gray-500">sqft</div>
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold">{property.furnishing}</div>
                <div className="text-sm text-gray-500">Furnishing</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          {/* Owner Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">Owner Information</h3>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  {property.owner.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold flex items-center gap-1">
                  {property.owner.name}
                  {property.owner.verified && (
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {property.owner.verified && <Check className="w-4 h-4" />}
                  <span className="text-sm text-gray-500">
                    {property.owner.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <a
                href={`tel:${property.owner.phone}`}
                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{property.owner.phone || 'Not provided'}</span>
              </a>
              <a
                href={`mailto:${property.owner.email}`}
                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{property.owner.email}</span>
              </a>
            </div>

            {user ? (
              <button
                onClick={() => {
                  if (!property.owner?.email) {
                    toast.error('Owner email not available')
                    return
                  }
                  const subject = encodeURIComponent(`Inquiry about ${property.title}`)
                  const body = encodeURIComponent(
                    `Hi ${property.owner.name},\n\nI am interested in your property "${property.title}". Please let me know more details.\n\nThanks, ${user.name || ''}`
                  )
                  window.location.href = `mailto:${property.owner.email}?subject=${subject}&body=${body}`
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
              >
                <MessageSquare className="w-5 h-5" />
                Chat with Owner
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all mb-3"
              >
                Login to Chat
              </button>
            )}

            {/* Booking Form */}
            {!showBookingForm && (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full px-4 py-3 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Schedule Visit
              </button>
            )}

            {showBookingForm && (
              <form onSubmit={handleBookingSubmit} className="space-y-3">
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              {property.available ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              <span className="font-semibold">
                {property.available ? 'Available' : 'Not Available'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Property ID: {property.code}
            </p>
          </div>
        </aside>
      </div>

      {isEditing && (
        <EditPropertyModal
          property={property}
          onClose={() => setIsEditing(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  )
}
