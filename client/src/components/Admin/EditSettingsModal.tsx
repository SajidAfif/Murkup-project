import React, { useState } from 'react'

interface EditSettingsModalProps {
  settings: any
  onClose: () => void
  onSave: (data: any) => Promise<void>
}

interface FooterLink {
  label: string
  href: string
}

interface FooterFormData {
  siteName: string
  description: string
  quickLinksTitle: string
  supportTitle: string
  contactTitle: string
  quickLinks: FooterLink[]
  supportLinks: FooterLink[]
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  phone: string
  email: string
  address: string
  copyright: string
}

export default function EditSettingsModal({ settings, onClose, onSave }: EditSettingsModalProps) {
  const [formData, setFormData] = useState<FooterFormData>({
    siteName: settings?.siteName || 'AmarToLet',
    description: settings?.description || 'Making it easy to find your perfect rental property',
    quickLinksTitle: settings?.quickLinksTitle || 'Quick Links',
    supportTitle: settings?.supportTitle || 'Support',
    contactTitle: settings?.contactTitle || 'Contact Us',
    quickLinks: settings?.quickLinks || [
      { label: 'Browse Properties', href: '/' },
      { label: 'Post Property', href: '/list-property' },
      { label: 'FAQ', href: '/search' },
      { label: 'Contact', href: 'mailto:info@tolet.com' },
    ],
    supportLinks: settings?.supportLinks || [
      { label: 'Help Center', href: 'mailto:info@tolet.com?subject=Help%20Center' },
      { label: 'Safety Tips', href: 'mailto:info@tolet.com?subject=Safety%20Tips' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    facebook: settings?.facebook || '',
    instagram: settings?.instagram || '',
    twitter: settings?.twitter || '',
    linkedin: settings?.linkedin || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    address: settings?.address || 'Dhaka, Bangladesh',
    copyright: settings?.copyright || 'All rights reserved.',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  const updateLink = (group: 'quickLinks' | 'supportLinks', index: number, field: 'label' | 'href', value: string) => {
    setFormData((current) => ({
      ...current,
      [group]: current[group].map((link, linkIndex) => linkIndex === index ? { ...link, [field]: value } : link),
    }))
  }

  const renderLinkFields = (group: 'quickLinks' | 'supportLinks', title: string) => (
    <fieldset className="space-y-2 rounded border p-3 dark:border-gray-700">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {formData[group].map((link, index) => (
        <div key={`${group}-${index}`} className="grid grid-cols-2 gap-2">
          <input aria-label={`${title} ${index + 1} label`} value={link.label} onChange={(e) => updateLink(group, index, 'label', e.target.value)} placeholder="Label" className="w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <input aria-label={`${title} ${index + 1} URL`} value={link.href} onChange={(e) => updateLink(group, index, 'href', e.target.value)} placeholder="URL or route" className="w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
        </div>
      ))}
    </fieldset>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Footer</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website Name</label>
            <input value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input aria-label="Quick links heading" value={formData.quickLinksTitle} onChange={(e) => setFormData({ ...formData, quickLinksTitle: e.target.value })} placeholder="Quick Links heading" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
            <input aria-label="Support heading" value={formData.supportTitle} onChange={(e) => setFormData({ ...formData, supportTitle: e.target.value })} placeholder="Support heading" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
            <input aria-label="Contact heading" value={formData.contactTitle} onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })} placeholder="Contact heading" className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
          </div>
          {renderLinkFields('quickLinks', 'Quick Links')}
          {renderLinkFields('supportLinks', 'Support Links')}
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
            <label className="block text-sm font-medium mb-1">Contact Address</label>
            <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Copyright Text</label>
            <input value={formData.copyright} onChange={(e) => setFormData({ ...formData, copyright: e.target.value })} className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" />
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
