import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key';  // Same as in UserController

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded as { userId: string, role: string }; // Add `user` to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
