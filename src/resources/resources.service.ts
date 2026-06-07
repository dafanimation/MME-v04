import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Resource } from './resource.model';
import { User } from '../users/user.model';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async count(): Promise<number> {
    return this.resourceRepository.count();
  }

  async countByStatus(status: string): Promise<number> {
    if (status === 'assigned') {
      return this.resourceRepository.count({
        where: { status: In(['assigned', 'shared', 'occupied']) },
      });
    }
    return this.resourceRepository.count({ where: { status } });
  }

  async getCurrentAssignments(): Promise<Resource[]> {
    return this.resourceRepository
      .createQueryBuilder('resource')
      .where('resource.assignedToUserId IS NOT NULL')
      .andWhere('resource.status IN (:...statuses)', {
        statuses: ['assigned', 'shared', 'occupied'],
      })
      .orderBy('resource.id', 'DESC')
      .getMany();
  }

  async assignResource(resourceCode: string, userEmail: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { code: resourceCode } });
    if (!resource) {
      throw new NotFoundException(`Resource with code ${resourceCode} not found`);
    }

    const user = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    resource.assignedToUserId = user.id;
    resource.status = 'assigned';
    return this.resourceRepository.save(resource);
  }

  async releaseResource(resourceCode: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { code: resourceCode } });
    if (!resource) {
      throw new NotFoundException(`Resource with code ${resourceCode} not found`);
    }

    resource.assignedToUserId = null;
    resource.status = 'available';
    return this.resourceRepository.save(resource);
  }

  async findAll(
    query: FindResourcesQueryDto,
  ): Promise<{ data: Resource[]; total: number }> {
    const { status, location, type, userId, page = 1, limit = 10 } = query;

    const queryBuilder = this.resourceRepository.createQueryBuilder('resource');

    if (status) {
      queryBuilder.andWhere('resource.status = :status', { status });
    }
    if (location) {
      queryBuilder.andWhere('resource.location = :location', { location });
    }
    if (type) {
      queryBuilder.andWhere('resource.type = :type', { type });
    }
    if (userId) {
      queryBuilder.andWhere('resource.assignedToUserId = :userId', { userId });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder.orderBy('resource.id', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    return resource;
  }

  async findUserResources(userId: number): Promise<Resource[]> {
    return this.resourceRepository.find({
      where: { assignedToUserId: userId },
      order: { code: 'ASC' },
    });
  }

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const { userId, ...resourceData } = createResourceDto;

    const newResource = this.resourceRepository.create({
      ...resourceData,
      assignedToUserId: userId !== undefined ? userId : null,
      createdAt: new Date().toISOString(),
    });

    return this.resourceRepository.save(newResource);
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);

    const { userId, ...updateData } = updateResourceDto;

    if (userId !== undefined) {
      resource.assignedToUserId = userId;
    }

    Object.assign(resource, updateData);

    return this.resourceRepository.save(resource);
  }

  async remove(id: number): Promise<Resource> {
    const resource = await this.findOne(id);
    await this.resourceRepository.delete(id);
    return resource;
  }
}
