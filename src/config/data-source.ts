import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Config } from '.';
import { RefreshToken } from '../entity/RefreshToken';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.DB_HOST,
  port: Number(Config.DB_PORT),
  username: Config.DB_USERNAME,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  synchronize: false, //Config.NODE_ENV === 'test' || Config.NODE_ENV === 'dev', // Don't sync in production
  logging: false,
  entities: [User, RefreshToken],
  migrations: [],
  subscribers: [],
});
