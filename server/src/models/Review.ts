import mongoose from 'mongoose'

interface IReview {
  property: mongoose.Schema.Types.ObjectId
  reviewer: mongoose.Schema.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
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
  },
  { timestamps: true }
)

export const Review = mongoose.model<IReview>('Review', reviewSchema)
