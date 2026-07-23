import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { promises as dns } from 'dns';
const router = express.Router();
const upload = multer({ dest: 'uploads/verification' });
// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;
        if (userType === 'admin') {
            return res.status(403).json({ error: 'Cannot register as an administrator.' });
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        // Check MX records for email domain to give a best-effort validation that email is deliverable
        const domain = normalizedEmail.split('@')[1];
        try {
            const mx = await dns.resolveMx(domain);
            if (!mx || mx.length === 0) {
                return res.status(400).json({ error: "Email domain doesn't accept mail" });
            }
        }
        catch (err) {
            return res.status(400).json({ error: "Email domain not found or not accepting mail" });
        }
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        const user = new User({
            name,
            email: normalizedEmail,
            password,
            userType: userType || 'tenant',
        });
        await user.save();
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRE || '7d') });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            },
        });
    }
    catch (error) {
        // Duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Sign up failed' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ error: 'Your account has been blocked by the admin' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRE || '7d') });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                verified: user.verified,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
// Get profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
// Submit verification (nid + document)
router.post('/verify', auth, upload.single('document'), async (req, res) => {
    try {
        const nid = typeof req.body.nid === 'string' ? req.body.nid.trim() : '';
        const file = req.file;
        const user = await User.findById(req.userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        if (user.userType !== 'owner') {
            return res.status(403).json({ error: 'Only property owners can submit verification' });
        }
        if (!nid || !/^[A-Za-z0-9]{6,20}$/.test(nid)) {
            return res.status(400).json({ error: 'Please provide a valid NID or passport number' });
        }
        if (!file) {
            return res.status(400).json({ error: 'Please upload your NID or passport document' });
        }
        user.nid = nid;
        user.verificationDocument = file.path || file.filename;
        user.verified = true;
        await user.save();
        res.json({ message: 'Verification submitted', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});
// Change password
router.patch('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map