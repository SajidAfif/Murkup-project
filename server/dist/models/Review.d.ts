import mongoose from 'mongoose';
interface IReview {
    property: mongoose.Schema.Types.ObjectId;
    reviewer: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}
export declare const Review: mongoose.Model<IReview, {}, {}, {}, mongoose.Document<unknown, {}, IReview, {}, {}> & IReview & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Review.d.ts.map