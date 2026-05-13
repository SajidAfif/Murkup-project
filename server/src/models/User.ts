import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

interface IUser {
  _id: string
  name: string
  email: string
  password: string
  phone?: string
  nid?: string
  verificationDocument?: string
  verified: boolean
  profileImage?: string
  userType: 'tenant' | 'owner'
  createdAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
      enum: ['tenant', 'owner'],
      default: 'tenant',
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as any)
  }
})

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

export const User = mongoose.model<IUser>('User', userSchema)
