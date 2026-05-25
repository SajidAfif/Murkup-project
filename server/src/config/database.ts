import mongoose from 'mongoose'
import { User } from '../models/User.js'

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tolet'
    await mongoose.connect(uri)
    console.log('MongoDB connected successfully')

    // Automatically seed/ensure admin account
    const email = 'sajidmortujaafif0@gmail.com'
    const password = 'admin441'

    const existingAdmin = await User.findOne({ email: email.toLowerCase() })
    if (!existingAdmin) {
      const admin = new User({
        name: 'System Admin',
        email: email.toLowerCase(),
        password,
        userType: 'admin',
        verified: true,
      })
      await admin.save()
      console.log('Admin user seeded successfully:', email)
    } else {
      // Ensure the admin user has admin privileges and the correct password
      existingAdmin.userType = 'admin'
      existingAdmin.password = password // Pre-save hook in User model will automatically hash this
      existingAdmin.verified = true
      await existingAdmin.save()
      console.log('Admin user credentials verified and updated:', email)
    }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
