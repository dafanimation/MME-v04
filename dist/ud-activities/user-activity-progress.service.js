"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_activity_progress_model_1 = require("./user-activity-progress.model");
let UserActivityProgressService = class UserActivityProgressService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getProgress(activityId, userId) {
        return this.repo.findOne({ where: { activityId, userId } });
    }
    async getAllProgressForActivity(activityId) {
        return this.repo.find({ where: { activityId }, order: { userId: 'ASC' } });
    }
    async getMyProgress(userId) {
        return this.repo.find({ where: { userId }, order: { activityId: 'ASC' } });
    }
    async startOrUpdate(activityId, userId, update) {
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
        if (update.completedSteps !== undefined)
            progress.completedSteps = update.completedSteps;
        if (update.completedCheckmarks !== undefined)
            progress.completedCheckmarks = update.completedCheckmarks;
        if (update.progressPercent !== undefined)
            progress.progressPercent = update.progressPercent;
        if (update.resourcesUsed !== undefined)
            progress.resourcesUsed = update.resourcesUsed;
        if (progress.status === 'pending')
            progress.status = 'in_progress';
        progress.updatedAt = now;
        return this.repo.save(progress);
    }
    async submit(activityId, userId) {
        const progress = await this.repo.findOne({ where: { activityId, userId } });
        if (!progress)
            throw new common_1.NotFoundException('Progrés no trobat');
        progress.status = 'submitted';
        progress.submittedAt = new Date().toISOString();
        progress.updatedAt = progress.submittedAt;
        return this.repo.save(progress);
    }
    async validate(activityId, userId, validatorEmail, grade) {
        const progress = await this.repo.findOne({ where: { activityId, userId } });
        if (!progress)
            throw new common_1.NotFoundException('Progrés no trobat');
        progress.status = 'validated';
        progress.grade = grade;
        progress.validatedBy = validatorEmail;
        progress.updatedAt = new Date().toISOString();
        return this.repo.save(progress);
    }
    async returnActivity(activityId, userId, reason) {
        const progress = await this.repo.findOne({ where: { activityId, userId } });
        if (!progress)
            throw new common_1.NotFoundException('Progrés no trobat');
        progress.status = 'returned';
        progress.returnedReason = reason;
        progress.updatedAt = new Date().toISOString();
        return this.repo.save(progress);
    }
    async getReport(filters) {
        const qb = this.repo.createQueryBuilder('p');
        if (filters.userId)
            qb.andWhere('p.userId = :u', { u: filters.userId });
        if (filters.activityId)
            qb.andWhere('p.activityId = :a', { a: filters.activityId });
        if (filters.status)
            qb.andWhere('p.status = :s', { s: filters.status });
        const items = await qb.getMany();
        const total = items.length;
        const byStatus = items.reduce((acc, i) => {
            acc[i.status] = (acc[i.status] || 0) + 1;
            return acc;
        }, {});
        const grades = items.filter(i => i.grade !== null).map(i => i.grade);
        const avgGrade = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : null;
        return { total, byStatus, avgGrade: avgGrade ? Math.round(avgGrade * 10) / 10 : null, items };
    }
};
exports.UserActivityProgressService = UserActivityProgressService;
exports.UserActivityProgressService = UserActivityProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_activity_progress_model_1.UserActivityProgress)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserActivityProgressService);
//# sourceMappingURL=user-activity-progress.service.js.map