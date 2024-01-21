import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../../src/types';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {
    this.userService = userService;
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
      res.status(201).json(user.id);
    } catch (err) {
      next(err);
      return;
    }
  }
}
