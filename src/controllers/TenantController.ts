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

  async update(req: Request, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    const tenantId = Number(req.params.id);
    this.logger.debug(`Create tenant: ${req.body}`);
    try {
      await this.tenantService.update(tenantId, { name, address });
      this.logger.info('Tenant has been updated', { tenantId });
      res.status(201).json({ id: tenantId });
    } catch (err) {
      return next(err);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getAll();
      res.status(200).json({ data: tenants });
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = Number(req.params.tenantId);
      const tenants = await this.tenantService.getById(tenantId);
      res.status(200).json({ data: tenants });
    } catch (err) {
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = Number(req.params.tenantId);
      await this.tenantService.deleteById(tenantId);
      res.status(200).json({});
    } catch (err) {
      return next(err);
    }
  }
}
