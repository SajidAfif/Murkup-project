import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: String,
}, { timestamps: true });
export const Review = mongoose.model('Review', reviewSchema);
//# sourceMappingURL=Review.js.map