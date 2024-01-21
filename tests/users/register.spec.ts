import { DataSource } from 'typeorm';
import app from '../../src/app';
import request from 'supertest';
import { AppDataSource } from '../../src/config/data-source';
// import { truncateTables } from './utils';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
describe('Post /auth/register', () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('Given all fields', () => {
    it('should return the 201 status code', async () => {
      //Arrange
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mern.space',
        password: 'secret',
      };

      const response = await request(app).post('/auth/register').send(userData);
      expect(response.statusCode).toBe(201);
    });

    it('should return valid json response', async () => {
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mern.space',
        password: 'secret',
      };
      const response = await request(app).post('/auth/register').send(userData);

      expect((response.headers as Record<string, string>)['content-type']).toEqual(expect.stringContaining('json'));
    });

    it('should persist the user in the database', async () => {
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mern.space',
        password: 'secret',
      };
      await request(app).post('/auth/register').send(userData);
      // Assert
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(1);
    });

    it('should assign a customer role', async () => {
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        email: 'rakesh@mern.space',
        password: 'secret',
      };
      await request(app).post('/auth/register').send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users[0]).toHaveProperty('role');
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });
  });

  it('should store the hashed password', async () => {
    const userData = {
      firstName: 'Rakesh',
      lastName: 'k',
      email: 'rakesh@mern.space',
      password: 'secret',
    };
    await request(app).post('/auth/register').send(userData);
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    // console.log(users[0].password);
    expect(users[0].password).not.toBe(userData.password);
    expect(users[0].password).toHaveLength(60);
    expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
  });

  it('should return 400 status code if email already exists', async () => {
    const userData = {
      firstName: 'Rakesh',
      lastName: 'k',
      email: 'rakesh@mern.space',
      password: 'secret',
      role: Roles.CUSTOMER,
    };
    // await request(app).post('/auth/register').send(userData);
    const userRepository = connection.getRepository(User);
    await userRepository.save({ ...userData });
    const response = await request(app).post('/auth/register').send(userData);
    expect(response.statusCode).toBe(400);
  });
  describe('Fields are missing', () => {
    it('should return 400 status code if email field is missing', async () => {
      const userData = {
        firstName: 'Rakesh',
        lastName: 'k',
        // email: 'rakesh@mern.space',
        password: 'secret',
        role: Roles.CUSTOMER,
      };
      // await request(app).post('/auth/register').send(userData);

      const response = await request(app).post('/auth/register').send(userData);
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });
});
