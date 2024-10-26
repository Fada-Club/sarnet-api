import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';




export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const token = req.header('Authorization');
    if (!token || !process.env.AUTH_SECRET) {
      throw new Error('Authentication required');
    }

    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET) as JwtPayload;
    const currentUserId = decodedToken._id;

    if (!id || !currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Server error',
    });
  }
};
