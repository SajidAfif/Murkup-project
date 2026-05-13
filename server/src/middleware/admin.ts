import { Response, NextFunction } from 'express'
import { CustomRequest } from './errorHandler.js'
import { User } from '../models/User.js'

export const adminOnly = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export default adminOnly
