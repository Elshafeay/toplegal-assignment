import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserSerialized } from '../components/user/user.interfaces';
import userService from '../components/user/user.service';
import { JWT } from '../utils/jwt';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserSerialized;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return next();
  }

  const bearerToken = req.headers.authorization;  // "Bearer blablablablablabla"
  const token = bearerToken.split(' ')[1];
  const payload = JWT.verify(
    token,
  ) as UserPayload;

  const user = await userService.getUser(payload.id);
  if(!user){
    return next();
  }

  req.user = user;

  next();
};
