import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../../src/types';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import { Config } from '../config';
export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    // this.userService = userService;
  }
  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    if (!email) {
      const err = createHttpError(400, 'Email is required');
      throw err;
    }
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info('User has been registered', { id: user.id });
      let privateKey: Buffer;
      try {
        privateKey = readFileSync(path.join(__dirname, '../../cert/privatekey.pem'));
      } catch (err) {
        createHttpError(500, 'Error reading private key');
        this.logger.error(err);
        return next(err);
      }

      interface JwtPayload {
        sub: string; // subject, typically the user ID
        role: string; // user role, could be 'admin', 'user', etc.
        // ... additional fields specific to your application
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
      const accessToken = sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      });
      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: 'HS256',
        expiresIn: '1y',
        issuer: 'auth-service',
      });
      // const refreshToken = 'shlhsjkjdkjd';
      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: true,
        maxAge: 1000 * 60 * 60, //1h
        httpOnly: true,
      });
      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, //1year
        httpOnly: true,
      });
      res.status(201).json(user.id);
    } catch (err) {
      next(err);
      return;
    }
  }
}
