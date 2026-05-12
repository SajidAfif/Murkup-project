import { Response, NextFunction } from 'express'

export interface CustomRequest extends Express.Request {
  userId?: string
  user?: any
}

export const errorHandler = (err: any, req: CustomRequest, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}
