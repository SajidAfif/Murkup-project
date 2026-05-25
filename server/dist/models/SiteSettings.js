import mongoose from 'mongoose';
const siteSettingsSchema = new mongoose.Schema({
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
}, { timestamps: true });
export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
//# sourceMappingURL=SiteSettings.js.map