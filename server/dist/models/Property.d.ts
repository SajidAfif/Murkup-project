import mongoose from 'mongoose';
interface IProperty {
    title: string;
    description: string;
    owner: mongoose.Schema.Types.ObjectId;
    propertyType: 'flat' | 'room' | 'office' | 'shop' | 'hostel';
    rentalType: 'rent' | 'sale' | 'sublet';
    price: number;
    location: {
        address: string;
        city: string;
        latitude: number;
        longitude: number;
    };
    rooms?: number;
    bathrooms?: number;
    furnishing: 'furnished' | 'unfurnished' | 'semi-furnished';
    sqft?: number;
    floor?: number;
    images: string[];
    amenities: string[];
    available: boolean;
    code: string;
    likes?: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}
export declare const Property: mongoose.Model<IProperty, {}, {}, {}, mongoose.Document<unknown, {}, IProperty, {}, {}> & IProperty & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Property.d.ts.map