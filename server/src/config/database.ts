import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../models/User.js'

let mongod: MongoMemoryServer | null = null

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tolet'

    if (process.env.USE_MEMORY_DB === 'true') {
      console.log('Starting in-memory MongoDB server (v6.0.14)...')
      mongod = await MongoMemoryServer.create({
        binary: {
          version: '6.0.14'
        },
        instance: {
          dbName: 'tolet'
        }
      })
      uri = mongod.getUri()
      console.log(`In-memory MongoDB started at: ${uri}`)
    }

    await mongoose.connect(uri)
    console.log('MongoDB connected successfully')

    // Seed initial users if they don't exist
    await seedInitialUsers()
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

const seedInitialUsers = async () => {
  try {
    // 1. Seed Admin
    const adminEmail = 'sajidmortujaafif0@gmail.com'
    const existingAdmin = await User.findOne({ email: adminEmail })
    if (!existingAdmin) {
      const admin = new User({
        name: 'System Admin',
        email: adminEmail,
        password: 'admin441',
        userType: 'admin',
        verified: true
      })
      await admin.save()
      console.log('Seed: Created Admin User:', adminEmail)
    }

    // 2. Seed Tenant
    const tenantEmail = 'tenant@example.com'
    const existingTenant = await User.findOne({ email: tenantEmail })
    if (!existingTenant) {
      const tenant = new User({
        name: 'John Tenant',
        email: tenantEmail,
        password: 'tenant123',
        userType: 'tenant',
        verified: true
      })
      await tenant.save()
      console.log('Seed: Created Tenant User:', tenantEmail)
    }

    // 3. Seed Owner
    const ownerEmail = 'owner@example.com'
    const existingOwner = await User.findOne({ email: ownerEmail })
    if (!existingOwner) {
      const owner = new User({
        name: 'Jane Owner',
        email: ownerEmail,
        password: 'owner123',
        userType: 'owner',
        verified: true
      })
      await owner.save()
      console.log('Seed: Created Owner User:', ownerEmail)
    }
  } catch (error) {
    console.error('Failed to seed default users:', error)
  }
}

export { mongod }
export default connectDB
