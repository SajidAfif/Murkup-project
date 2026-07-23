import React, { useEffect, useState } from 'react'
import { User, Mail, Phone, LogOut, Star } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [nid, setNid] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) {
    return null
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user.userType !== 'owner') {
      return toast.error('Only property owners can verify their account')
    }

    const normalizedNid = nid.trim()
    if (!normalizedNid) {
      return toast.error('Please enter your NID or passport number')
    }

    if (!/^[A-Za-z0-9]{6,20}$/.test(normalizedNid)) {
      return toast.error('Use a valid NID or passport number with 6-20 letters or digits')
    }

    if (!file) return toast.error('Please select a document')

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('nid', normalizedNid)
      fd.append('document', file)

      await authService.verify(fd)

      const { data } = await authService.getProfile()
      useAuthStore.getState().setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      setNid('')
      setFile(null)
      toast.success('Verification submitted successfully')
    } catch (err) {
      console.error(err)
      toast.error('Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-bold text-3xl">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {user.name}
              {user.userType === 'owner' && user.verified && (
                <Star className="w-6 h-6 fill-blue-500 text-blue-500" />
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize">
              {user.userType === 'owner' ? 'Property Owner' : 'Renter/Tenant'}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
              <div className="font-semibold">{user.email}</div>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                <div className="font-semibold">{user.phone}</div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Account Type</div>
              <div className="font-semibold capitalize">
                {user.userType === 'owner' ? 'Property Owner' : 'Renter/Tenant'}
              </div>
            </div>
          </div>

          {user.verified && (
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-5 h-5 text-green-600 dark:text-green-400">✓</div>
              <div>
                <div className="text-sm text-green-700 dark:text-green-300">Account Status</div>
                <div className="font-semibold text-green-700 dark:text-green-300">Verified</div>
              </div>
            </div>
          )}
        </div>

        {/* Verification form for owners */}
        {user.userType === 'owner' && !user.verified && (
          <form onSubmit={handleVerifySubmit} className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Verify Account (NID / Passport)</h3>
            <div className="mb-3">
              <label className="block text-sm mb-1">NID / Passport Number</label>
              <input
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                placeholder="Enter your NID or passport number"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Upload Document (photo of NID or passport)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </form>
        )}

        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
