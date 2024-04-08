import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcryptjs';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
describe('Login /auth/login', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    // it('should should login the user', async () => {
    //   //Arrange
    //   const userData = {
    //     email: 'rakesh@mern.space',
    //     password: 'secret',
    //   };
    //   const response = await request(app).post('/auth/login').send(userData);
    //   expect(response.statusCode).toBe(200);
    // });
    // it('should should return accessToken and refreshToken inside the cookie', async () => {});
    it('should should return 400 statusCode if email or password is wrong', async () => {
      // Arrange
      const userData = {
        firstName: 'Rakesh',
        lastName: 'K',
        email: 'rakesh@mern.space',
        password: 'secret',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const userRepository = connection.getRepository(User);
      await userRepository.save({
        ...userData,
        password: hashedPassword,
        role: Roles.CUSTOMER,
      });

      // Act
      const response = await request(app).post('/auth/login').send({ email: userData.email, password: 'wrongPassword' });

      // Assert

      expect(response.statusCode).toBe(400);
    });
  });
});
