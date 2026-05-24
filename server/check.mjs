import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = 'mongodb://localhost:27017/tolet'

const checkAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    const db = mongoose.connection.db
    const user = await db.collection('users').findOne({ email: 'sajidmortujaafif0@gmail.com' })
    console.log('User found:', user)
    
    if (user) {
      const match = await bcrypt.compare('admin441', user.password)
      console.log('Password match:', match)
    }
    
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

checkAdmin()
