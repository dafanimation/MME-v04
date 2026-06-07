import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import { Project } from './project.model';
import { ProjectTask } from './project-task.model';
import { History as HistoryEntity } from '../history/history.model';
import { Resource } from '../resources/resource.model';
import { User } from '../users/user.model';

type ProjectInput = {
  title?: string;
  description?: string;
  status?: string;
  dossierLinks?: string[];
  attachments?: string[];
  participants?: string[];
  mesaNum?: string;
};

type ProjectTaskInput = {
  udActivityId?: number;
  activityCode?: string;
  ownerUserEmail?: string;
  mesaNum?: string;
  resourceCode?: string;
  status?: string;
  notes?: string;
};

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectTask)
    private readonly taskRepo: Repository<ProjectTask>,
    @InjectRepository(HistoryEntity)
    private readonly historyRepo: Repository<HistoryEntity>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Resource)
    private readonly resourceRepo: Repository<Resource>,
  ) {}

  private async resolveActor(
    email?: string,
  ): Promise<{ id: number | null; name: string | null }> {
    const normalizedEmail = String(email || '')
      .toLowerCase()
      .trim();
    if (!normalizedEmail) return { id: null, name: null };
    const user = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });
    if (!user) return { id: null, name: normalizedEmail };
    return { id: user.id, name: user.name || user.email };
  }

  private async resolveResource(
    resourceCode?: string,
  ): Promise<Resource | null> {
    const code = String(resourceCode || '')
      .toUpperCase()
      .trim();
    if (!code) return null;
    return this.resourceRepo.findOne({ where: { code } });
  }

  private async logHistoryEvent(args: {
    action: string;
    details: string;
    actorEmail?: string;
    ownerEmail?: string;
    resourceCode?: string;
  }): Promise<void> {
    const actor = await this.resolveActor(args.actorEmail || args.ownerEmail);
    const resource = await this.resolveResource(args.resourceCode);
    const row: DeepPartial<HistoryEntity> = {
      userId: actor.id ?? 0,
      userName: actor.name || undefined,
      action: args.action,
      resourceId: resource?.id ?? undefined,
      resourceCode:
        resource?.code ||
        (args.resourceCode
          ? String(args.resourceCode).toUpperCase()
          : undefined),
      details: args.details,
      createdAt: new Date().toISOString(),
    };
    await this.historyRepo.save(row);
  }

  async findProjects(filters: {
    status?: string;
    title?: string;
  }): Promise<Project[]> {
    const query = this.projectRepo
      .createQueryBuilder('project')
      .orderBy('project.updatedAt', 'DESC');

    if (filters.status) {
      query.andWhere('project.status = :status', { status: filters.status });
    }

    if (filters.title) {
      query.andWhere('LOWER(project.title) LIKE :title', {
        title: `%${String(filters.title).toLowerCase()}%`,
      });
    }

    return query.getMany();
  }

  async findProject(id: number): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async exportProjectPdf(projectId: number): Promise<Buffer> {
    const project = await this.findProject(projectId);
    const tasks = await this.findTasks(projectId);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
      );
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text(`Proyecto: ${project.title || 'Sin titulo'}`);
      doc.moveDown(0.4);
      doc.fontSize(11).text(`Estado: ${project.status || 'draft'}`);
      doc.fontSize(11).text(`Mesa: ${project.mesaNum || 'Sin asignar'}`);
      doc.fontSize(11).text(`Actualizado: ${project.updatedAt || '-'}`);

      doc.moveDown(0.8);
      doc.fontSize(13).text('Descripcion');
      doc.fontSize(10).text(project.description || 'Sin descripcion');

      const participants = Array.isArray(project.participants)
        ? project.participants
        : [];
      doc.moveDown(0.8);
      doc.fontSize(13).text('Participantes');
      if (!participants.length) {
        doc.fontSize(10).text('- Sin participantes');
      } else {
        participants.forEach((entry) => doc.fontSize(10).text(`- ${entry}`));
      }

      const links = Array.isArray(project.dossierLinks)
        ? project.dossierLinks
        : [];
      doc.moveDown(0.8);
      doc.fontSize(13).text('Links dosier');
      if (!links.length) {
        doc.fontSize(10).text('- Sin enlaces');
      } else {
        links.forEach((entry) => doc.fontSize(10).text(`- ${entry}`));
      }

      doc.moveDown(0.8);
      doc.fontSize(13).text('Tareas');
      if (!tasks.length) {
        doc.fontSize(10).text('- Sin tareas');
      } else {
        tasks.forEach((task, index) => {
          doc
            .fontSize(10)
            .text(
              `${index + 1}. ${task.activityCode || '-'} | owner=${task.ownerUserEmail || '-'} | mesa=${task.mesaNum || '-'} | recurso=${task.resourceCode || '-'} | estado=${task.status || 'pending'}`,
            );
          if (task.notes) {
            doc.fontSize(9).fillColor('#444').text(`   notas: ${task.notes}`);
            doc.fillColor('#000');
          }
        });
      }

      doc.end();
    });
  }

  async createProject(
    payload: ProjectInput,
    actorEmail?: string,
  ): Promise<Project> {
    const now = new Date().toISOString();
    const project = this.projectRepo.create({
      title: String(payload.title || '').trim(),
      description: payload.description ? String(payload.description) : null,
      status: payload.status || 'draft',
      dossierLinks: Array.isArray(payload.dossierLinks)
        ? payload.dossierLinks
        : [],
      attachments: Array.isArray(payload.attachments)
        ? payload.attachments
        : [],
      participants: Array.isArray(payload.participants)
        ? payload.participants
        : [],
      mesaNum: payload.mesaNum ? String(payload.mesaNum) : null,
      createdByEmail: actorEmail || null,
      createdAt: now,
      updatedAt: now,
    });
    const saved = await this.projectRepo.save(project);
    await this.logHistoryEvent({
      action: 'project_create',
      actorEmail,
      details: JSON.stringify({ projectId: saved.id, title: saved.title }),
    });
    return saved;
  }

  async updateProject(
    id: number,
    payload: ProjectInput,
    actorEmail?: string,
  ): Promise<Project> {
    const project = await this.findProject(id);

    if (payload.title != null)
      project.title = String(payload.title || '').trim() || project.title;
    if (payload.description !== undefined)
      project.description = payload.description
        ? String(payload.description)
        : null;
    if (payload.status !== undefined)
      project.status = String(payload.status || 'draft');
    if (payload.dossierLinks !== undefined)
      project.dossierLinks = Array.isArray(payload.dossierLinks)
        ? payload.dossierLinks
        : [];
    if (payload.attachments !== undefined)
      project.attachments = Array.isArray(payload.attachments)
        ? payload.attachments
        : [];
    if (payload.participants !== undefined)
      project.participants = Array.isArray(payload.participants)
        ? payload.participants
        : [];
    if (payload.mesaNum !== undefined)
      project.mesaNum = payload.mesaNum ? String(payload.mesaNum) : null;

    project.updatedAt = new Date().toISOString();
    const saved = await this.projectRepo.save(project);
    await this.logHistoryEvent({
      action: 'project_update',
      actorEmail,
      details: JSON.stringify({
        projectId: saved.id,
        title: saved.title,
        status: saved.status,
      }),
    });
    return saved;
  }

  async removeProject(
    id: number,
    actorEmail?: string,
  ): Promise<{ message: string }> {
    const project = await this.findProject(id);
    await this.taskRepo.delete({ projectId: id });
    await this.projectRepo.delete(id);
    await this.logHistoryEvent({
      action: 'project_remove',
      actorEmail,
      details: JSON.stringify({ projectId: id, title: project.title }),
    });
    return { message: `Project ${id} removed` };
  }

  async addProjectAttachment(
    id: number,
    fileUrl: string,
    actorEmail?: string,
  ): Promise<Project> {
    const project = await this.findProject(id);
    const current = Array.isArray(project.attachments)
      ? project.attachments
      : [];
    project.attachments = [...current, fileUrl];
    project.updatedAt = new Date().toISOString();
    const saved = await this.projectRepo.save(project);
    await this.logHistoryEvent({
      action: 'project_attachment_add',
      actorEmail,
      details: JSON.stringify({ projectId: saved.id, fileUrl }),
    });
    return saved;
  }

  async findTasks(projectId: number): Promise<ProjectTask[]> {
    await this.findProject(projectId);
    return this.taskRepo.find({
      where: { projectId },
      order: { updatedAt: 'DESC' },
    });
  }

  async createTask(
    projectId: number,
    payload: ProjectTaskInput,
    actorEmail?: string,
  ): Promise<ProjectTask> {
    const project = await this.findProject(projectId);
    const now = new Date().toISOString();
    const task = this.taskRepo.create({
      projectId,
      udActivityId: payload.udActivityId ?? null,
      activityCode: payload.activityCode
        ? String(payload.activityCode).toUpperCase()
        : null,
      ownerUserEmail: payload.ownerUserEmail
        ? String(payload.ownerUserEmail).toLowerCase()
        : null,
      mesaNum: payload.mesaNum ? String(payload.mesaNum) : null,
      resourceCode: payload.resourceCode
        ? String(payload.resourceCode).toUpperCase()
        : null,
      status: payload.status || 'pending',
      notes: payload.notes ? String(payload.notes) : null,
      createdAt: now,
      updatedAt: now,
    });
    const saved = await this.taskRepo.save(task);
    await this.logHistoryEvent({
      action: 'project_task_create',
      actorEmail,
      ownerEmail: saved.ownerUserEmail || undefined,
      resourceCode: saved.resourceCode || undefined,
      details: JSON.stringify({
        projectId,
        projectTitle: project.title,
        taskId: saved.id,
        udActivityId: saved.udActivityId,
        activityCode: saved.activityCode,
        mesaNum: saved.mesaNum,
        status: saved.status,
      }),
    });
    return saved;
  }

  async updateTask(
    taskId: number,
    payload: ProjectTaskInput,
    actorEmail?: string,
  ): Promise<ProjectTask> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Project task ${taskId} not found`);

    if (payload.udActivityId !== undefined)
      task.udActivityId = Number(payload.udActivityId) || null;
    if (payload.activityCode !== undefined)
      task.activityCode = payload.activityCode
        ? String(payload.activityCode).toUpperCase()
        : null;
    if (payload.ownerUserEmail !== undefined)
      task.ownerUserEmail = payload.ownerUserEmail
        ? String(payload.ownerUserEmail).toLowerCase()
        : null;
    if (payload.mesaNum !== undefined)
      task.mesaNum = payload.mesaNum ? String(payload.mesaNum) : null;
    if (payload.resourceCode !== undefined)
      task.resourceCode = payload.resourceCode
        ? String(payload.resourceCode).toUpperCase()
        : null;
    if (payload.status !== undefined)
      task.status = String(payload.status || 'pending');
    if (payload.notes !== undefined)
      task.notes = payload.notes ? String(payload.notes) : null;

    task.updatedAt = new Date().toISOString();
    const saved = await this.taskRepo.save(task);
    await this.logHistoryEvent({
      action: 'project_task_update',
      actorEmail,
      ownerEmail: saved.ownerUserEmail || undefined,
      resourceCode: saved.resourceCode || undefined,
      details: JSON.stringify({
        taskId: saved.id,
        projectId: saved.projectId,
        udActivityId: saved.udActivityId,
        activityCode: saved.activityCode,
        mesaNum: saved.mesaNum,
        status: saved.status,
      }),
    });
    return saved;
  }

  async removeTask(
    taskId: number,
    actorEmail?: string,
  ): Promise<{ message: string }> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Project task ${taskId} not found`);
    await this.taskRepo.delete(taskId);
    await this.logHistoryEvent({
      action: 'project_task_remove',
      actorEmail,
      ownerEmail: task.ownerUserEmail || undefined,
      resourceCode: task.resourceCode || undefined,
      details: JSON.stringify({
        taskId: task.id,
        projectId: task.projectId,
        udActivityId: task.udActivityId,
        activityCode: task.activityCode,
        mesaNum: task.mesaNum,
        status: task.status,
      }),
    });
    return { message: `Project task ${taskId} removed` };
  }
}
