import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UdActivity } from './ud-activity.model';
import { ProjectTask } from '../projects/project-task.model';
import { History } from '../history/history.model';
import { Resource } from '../resources/resource.model';
import { User } from '../users/user.model';

type UdActivityInput = {
  udCode?: string;
  title?: string;
  date?: string;
  statement?: string;
  requiredEquipment?: string[];
  assignmentMode?: string;
  resourceTypes?: string[];
  links?: string[];
  images?: string[];
  projectId?: number;
  status?: string;
};

@Injectable()
export class UdActivitiesService {
  constructor(
    @InjectRepository(UdActivity)
    private readonly udRepo: Repository<UdActivity>,
    @InjectRepository(ProjectTask)
    private readonly taskRepo: Repository<ProjectTask>,
    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
  ) {}

  private normalizeList(input: unknown): string[] {
    if (!Array.isArray(input)) return [];
    return input.map((v) => String(v || '').trim()).filter(Boolean);
  }

  private async resolveActor(email?: string): Promise<{ id: number; name?: string }> {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    if (!normalizedEmail) return { id: 0 };
    const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });
    if (!user) return { id: 0, name: normalizedEmail };
    return { id: user.id, name: user.name || user.email };
  }

  private async logHistory(action: string, details: Record<string, unknown>, actorEmail?: string): Promise<void> {
    const actor = await this.resolveActor(actorEmail);
    const codes = this.normalizeList(details.resourceTypes);
    const primaryCode = codes[0] ? String(codes[0]).toUpperCase() : null;
    const resource = primaryCode
      ? await this.resourceRepo.findOne({ where: { code: primaryCode } })
      : null;

    const row: DeepPartial<History> = {
      userId: actor.id,
      userName: actor.name,
      action,
      resourceId: resource?.id,
      resourceCode: resource?.code || primaryCode || undefined,
      details: JSON.stringify(details),
      createdAt: new Date().toISOString(),
    };
    await this.historyRepo.save(row);
  }

  async findAll(filters: { udCode?: string; status?: string; projectId?: string }): Promise<UdActivity[]> {
    const query = this.udRepo.createQueryBuilder('ud').orderBy('ud.updatedAt', 'DESC');

    if (filters.udCode) {
      query.andWhere('LOWER(ud.udCode) = :udCode', { udCode: String(filters.udCode).toLowerCase() });
    }

    if (filters.status) {
      query.andWhere('LOWER(ud.status) = :status', { status: String(filters.status).toLowerCase() });
    }

    if (filters.projectId) {
      query.andWhere('ud.projectId = :projectId', { projectId: Number(filters.projectId) || 0 });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<UdActivity> {
    const row = await this.udRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`UD activity ${id} not found`);
    return row;
  }

  async create(payload: UdActivityInput, actorEmail?: string): Promise<UdActivity> {
    const now = new Date().toISOString();
    const row = this.udRepo.create({
      udCode: String(payload.udCode || 'UD00').toUpperCase(),
      title: String(payload.title || '').trim(),
      date: payload.date ? String(payload.date) : null,
      statement: payload.statement ? String(payload.statement) : null,
      requiredEquipment: this.normalizeList(payload.requiredEquipment),
      assignmentMode: String(payload.assignmentMode || 'admin'),
      resourceTypes: this.normalizeList(payload.resourceTypes),
      links: this.normalizeList(payload.links),
      images: this.normalizeList(payload.images),
      projectId: payload.projectId != null ? Number(payload.projectId) : null,
      status: String(payload.status || 'planned'),
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.udRepo.save(row);
    await this.logHistory(
      'ud_activity_create',
      {
        udActivityId: saved.id,
        udCode: saved.udCode,
        title: saved.title,
        projectId: saved.projectId,
        resourceTypes: saved.resourceTypes,
      },
      actorEmail,
    );
    return saved;
  }

  async update(id: number, payload: UdActivityInput, actorEmail?: string): Promise<UdActivity> {
    const row = await this.findOne(id);

    if (payload.udCode !== undefined) row.udCode = String(payload.udCode || row.udCode).toUpperCase();
    if (payload.title !== undefined) row.title = String(payload.title || row.title).trim();
    if (payload.date !== undefined) row.date = payload.date ? String(payload.date) : null;
    if (payload.statement !== undefined) row.statement = payload.statement ? String(payload.statement) : null;
    if (payload.requiredEquipment !== undefined) row.requiredEquipment = this.normalizeList(payload.requiredEquipment);
    if (payload.assignmentMode !== undefined) row.assignmentMode = String(payload.assignmentMode || row.assignmentMode);
    if (payload.resourceTypes !== undefined) row.resourceTypes = this.normalizeList(payload.resourceTypes);
    if (payload.links !== undefined) row.links = this.normalizeList(payload.links);
    if (payload.images !== undefined) row.images = this.normalizeList(payload.images);
    if (payload.projectId !== undefined) row.projectId = payload.projectId != null ? Number(payload.projectId) : null;
    if (payload.status !== undefined) row.status = String(payload.status || row.status);

    row.updatedAt = new Date().toISOString();
    const saved = await this.udRepo.save(row);
    await this.logHistory(
      'ud_activity_update',
      {
        udActivityId: saved.id,
        udCode: saved.udCode,
        title: saved.title,
        projectId: saved.projectId,
        resourceTypes: saved.resourceTypes,
      },
      actorEmail,
    );

    return saved;
  }

  async remove(id: number, actorEmail?: string): Promise<{ message: string }> {
    const row = await this.findOne(id);
    await this.taskRepo.update({ udActivityId: id }, { udActivityId: null });
    await this.udRepo.delete(id);

    await this.logHistory(
      'ud_activity_remove',
      {
        udActivityId: row.id,
        udCode: row.udCode,
        title: row.title,
        projectId: row.projectId,
      },
      actorEmail,
    );

    return { message: `UD activity ${id} removed` };
  }

  async linkTask(id: number, taskId: number, actorEmail?: string): Promise<ProjectTask> {
    await this.findOne(id);
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Project task ${taskId} not found`);

    task.udActivityId = id;
    task.updatedAt = new Date().toISOString();
    const savedTask = await this.taskRepo.save(task);

    await this.logHistory(
      'ud_activity_link_task',
      {
        udActivityId: id,
        taskId,
        projectId: savedTask.projectId,
        resourceTypes: savedTask.resourceCode ? [savedTask.resourceCode] : [],
      },
      actorEmail,
    );

    return savedTask;
  }

  async addImage(id: number, imageUrl: string, actorEmail?: string): Promise<UdActivity> {
    const row = await this.findOne(id);
    const current = Array.isArray(row.images) ? row.images : [];
    row.images = [...current, imageUrl];
    row.updatedAt = new Date().toISOString();
    const saved = await this.udRepo.save(row);

    await this.logHistory(
      'ud_activity_add_image',
      {
        udActivityId: saved.id,
        imageUrl,
        resourceTypes: saved.resourceTypes,
      },
      actorEmail,
    );

    return saved;
  }

  async unlinkTask(taskId: number, actorEmail?: string): Promise<ProjectTask> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Project task ${taskId} not found`);

    const previousUdActivityId = task.udActivityId;
    task.udActivityId = null;
    task.updatedAt = new Date().toISOString();
    const savedTask = await this.taskRepo.save(task);

    await this.logHistory(
      'ud_activity_unlink_task',
      {
        udActivityId: previousUdActivityId,
        taskId,
        projectId: savedTask.projectId,
      },
      actorEmail,
    );

    return savedTask;
  }
}
