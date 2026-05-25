import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: String,
    nid: String,
    verificationDocument: String,
    verified: {
        type: Boolean,
        default: false,
    },
    profileImage: String,
    userType: {
        type: String,
        enum: ['tenant', 'owner', 'admin'],
        default: 'tenant',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map