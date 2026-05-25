import mongoose from 'mongoose';
export interface ISiteSettings {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    phone?: string;
    email?: string;
    officeLat?: number;
    officeLng?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const SiteSettings: mongoose.Model<ISiteSettings, {}, {}, {}, mongoose.Document<unknown, {}, ISiteSettings, {}, {}> & ISiteSettings & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=SiteSettings.d.ts.map