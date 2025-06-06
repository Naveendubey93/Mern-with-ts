import { Request } from 'express';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId: number;
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
    id?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface IRefreshTokenPayload {
  id: string;
}

export interface IRefreshToken {
  id: number;
  user: User;
  expiresAt: Date;
}

export interface User {
  id: number;
  role: string;
  // Add other properties as needed
}

export interface ITenant {
  name: string;
  address: string;
}

export interface CreteTenantRequest extends Request {
  body: ITenant;
}

export interface CreateUserRequest extends Request {
  body: UserData;
}

export interface LimitedUserData {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  tenantId?: number | null;
}

export interface UpdateUserRequest extends Request {
  body: LimitedUserData;
}

export interface UserQueryParams {
  perPage: number;
  currentPage: number;
  q?: string;
  role?: string;
}

export interface TenantQueryParams {
  perPage: number;
  currentPage: number;
  q?: string;
  address?: string;
}
