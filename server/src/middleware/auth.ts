import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CustomRequest } from './errorHandler.js'

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.userId = (decoded as any).id
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
