// src/resources/resource.service.ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    @InjectRepository(User)  // 👈 AFEGIR UserRepository
    private userRepository: Repository<User>,
  ) {}

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
    const enriched = await this.enrichResources(data);

    return { data: enriched, total };
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    return this.enrichResource(resource);
  }

  async findUserResources(userId: number): Promise<Resource[]> {
    const list = await this.resourceRepository.find({
      where: { assignedToUserId: userId },
      order: { code: 'ASC' },
    });
    return this.enrichResources(list);
  }

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const { userId, ...resourceData } = createResourceDto;
    const newResource = this.resourceRepository.create({
      ...resourceData,
      assignedToUserId: userId !== undefined ? userId : null,
      createdAt: new Date().toISOString(),
    });
    const saved = await this.resourceRepository.save(newResource);

    // Auto-generate QR URL if not provided
    if (!saved.qrCode) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      saved.qrCode = `${baseUrl}/recursos/${saved.id}`;
      await this.resourceRepository.save(saved);
    }

    return this.enrichResource(saved);
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
    const cleanUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([, v]) => v !== undefined),
    );
    Object.assign(resource, cleanUpdate);
    return this.resourceRepository.save(resource);
  }

  async remove(id: number): Promise<Resource> {
    const resource = await this.findOne(id);
    await this.resourceRepository.delete(id);
    return resource;
  }

  // ========== MÈTODES ADDICIONALS ==========
  async count(): Promise<number> {
    return this.resourceRepository.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.resourceRepository.count({ where: { status } });
  }

  async getCurrentAssignments(): Promise<any[]> {
    const list = await this.resourceRepository.find({
      where: { status: 'assigned' },
      order: { code: 'ASC' },
    });
    return this.enrichResources(list);
  }

  async releaseResource(
    resourceCode: string,
    requester?: { userId: number; role?: string },
  ): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { code: resourceCode },
    });
    if (!resource) {
      throw new NotFoundException(`Resource ${resourceCode} not found`);
    }

    if (requester) {
      const role = String(requester.role || '').toLowerCase();
      const isAdmin =
        role === 'admin' ||
        role === 'admin_master' ||
        role === 'admin master';

      if (!isAdmin && resource.assignedToUserId !== requester.userId) {
        throw new ForbiddenException(
          `Resource ${resourceCode} is not assigned to current user`,
        );
      }
    }

    resource.status = 'available';
    resource.assignedToUserId = null;
    const saved = await this.resourceRepository.save(resource);
    return this.enrichResource(saved);
  }

  // 👈 NOU MÈTODE assignResource
  async assignResource(
    resourceCode: string,
    userEmail: string,
    location?: {
      x: number;
      z: number;
      type?: string;
      tipo?: string;
      label?: string;
      mesaId?: number;
      num?: number;
      estId?: string;
      room?: string;
      placement?: string;
      anchor?: string;
      renderAnchorIndex?: number | null;
    },
  ): Promise<Resource> {
    // Buscar el recurs
    const resource = await this.resourceRepository.findOne({ where: { code: resourceCode } });
    if (!resource) {
      throw new NotFoundException(`Resource ${resourceCode} not found`);
    }

    // Buscar l'usuari per email
    const user = await this.userRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new NotFoundException(`User with email ${userEmail} not found`);
    }

    // Assignar recurs
    resource.status = 'assigned';
    resource.assignedToUserId = user.id;

    if (
      location &&
      Number.isFinite(location.x) &&
      Number.isFinite(location.z)
    ) {
      resource.location = {
        ...(resource.location || {}),
        type: location.type,
        tipo: location.tipo,
        label: location.label,
        mesaId: location.mesaId,
        num: location.num,
        estId: location.estId,
        room: location.room,
        placement: location.placement,
        anchor: location.anchor,
        renderAnchorIndex: Number.isFinite(Number(location.renderAnchorIndex)) ? Number(location.renderAnchorIndex) : null,
        x: Number(location.x),
        z: Number(location.z),
      };
    }

    const saved = await this.resourceRepository.save(resource);
    return this.enrichResource(saved);
  }

  async selfAssignResource(
    resourceCode: string,
    userId: number,
    userEmail: string,
    location?: {
      x: number;
      z: number;
      type?: string;
      tipo?: string;
      label?: string;
      mesaId?: number;
      num?: number;
      estId?: string;
      room?: string;
      placement?: string;
      anchor?: string;
      renderAnchorIndex?: number | null;
    },
  ): Promise<{ message: string; resource: Resource }> {
    const resource = await this.resourceRepository.findOne({
      where: { code: resourceCode },
    });

    if (!resource) {
      throw new NotFoundException(`Resource ${resourceCode} not found`);
    }

    const availableStatuses = ['available', 'review'];
    const isAssignedToCurrentUser = resource.assignedToUserId === userId;

    if (!isAssignedToCurrentUser && !availableStatuses.includes(resource.status)) {
      throw new ConflictException(
        `Resource ${resourceCode} is not available for self-assign`,
      );
    }

    resource.assignedToUserId = userId;
    resource.status = 'assigned';

    if (
      location &&
      Number.isFinite(location.x) &&
      Number.isFinite(location.z)
    ) {
      resource.location = {
        ...(resource.location || {}),
        type: location.type,
        tipo: location.tipo,
        label: location.label,
        mesaId: location.mesaId,
        num: location.num,
        estId: location.estId,
        room: location.room,
        placement: location.placement,
        anchor: location.anchor,
        renderAnchorIndex: Number.isFinite(Number(location.renderAnchorIndex)) ? Number(location.renderAnchorIndex) : null,
        x: Number(location.x),
        z: Number(location.z),
      };
    }

    const saved = await this.resourceRepository.save(resource);
    const enriched = await this.enrichResource(saved);

    return {
      message: `Resource ${resourceCode} self-assigned to ${userEmail}`,
      resource: enriched,
    };
  }

  private async enrichResources(resources: Resource[]): Promise<any[]> {
    if (!resources.length) return [];

    const assignedIds = [...new Set(
      resources
        .map((r) => r.assignedToUserId)
        .filter((id): id is number => typeof id === 'number' && Number.isFinite(id)),
    )];

    const usersById = new Map<number, User>();
    if (assignedIds.length) {
      const users = await this.userRepository.find({ where: { id: In(assignedIds) } });
      users.forEach((u) => usersById.set(u.id, u));
    }

    return resources.map((r) => {
      const assignedUser = r.assignedToUserId ? usersById.get(r.assignedToUserId) || null : null;
      return {
        ...r,
        assignedUser: assignedUser ? {
          id: assignedUser.id,
          email: assignedUser.email,
          name: assignedUser.name,
          group: assignedUser.group,
          role: assignedUser.role,
        } : null,
        user_email: assignedUser?.email || null,
      };
    });
  }

  private async enrichResource(resource: Resource): Promise<any> {
    const [item] = await this.enrichResources([resource]);
    return item;
  }
}