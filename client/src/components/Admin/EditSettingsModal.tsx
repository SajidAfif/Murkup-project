import React, { useState } from 'react'

interface EditSettingsModalProps {
  settings: any
  onClose: () => void
  onSave: (data: any) => Promise<void>
}

export default function EditSettingsModal({ settings, onClose, onSave }: EditSettingsModalProps) {
  const [formData, setFormData] = useState({
    facebook: settings?.facebook || '',
    instagram: settings?.instagram || '',
    twitter: settings?.twitter || '',
    linkedin: settings?.linkedin || '',
    phone: settings?.phone || '',
    email: settings?.email || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Contact & Settings</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook URL</label>
            <input
              type="url"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <input
              type="url"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twitter URL</label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
