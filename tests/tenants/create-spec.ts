import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenants';

describe('Post  /tenants', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // await connection.dropDatabase();
    // await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should should return a 201 status code', async () => {
      //Arrange
      const tenantData = {
        name: 'Tenant',
        address: 'Tenant address',
      };
      const response = await request(app).post('/tenants').send(tenantData);
      expect(response.statusCode).toBe(201);
    });
    it('should should create tenants in database', async () => {
      //Arrange
      const tenantData = {
        name: 'Tenant',
        address: 'Tenant address',
      };
      await request(app).post('/tenants').send(tenantData);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toEqual(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});

// const userRepository = connection.getRepository(User);
// const users = await userRepository.find();
// expect(users).toHaveLength(1);
