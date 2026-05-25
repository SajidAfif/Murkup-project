import mongoose from 'mongoose';
interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    nid?: string;
    verificationDocument?: string;
    verified: boolean;
    isBlocked: boolean;
    profileImage?: string;
    userType: 'tenant' | 'owner' | 'admin';
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=User.d.ts.map