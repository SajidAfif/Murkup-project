import mongoose from 'mongoose';
const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    propertyType: {
        type: String,
        enum: ['flat', 'room', 'office', 'shop', 'hostel'],
        required: true,
    },
    rentalType: {
        type: String,
        enum: ['rent', 'sale', 'sublet'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        address: String,
        city: String,
        latitude: Number,
        longitude: Number,
    },
    rooms: Number,
    bathrooms: Number,
    furnishing: {
        type: String,
        enum: ['furnished', 'unfurnished', 'semi-furnished'],
    },
    sqft: Number,
    floor: Number,
    images: [String],
    amenities: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    available: {
        type: Boolean,
        default: true,
    },
    code: {
        type: String,
        unique: true,
    },
}, { timestamps: true });
export const Property = mongoose.model('Property', propertySchema);
//# sourceMappingURL=Property.js.map