import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = 'mongodb://127.0.0.1:27017/tolet' // Ensure this matches DB URI

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['tenant', 'owner', 'admin'], default: 'tenant' },
    verified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model('User', userSchema)

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to DB')

    const email = 'sajidmortujaafif0@gmail.com'
    const password = 'admin441'

    const existingAdmin = await User.findOne({ email })
    if (existingAdmin) {
      console.log('Admin already exists, skipping creation.')
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const admin = new User({
        name: 'System Admin',
        email,
        password: hashedPassword,
        userType: 'admin',
        verified: true,
      })
      await admin.save()
      console.log('Admin user created successfully:', email)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Failed to seed admin', error)
    process.exit(1)
  }
}

seedAdmin()
