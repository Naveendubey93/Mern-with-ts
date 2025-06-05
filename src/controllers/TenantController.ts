import { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { Logger } from 'winston';
import { matchedData, validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { TenantQueryParams } from '../types';

export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly logger: Logger,
  ) {}
  async create(req: Request, res: Response, next: NextFunction) {
    //Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
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
    //Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { name, address } = req.body;
    const tenantId = Number(req.params.id);
    if (isNaN(Number(tenantId))) {
      return next(createHttpError(400, 'Invalid url parameter'));
    }
    this.logger.debug(`Request for updating a tenant: ${req.body}`);
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
      const validatedQuery = matchedData(req, {
        onlyValidData: true,
      });
      const { perPage, currentPage } = validatedQuery;
      const [tenants, count] = await this.tenantService.getAll(validatedQuery as TenantQueryParams);
      res
        .status(200)
        .json({ data: tenants, count, currentPage: Number(currentPage), perPage: Number(perPage), totalPages: Math.ceil(count / perPage) });
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const tenantId = Number(req.params.tenantId);
    if (isNaN(tenantId)) {
      return next(createHttpError(400, 'Invalid url param.'));
    }
    try {
      const tenants = await this.tenantService.getById(tenantId);
      this.logger.info('Tenant has been fetched');

      res.status(200).json({ data: tenants });
    } catch (err) {
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const tenantId = Number(req.params.id);
    if (isNaN(tenantId)) {
      return next(createHttpError(400, 'Invalid url param.'));
    }

    try {
      await this.tenantService.deleteById(tenantId);
      res.status(200).json({});
    } catch (err) {
      return next(err);
    }
  }
}
