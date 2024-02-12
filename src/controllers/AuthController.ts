import { NextFunction, Response } from 'express';
import { RegisterUserRequest, LoginUserRequest } from '../../src/types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/CredentialService';
export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
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
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info('User has been registered', { id: user.id });
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({ ...payload, id: String(newRefreshToken.id) });

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
      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async login(req: LoginUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const error = createHttpError(400, 'Emaild or password does not match');
        return next(error);
      }

      const passwordMatch = await this.credentialService.comparePassword(password, user.password);
      if (!passwordMatch) {
        const error = createHttpError(400, 'Emaild or password does not match');
        return next(error);
      }

      this.logger.info('User has been logged in', { id: user.id });
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({ ...payload, id: String(newRefreshToken.id) });

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
      res.status(200).json({ id: user.id });
    } catch (err) {
      next(err);
      return;
    }
  }
}
