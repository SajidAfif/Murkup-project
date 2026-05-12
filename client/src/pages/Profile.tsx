import React, { useState } from 'react'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (!user) {
    navigate('/login')
    return null
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
            <h2 className="text-2xl font-bold">{user.name}</h2>
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
