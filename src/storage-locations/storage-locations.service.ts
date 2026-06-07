import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageLocation } from './storage-location.model';

type StorageLocationInput = {
  type?: string;
  zone?: string;
  row?: string;
  module?: string;
  label?: string;
  room?: string;
  capacity?: number;
  active?: boolean;
  coordinates?: { x: number; z: number; y?: number };
};

@Injectable()
export class StorageLocationsService {
  constructor(
    @InjectRepository(StorageLocation)
    private readonly repo: Repository<StorageLocation>,
  ) {}

  async findAll(filters: { room?: string; type?: string; zone?: string; active?: string }): Promise<StorageLocation[]> {
    const query = this.repo.createQueryBuilder('s').orderBy('s.zone', 'ASC').addOrderBy('s.label', 'ASC');

    if (filters.room) query.andWhere('LOWER(s.room) = :room', { room: String(filters.room).toLowerCase() });
    if (filters.type) query.andWhere('LOWER(s.type) = :type', { type: String(filters.type).toLowerCase() });
    if (filters.zone) query.andWhere('LOWER(s.zone) = :zone', { zone: String(filters.zone).toLowerCase() });
    if (filters.active != null) {
      const active = String(filters.active).toLowerCase();
      if (active === 'true' || active === '1') query.andWhere('s.active = :active', { active: true });
      if (active === 'false' || active === '0') query.andWhere('s.active = :active', { active: false });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<StorageLocation> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Storage location ${id} not found`);
    return row;
  }

  async create(payload: StorageLocationInput): Promise<StorageLocation> {
    const now = new Date().toISOString();
    const row = this.repo.create({
      type: String(payload.type || 'ESTANTERIA').toUpperCase(),
      zone: String(payload.zone || 'A').toUpperCase(),
      row: payload.row ? String(payload.row).toUpperCase() : null,
      module: payload.module ? String(payload.module).toUpperCase() : null,
      label: payload.label ? String(payload.label) : null,
      room: payload.room ? String(payload.room).toUpperCase() : null,
      capacity: Number(payload.capacity || 0),
      active: payload.active !== undefined ? Boolean(payload.active) : true,
      coordinates: payload.coordinates || null,
      createdAt: now,
      updatedAt: now,
    });

    return this.repo.save(row);
  }

  async update(id: number, payload: StorageLocationInput): Promise<StorageLocation> {
    const row = await this.findOne(id);

    if (payload.type !== undefined) row.type = String(payload.type || row.type).toUpperCase();
    if (payload.zone !== undefined) row.zone = String(payload.zone || row.zone).toUpperCase();
    if (payload.row !== undefined) row.row = payload.row ? String(payload.row).toUpperCase() : null;
    if (payload.module !== undefined) row.module = payload.module ? String(payload.module).toUpperCase() : null;
    if (payload.label !== undefined) row.label = payload.label ? String(payload.label) : null;
    if (payload.room !== undefined) row.room = payload.room ? String(payload.room).toUpperCase() : null;
    if (payload.capacity !== undefined) row.capacity = Number(payload.capacity || 0);
    if (payload.active !== undefined) row.active = Boolean(payload.active);
    if (payload.coordinates !== undefined) row.coordinates = payload.coordinates || null;

    row.updatedAt = new Date().toISOString();
    return this.repo.save(row);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: `Storage location ${id} removed` };
  }
}
