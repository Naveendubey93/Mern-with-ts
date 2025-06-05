import { Repository } from 'typeorm';
import { ITenant, TenantQueryParams } from '../types';
import { Tenant } from '../entity/Tenants';

export class TenantService {
  constructor(private readonly tenantRepository: Repository<Tenant>) {}
  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData);
  }

  async update(id: number, tenantData: ITenant) {
    return await this.tenantRepository.update(id, tenantData);
  }

  async getAll(validatedQuery: TenantQueryParams) {
    const { perPage, currentPage } = validatedQuery;
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');
    if (validatedQuery.q) {
      const searchTerm = `%${validatedQuery.q}%`;
      queryBuilder.where('tenant.name ILIKE :q', { q: searchTerm });
    }
    if (validatedQuery.address) {
      const addressTerm = `%${validatedQuery.address}%`;
      queryBuilder.andWhere('tenant.address ILIKE :address', { address: addressTerm });
    }
    queryBuilder.orderBy('tenant.id', 'DESC');
    if (perPage && currentPage) {
      queryBuilder.skip((currentPage - 1) * perPage).take(perPage);
    }
    const result = await queryBuilder.getManyAndCount();
    return result;
    // return await this.tenantRepository.find();
  }

  async getById(tenantId: number) {
    return await this.tenantRepository.findOne({ where: { id: tenantId } });
  }

  async deleteById(tenantId: number) {
    return await this.tenantRepository.delete(tenantId);
  }
}
