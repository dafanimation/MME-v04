import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { Resource } from '../resources/resource.model';
import type { CreateUserDto } from './dto/create-user.dto';
import type { FindUsersQueryDto } from './dto/find-users-query.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async findAll(
    query: FindUsersQueryDto,
  ): Promise<{ data: User[]; total: number }> {
    const { active, role, kingdom, page = 1, limit = 10 } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (active !== undefined) {
      queryBuilder.andWhere('user.active = :active', { active });
    }
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }
    if (kingdom) {
      queryBuilder.andWhere('user.kingdom = :kingdom', { kingdom });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder.orderBy('user.id', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findUserResources(userId: number): Promise<Resource[]> {
    return this.resourceRepository.find({
      where: { assignedToUserId: userId },
      order: { code: 'ASC' },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      ...createUserDto,
      active: true,
      createdAt: new Date().toISOString(),
    });

    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }

  async upgradeRole(userId: number, role: 'user' | 'bip' | 'admin'): Promise<User> {
    await this.userRepository.update(userId, { role });
    return this.findOne(userId);
  }
}
