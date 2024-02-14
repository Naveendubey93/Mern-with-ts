import { Request } from 'express';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface RegisterUserRequest extends Request {
  body: UserData;
}
export interface LoginUserRequest extends Request {
  body: UserLoginData;
}
export interface TokenPayload {
  sub: string;
  role: string;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
  };
}
