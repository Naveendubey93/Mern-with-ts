import { Brackets, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from '../entity/User';
import { LimitedUserData, UserData, UserQueryParams } from '../types';
// import { Roles } from '../constants';
import createHttpError from 'http-errors';
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}
  async create({ firstName, lastName, email, password, role, tenantId }: UserData) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const err = createHttpError(400, 'Email is already exists');
      throw err;
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return await this.userRepository.save({ firstName, lastName, email, password: hashedPassword, role, tenantId });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({ where: { id }, relations: { tenant: true } });
  }
  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'password'],
    });
  }

  async update(userId: number, { firstName, lastName, role }: LimitedUserData) {
    return await this.userRepository.update(userId, {
      firstName,
      lastName,
      role,
    });
  }

  async getAll(validatedQuery: UserQueryParams) {
    const { perPage, currentPage } = validatedQuery;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (validatedQuery.q) {
      const searchTerm = `%${validatedQuery.q}%`;
      // queryBuilder.where('LOWER(firstName) LIKE LOWER(:searchTerm) OR LOWER(lastName) LIKE LOWER(:searchTerm) OR LOWER(email) LIKE LOWER(:searchTerm)', { searchTerm });
      // queryBuilder.where('user.firstName ILIKE :q OR user.lastName ILIKE :q OR user.email ILIKE :q', { q: searchTerm });
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("CONCAT(user.firstName, ' ', user.lastName) ILIKE :q", { q: searchTerm }).orWhere('user.email ILIKE :q', { q: searchTerm });
        }),
      );
    }
    if (validatedQuery.role) {
      queryBuilder.andWhere('role = :role', { role: validatedQuery.role });
    }
    const resut = await queryBuilder
      .leftJoinAndSelect('user.tenant', 'tenant')
      .skip((currentPage - 1) * perPage)
      .take(perPage)
      .orderBy('user.id', 'DESC')
      .getManyAndCount();
    return resut;
  }

  async deleteById(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
