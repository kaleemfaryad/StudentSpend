import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization header required.',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Invalid authorization format.',
      });
    }

    const token =
      authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token required.',
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

    // Attach logged-in user's ID
    (req as any).userId =
      decoded.userId;

    console.log(
      'Authenticated userId:',
      decoded.userId,
    );

    next();
  } catch (error) {
    console.log(
      'Authentication error:',
      error,
    );

    return res.status(401).json({
      message: 'Invalid or expired token.',
    });
  }
};

export default authMiddleware;