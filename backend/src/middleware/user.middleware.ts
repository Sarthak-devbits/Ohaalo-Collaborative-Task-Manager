import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { httpStatusCodes } from '../utils/httpStatusCode';
import { formResponse } from '../utils/formResponse';

declare global {
  namespace Express {
    interface Request {
      id: number;
    }
  }
}

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return sendErrorResponse(res, 401, 'Unauthorized: No token provided');
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded.email || !decoded.jti) {
      return sendErrorResponse(res, 401, 'Unauthorized: Invalid token');
    }

    const user = await prisma?.user.findUnique({
      where: { email: decoded.email },
      select: { jwtId: true,id:true},
    });

    if (!user || user.jwtId !== decoded.jti) {
      return sendErrorResponse(res, 498, 'Session expired. Refresh token using /user/refresh-token');
    }

    req.id = user.id;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendErrorResponse(res, 498, 'Session expired. Refresh token using /user/refresh-token');
    }
    return sendErrorResponse(res, 401, 'Unauthorized: Invalid token');
  }
};

// Helper function to send error responses
const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(httpStatusCodes[statusCode].code).json(formResponse(httpStatusCodes[statusCode].code, message));
};
