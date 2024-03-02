import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { Roles } from '../constants';

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}
  async create(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.debug(`Create tenant: ${req.body}`);
    try {
      const user = await this.userService.create({ firstName, lastName, email, password, role: Roles.MANAGER });
      this.logger.info('User has been created', { id: user.id });
      res.status(201).json({ id: user.id });
    } catch (err) {
      return next(err);
    }
  }

  // async update(req: Request, res: Response, next: NextFunction) {
  //   const { name, address } = req.body;
  //   const tenantId = Number(req.params.id);
  //   this.logger.debug(`Create tenant: ${req.body}`);
  //   try {
  //     await this.userService.update(tenantId, { name, address });
  //     this.logger.info('Tenant has been updated', { tenantId });
  //     res.status(201).json({ id: tenantId });
  //   } catch (err) {
  //     return next(err);
  //   }
  // }

  // async findAll(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const tenants = await this.userService.getAll();
  //     res.status(200).json({ data: tenants });
  //   } catch (err) {
  //     return next(err);
  //   }
  // }

  // async findOne(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const tenantId = Number(req.params.tenantId);
  //     const tenants = await this.userService.getById(tenantId);
  //     res.status(200).json({ data: tenants });
  //   } catch (err) {
  //     return next(err);
  //   }
  // }

  // async delete(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const tenantId = Number(req.params.tenantId);
  //     await this.userService.deleteById(tenantId);
  //     res.status(200).json({});
  //   } catch (err) {
  //     return next(err);
  //   }
  // }
}
