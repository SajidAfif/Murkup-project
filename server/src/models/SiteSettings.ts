import mongoose from 'mongoose'

export interface ISiteSettings {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  phone?: string
  email?: string
  officeLat?: number
  officeLng?: number
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
    officeLat: { type: Number, default: 23.8103 },
    officeLng: { type: Number, default: 90.4125 },
  },
  { timestamps: true }
)

export const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema)
