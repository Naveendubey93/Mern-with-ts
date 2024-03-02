import express, { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/userController';
// import { Tenant } from '../entity/Tenants';
// import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import tenantValidator from '../validators/tenant-validator';
import { User } from '../entity/User';
import { UserService } from '../services/UserService';
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const tenantController = new UserController(userService, logger);

router.post('/', authenticate, canAccess([Roles.ADMIN]), tenantValidator, (req: Request, res: Response, next: NextFunction) =>
  tenantController.create(req, res, next),
);

// router.get('/', authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
//   tenantController.findAll(req, res, next),
// );

// router.get('/:tenantId', authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
//   tenantController.findOne(req, res, next),
// );

// router.patch('/:tenantId', authenticate, canAccess([Roles.ADMIN]), tenantValidator, (req: Request, res: Response, next: NextFunction) =>
//   tenantController.update(req, res, next),
// );

// router.delete('/:tenantId', authenticate, canAccess([Roles.ADMIN]), (req: Request, res: Response, next: NextFunction) =>
//   tenantController.delete(req, res, next),
// );

export default router;
