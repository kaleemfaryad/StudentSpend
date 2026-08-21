import {
  Request,
  Response,
  NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'studentspend-dev-secret';

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
        message:
          'Authorization header required.',
      });
    }

    if (
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        message:
          'Invalid authorization format.',
      });
    }

    const token =
      authHeader.substring(7).trim();

    if (!token) {
      return res.status(401).json({
        message: 'Token required.',
      });
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET,
      ) as JwtPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        message:
          'Invalid token payload.',
      });
    }

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
      message:
        'Invalid or expired token.',
    });
  }
};

export default authMiddleware;