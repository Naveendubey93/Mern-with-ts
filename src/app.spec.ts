import { describe } from 'node:test';
import { calculateDiscount } from './utils';
import request from 'supertest';
import app from './app';
describe('app', () => {
  it('should calculate the discount', () => {
    const result = calculateDiscount(100, 10);
    expect(result).toEqual(10);
  });
});

it('should return 200 status code', async () => {
  const response = await request(app).get('/').send();
  expect(response.statusCode).toEqual(201);
});
