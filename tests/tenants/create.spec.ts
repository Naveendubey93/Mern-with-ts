import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenants';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';

describe('Post  /tenants', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

  beforeAll(async () => {
    jwks = createJWKSMock('http://localhost:5501');
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
    jwks.start();
    adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });
  });
  afterEach(async () => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should should return a 401 if user is not authenticated', async () => {
      //Arrange
      const tenantData = {
        name: 'Tenant',
        address: 'Tenant address',
      };
      const response = await request(app).post('/tenants').send(tenantData);
      expect(response.statusCode).toBe(401);
    });
    it('should should return a 201 status code', async () => {
      //Arrange
      const tenantData = {
        name: 'Tenant',
        address: 'Tenant address',
      };
      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(tenantData);
      expect(response.statusCode).toBe(201);
    });
    it('should should create tenants in database', async () => {
      //Arrange
      const tenantData = {
        name: 'Tenant',
        address: 'Tenant address',
      };
      await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(tenantData);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toEqual(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it('should should return 403 if user is not admin', async () => {
      //Arrange
      const managerToken = jwks.token({
        sub: '1',
        role: Roles.MANAGER,
      });

      const tenantData = {
        name: 'Tenant',
        address: 'Tenant address',
      };
      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${managerToken}`])
        .send(tenantData);
      const tenantRepository = connection.getRepository(Tenant);
      const tenants = await tenantRepository.find();
      expect(response.statusCode).toBe(403);
      expect(tenants).toHaveLength(0);
      // expect(tenants[0].name).toEqual(tenantData.name);
      // expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});
