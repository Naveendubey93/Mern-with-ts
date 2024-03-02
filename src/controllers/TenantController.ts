import { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { Logger } from 'winston';

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}
  async create(req: Request, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    this.logger.debug(`Create tenant: ${req.body}`);
    try {
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info('Tenant has been created', { id: tenant.id });
      res.status(201).json({ id: tenant.id });
    } catch (err) {
      return next(err);
    }
  }
}
