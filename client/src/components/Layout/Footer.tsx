import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/api'
import { SiteSettings } from '../../types'
import { useAuthStore } from '../../store/authStore'
import EditSettingsModal from '../Admin/EditSettingsModal'
import toast from 'react-hot-toast'

const DEFAULT_SOCIALS = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://x.com',
  linkedin: 'https://linkedin.com',
}

const DEFAULT_QUICK_LINKS = [
  { label: 'Browse Properties', href: '/' },
  { label: 'Post Property', href: '/list-property' },
  { label: 'FAQ', href: '/search' },
  { label: 'Contact', href: 'mailto:info@tolet.com' },
]

const DEFAULT_SUPPORT_LINKS = [
  { label: 'Help Center', href: 'mailto:info@tolet.com?subject=Help%20Center' },
  { label: 'Safety Tips', href: 'mailto:info@tolet.com?subject=Safety%20Tips' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    adminService.getSettings()
      .then(res => {
        if (res.data) setSettings(res.data)
      })
      .catch(err => console.error('Failed to fetch settings', err))
  }, [])

  const handleSaveSettings = async (data: any) => {
    try {
      const res = await adminService.updateSettings(data)
      setSettings(res.data)
      setIsEditing(false)
      toast.success('Settings updated successfully')
    } catch (err) {
      toast.error('Failed to update settings')
    }
  }

  const renderFooterLink = (link: { label: string; href: string }) => {
    if (link.href.startsWith('/')) {
      return <Link to={link.href} className="hover:text-primary-400">{link.label}</Link>
    }
    return <a href={link.href} className="hover:text-primary-400">{link.label}</a>
  }

  const quickLinks = settings?.quickLinks?.length ? settings.quickLinks : DEFAULT_QUICK_LINKS
  const supportLinks = settings?.supportLinks?.length ? settings.supportLinks : DEFAULT_SUPPORT_LINKS

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg"></div>
              <span className="text-xl font-bold">{settings?.siteName || 'AmarToLet'}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {settings?.description || 'Making it easy to find your perfect rental property'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">{settings?.quickLinksTitle || 'Quick Links'}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {quickLinks.map((link, index) => <li key={`quick-${index}`}>{renderFooterLink(link)}</li>)}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{settings?.supportTitle || 'Support'}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {supportLinks.map((link, index) => <li key={`support-${index}`}>{renderFooterLink(link)}</li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">{settings?.contactTitle || 'Contact Us'}</h4>
              {user?.userType === 'admin' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400"
                >
                  Edit Info
                </button>
              )}
            </div>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-400" />
                {settings?.phone ? (
                  <a href={`tel:${settings.phone}`} className="hover:text-primary-400">{settings.phone}</a>
                ) : (
                  <a href="tel:+8801XXXXXXXX" className="hover:text-primary-400">+880 1XXX-XXXXXX</a>
                )}
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary-400" />
                {settings?.email ? (
                  <a href={`mailto:${settings.email}`} className="hover:text-primary-400">{settings.email}</a>
                ) : (
                  <a href="mailto:info@tolet.com" className="hover:text-primary-400">info@tolet.com</a>
                )}
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-primary-400 mt-1 flex-shrink-0" />
                <span>{settings?.address || 'Dhaka, Bangladesh'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">&copy; 2024 {settings?.siteName || 'AmarToLet'}. {settings?.copyright || 'All rights reserved.'}</p>
            <div className="flex space-x-4">
              {[
                { key: 'facebook', href: settings?.facebook || DEFAULT_SOCIALS.facebook, icon: Facebook },
                { key: 'instagram', href: settings?.instagram || DEFAULT_SOCIALS.instagram, icon: Instagram },
                { key: 'twitter', href: settings?.twitter || DEFAULT_SOCIALS.twitter, icon: Twitter },
                { key: 'linkedin', href: settings?.linkedin || DEFAULT_SOCIALS.linkedin, icon: Linkedin },
              ].map(({ key, href, icon: Icon }) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditSettingsModal
          settings={settings}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveSettings}
        />
      )}
    </footer>
  )
}
