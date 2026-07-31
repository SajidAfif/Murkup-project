import mongoose from 'mongoose'

export interface ISiteSettings {
  siteName?: string
  description?: string
  quickLinksTitle?: string
  supportTitle?: string
  contactTitle?: string
  quickLinks?: { label: string; href: string }[]
  supportLinks?: { label: string; href: string }[]
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  phone?: string
  email?: string
  address?: string
  copyright?: string
  createdAt: Date
  updatedAt: Date
}

const siteSettingsSchema = new mongoose.Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'AmarToLet' },
    description: { type: String, default: 'Making it easy to find your perfect rental property' },
    quickLinksTitle: { type: String, default: 'Quick Links' },
    supportTitle: { type: String, default: 'Support' },
    contactTitle: { type: String, default: 'Contact Us' },
    quickLinks: {
      type: [{ label: String, href: String }],
      default: [
        { label: 'Browse Properties', href: '/' },
        { label: 'Post Property', href: '/list-property' },
        { label: 'FAQ', href: '/search' },
        { label: 'Contact', href: 'mailto:info@tolet.com' },
      ],
    },
    supportLinks: {
      type: [{ label: String, href: String }],
      default: [
        { label: 'Help Center', href: 'mailto:info@tolet.com?subject=Help%20Center' },
        { label: 'Safety Tips', href: 'mailto:info@tolet.com?subject=Safety%20Tips' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
      ],
    },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: 'Dhaka, Bangladesh' },
    copyright: { type: String, default: 'All rights reserved.' },
  },
  { timestamps: true }
)

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema)
