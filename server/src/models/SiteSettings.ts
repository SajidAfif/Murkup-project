import mongoose from 'mongoose'

export interface ISiteSettings {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  phone?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

const siteSettingsSchema = new mongoose.Schema<ISiteSettings>(
  {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
)

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema)
