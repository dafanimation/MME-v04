import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceElement, SpaceElementAssignment } from './space-element.model';

type UpsertSpaceElementInput = {
  room: string;
  elementUid: string;
  template?: string;
  name?: string;
  shape?: string;
  dims?: number[];
  x?: number;
  z?: number;
  yOffset?: number;
  rotationY?: number;
  borderColor?: string;
  fillColor?: string;
  fillOpacity?: number;
  assignment?: SpaceElementAssignment | null;
};

@Injectable()
export class SpaceElementsService {
  constructor(
    @InjectRepository(SpaceElement)
    private readonly repo: Repository<SpaceElement>,
  ) {}

  async findAll(filters: {
    room?: string;
    activityCode?: string;
    projectName?: string;
    mesaNum?: string;
  }): Promise<SpaceElement[]> {
    const query = this.repo.createQueryBuilder('el').orderBy('el.updatedAt', 'DESC');

    if (filters.room) {
      query.andWhere('el.room = :room', { room: filters.room });
    }

    const list = await query.getMany();

    return list.filter((item) => {
      const assignment = item.assignment || {};

      if (filters.activityCode && String(assignment.activityCode || '').toUpperCase() !== String(filters.activityCode || '').toUpperCase()) {
        return false;
      }
      if (filters.projectName && String(assignment.projectName || '').toLowerCase() !== String(filters.projectName || '').toLowerCase()) {
        return false;
      }
      if (filters.mesaNum && String(assignment.mesaNum || '') !== String(filters.mesaNum || '')) {
        return false;
      }

      return true;
    });
  }

  async upsert(
    payload: UpsertSpaceElementInput,
    actorEmail?: string,
  ): Promise<SpaceElement> {
    const room = String(payload.room || '').toUpperCase();
    const elementUid = String(payload.elementUid || '').trim();

    let entity = await this.repo.findOne({ where: { room, elementUid } });

    if (!entity) {
      entity = this.repo.create({
        room,
        elementUid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByEmail: actorEmail || null,
      });
    }

    entity.template = payload.template || entity.template || '';
    entity.name = payload.name || entity.name || '';
    entity.shape = payload.shape || entity.shape || '';
    entity.dims = Array.isArray(payload.dims) ? payload.dims : (entity.dims || []);
    entity.x = Number.isFinite(payload.x) ? Number(payload.x) : (entity.x || 0);
    entity.z = Number.isFinite(payload.z) ? Number(payload.z) : (entity.z || 0);
    entity.yOffset = Number.isFinite(payload.yOffset) ? Number(payload.yOffset) : (entity.yOffset || 0);
    entity.rotationY = Number.isFinite(payload.rotationY) ? Number(payload.rotationY) : (entity.rotationY || 0);
    entity.borderColor = payload.borderColor || entity.borderColor || '#8aa0bf';
    entity.fillColor = payload.fillColor || entity.fillColor || '#8aa0bf';
    entity.fillOpacity = Number.isFinite(payload.fillOpacity) ? Number(payload.fillOpacity) : (entity.fillOpacity || 0.2);
    entity.assignment = payload.assignment ?? entity.assignment ?? null;
    entity.updatedAt = new Date().toISOString();

    return this.repo.save(entity);
  }

  async remove(id: number): Promise<{ message: string }> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Space element ${id} not found`);
    }
    await this.repo.delete(id);
    return { message: `Space element ${id} removed` };
  }
}
