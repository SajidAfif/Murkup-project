import mongoose from 'mongoose';
import 'dotenv/config';
import { User } from './models/User.js';
const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/to-let';
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');
        const email = 'sajidmortujaafif0@gmail.com';
        const password = 'admin441';
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists, skipping creation.');
        }
        else {
            const admin = new User({
                name: 'System Admin',
                email,
                password,
                userType: 'admin',
                verified: true,
            });
            await admin.save();
            console.log('Admin user created successfully:', email);
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Failed to seed admin', error);
        process.exit(1);
    }
};
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map