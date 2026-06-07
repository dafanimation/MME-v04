import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivityProgress } from './user-activity-progress.model';

@Injectable()
export class UserActivityProgressService {
  constructor(
    @InjectRepository(UserActivityProgress)
    private repo: Repository<UserActivityProgress>,
  ) {}

  async getProgress(activityId: number, userId: number): Promise<UserActivityProgress | null> {
    return this.repo.findOne({ where: { activityId, userId } });
  }

  async getAllProgressForActivity(activityId: number): Promise<UserActivityProgress[]> {
    return this.repo.find({ where: { activityId }, order: { userId: 'ASC' } });
  }

  async getMyProgress(userId: number): Promise<UserActivityProgress[]> {
    return this.repo.find({ where: { userId }, order: { activityId: 'ASC' } });
  }

  async startOrUpdate(
    activityId: number,
    userId: number,
    update: {
      completedSteps?: string[];
      completedCheckmarks?: string[];
      progressPercent?: number;
      resourcesUsed?: number[];
    },
  ): Promise<UserActivityProgress> {
    let progress = await this.repo.findOne({ where: { activityId, userId } });
    const now = new Date().toISOString();

    if (!progress) {
      progress = this.repo.create({
        activityId,
        userId,
        status: 'in_progress',
        progressPercent: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    if (update.completedSteps !== undefined) progress.completedSteps = update.completedSteps;
    if (update.completedCheckmarks !== undefined) progress.completedCheckmarks = update.completedCheckmarks;
    if (update.progressPercent !== undefined) progress.progressPercent = update.progressPercent;
    if (update.resourcesUsed !== undefined) progress.resourcesUsed = update.resourcesUsed;
    if (progress.status === 'pending') progress.status = 'in_progress';
    progress.updatedAt = now;

    return this.repo.save(progress);
  }

  async submit(activityId: number, userId: number): Promise<UserActivityProgress> {
    const progress = await this.repo.findOne({ where: { activityId, userId } });
    if (!progress) throw new NotFoundException('Progrés no trobat');

    progress.status = 'submitted';
    progress.submittedAt = new Date().toISOString();
    progress.updatedAt = progress.submittedAt;
    return this.repo.save(progress);
  }

  async validate(
    activityId: number,
    userId: number,
    validatorEmail: string,
    grade: number,
  ): Promise<UserActivityProgress> {
    const progress = await this.repo.findOne({ where: { activityId, userId } });
    if (!progress) throw new NotFoundException('Progrés no trobat');

    progress.status = 'validated';
    progress.grade = grade;
    progress.validatedBy = validatorEmail;
    progress.updatedAt = new Date().toISOString();
    return this.repo.save(progress);
  }

  async returnActivity(
    activityId: number,
    userId: number,
    reason: string,
  ): Promise<UserActivityProgress> {
    const progress = await this.repo.findOne({ where: { activityId, userId } });
    if (!progress) throw new NotFoundException('Progrés no trobat');

    progress.status = 'returned';
    progress.returnedReason = reason;
    progress.updatedAt = new Date().toISOString();
    return this.repo.save(progress);
  }

  async getReport(filters: { userId?: number; activityId?: number; status?: string }) {
    const qb = this.repo.createQueryBuilder('p');
    if (filters.userId) qb.andWhere('p.userId = :u', { u: filters.userId });
    if (filters.activityId) qb.andWhere('p.activityId = :a', { a: filters.activityId });
    if (filters.status) qb.andWhere('p.status = :s', { s: filters.status });
    const items = await qb.getMany();

    const total = items.length;
    const byStatus = items.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const grades = items.filter(i => i.grade !== null).map(i => i.grade);
    const avgGrade = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : null;

    return { total, byStatus, avgGrade: avgGrade ? Math.round(avgGrade * 10) / 10 : null, items };
  }
}
