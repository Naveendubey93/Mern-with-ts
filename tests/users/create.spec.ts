import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import createJWKSMock from 'mock-jwks';
// import { response } from 'express';

describe('Post /users', () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock('http://localhost:5501');
    connection = await AppDataSource.initialize();
  }, 10000);

  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(async () => {
    jwks.stop();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should persist user in the database', async () => {
      // Register user
      const adminToken = jwks.token({
        sub: '1',
        role: Roles.ADMIN,
      });
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mern.space',
        password: 'secret12345',
        role: 'admin',
        tenantId: 1,
      };

      // Generate token
      // const accessToken = jwks.token({ sub: String(data.id), role: data.role });
      // Add token to cookie
      await request(app)
        .post('/users')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(userData.email);
    });
    it('should create a manager user', async () => {
      const adminToken = jwks.token({
        sub: '2',
        role: Roles.ADMIN,
      });

      // Register user
      const userData = {
        firstName: 'Rakesh',
        lastName: 'K',
        role: 'manager',
        email: 'rakesh1@mern.space',
        password: 'secret1234',
        tenantId: 2,
      };

      // Add token to cookie
      await request(app)
        .post('/users')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(userData);

      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER);
    });
  });
});
