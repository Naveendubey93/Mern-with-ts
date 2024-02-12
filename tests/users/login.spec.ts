import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';

describe('Login /auth/login', () => {
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
    it('should should login the user', async () => {
      //Arrange
      const userData = {
        email: 'rakesh@mern.space',
        password: 'secret',
      };
      const response = await request(app).post('/auth/login').send(userData);
      expect(response.statusCode).toBe(200);
    });
  });
});
