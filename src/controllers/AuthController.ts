import { Response } from 'express';
import { RegisterUserRequest } from '../../src/types';
import { UserService } from '../services/userService';

export class AuthController {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  async register(req: RegisterUserRequest, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    this.userService.create({ firstName, lastName, email, password });

    res.status(201).json();
  }
}
