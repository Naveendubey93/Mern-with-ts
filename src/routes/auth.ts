import express from 'express';
import { Request, NextFunction, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import { registerValidator, loginValidator } from '../validators';
import { TokenService } from '../services/TokenService';
import { RefreshToken } from '../entity/RefreshToken';
import { CredentialService } from '../services/CredentialService';
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const credentialService = new CredentialService();

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const authController = new AuthController(userService, logger, tokenService, credentialService);

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next));

router.post('/login', loginValidator, (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next));

export default router;
