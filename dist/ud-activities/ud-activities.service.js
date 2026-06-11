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
exports.UdActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ud_activity_model_1 = require("./ud-activity.model");
const project_task_model_1 = require("../projects/project-task.model");
const history_model_1 = require("../history/history.model");
const resource_model_1 = require("../resources/resource.model");
const user_model_1 = require("../users/user.model");
let UdActivitiesService = class UdActivitiesService {
    constructor(udRepo, taskRepo, historyRepo, userRepo, resourceRepo) {
        this.udRepo = udRepo;
        this.taskRepo = taskRepo;
        this.historyRepo = historyRepo;
        this.userRepo = userRepo;
        this.resourceRepo = resourceRepo;
    }
    normalizeList(input) {
        if (!Array.isArray(input))
            return [];
        return input.map((v) => String(v || '').trim()).filter(Boolean);
    }
    async resolveActor(email) {
        const normalizedEmail = String(email || '').toLowerCase().trim();
        if (!normalizedEmail)
            return { id: 0 };
        const user = await this.userRepo.findOne({ where: { email: normalizedEmail } });
        if (!user)
            return { id: 0, name: normalizedEmail };
        return { id: user.id, name: user.name || user.email };
    }
    async logHistory(action, details, actorEmail) {
        const actor = await this.resolveActor(actorEmail);
        const codes = this.normalizeList(details.resourceTypes);
        const primaryCode = codes[0] ? String(codes[0]).toUpperCase() : null;
        const resource = primaryCode
            ? await this.resourceRepo.findOne({ where: { code: primaryCode } })
            : null;
        const row = {
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
    async findAll(filters) {
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
    async findOne(id) {
        const row = await this.udRepo.findOne({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException(`UD activity ${id} not found`);
        return row;
    }
    async create(payload, actorEmail) {
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
        await this.logHistory('ud_activity_create', {
            udActivityId: saved.id,
            udCode: saved.udCode,
            title: saved.title,
            projectId: saved.projectId,
            resourceTypes: saved.resourceTypes,
        }, actorEmail);
        return saved;
    }
    async update(id, payload, actorEmail) {
        const row = await this.findOne(id);
        if (payload.udCode !== undefined)
            row.udCode = String(payload.udCode || row.udCode).toUpperCase();
        if (payload.title !== undefined)
            row.title = String(payload.title || row.title).trim();
        if (payload.date !== undefined)
            row.date = payload.date ? String(payload.date) : null;
        if (payload.statement !== undefined)
            row.statement = payload.statement ? String(payload.statement) : null;
        if (payload.requiredEquipment !== undefined)
            row.requiredEquipment = this.normalizeList(payload.requiredEquipment);
        if (payload.assignmentMode !== undefined)
            row.assignmentMode = String(payload.assignmentMode || row.assignmentMode);
        if (payload.resourceTypes !== undefined)
            row.resourceTypes = this.normalizeList(payload.resourceTypes);
        if (payload.links !== undefined)
            row.links = this.normalizeList(payload.links);
        if (payload.images !== undefined)
            row.images = this.normalizeList(payload.images);
        if (payload.projectId !== undefined)
            row.projectId = payload.projectId != null ? Number(payload.projectId) : null;
        if (payload.status !== undefined)
            row.status = String(payload.status || row.status);
        row.updatedAt = new Date().toISOString();
        const saved = await this.udRepo.save(row);
        await this.logHistory('ud_activity_update', {
            udActivityId: saved.id,
            udCode: saved.udCode,
            title: saved.title,
            projectId: saved.projectId,
            resourceTypes: saved.resourceTypes,
        }, actorEmail);
        return saved;
    }
    async remove(id, actorEmail) {
        const row = await this.findOne(id);
        await this.taskRepo.update({ udActivityId: id }, { udActivityId: null });
        await this.udRepo.delete(id);
        await this.logHistory('ud_activity_remove', {
            udActivityId: row.id,
            udCode: row.udCode,
            title: row.title,
            projectId: row.projectId,
        }, actorEmail);
        return { message: `UD activity ${id} removed` };
    }
    async linkTask(id, taskId, actorEmail) {
        await this.findOne(id);
        const task = await this.taskRepo.findOne({ where: { id: taskId } });
        if (!task)
            throw new common_1.NotFoundException(`Project task ${taskId} not found`);
        task.udActivityId = id;
        task.updatedAt = new Date().toISOString();
        const savedTask = await this.taskRepo.save(task);
        await this.logHistory('ud_activity_link_task', {
            udActivityId: id,
            taskId,
            projectId: savedTask.projectId,
            resourceTypes: savedTask.resourceCode ? [savedTask.resourceCode] : [],
        }, actorEmail);
        return savedTask;
    }
    async addImage(id, imageUrl, actorEmail) {
        const row = await this.findOne(id);
        const current = Array.isArray(row.images) ? row.images : [];
        row.images = [...current, imageUrl];
        row.updatedAt = new Date().toISOString();
        const saved = await this.udRepo.save(row);
        await this.logHistory('ud_activity_add_image', {
            udActivityId: saved.id,
            imageUrl,
            resourceTypes: saved.resourceTypes,
        }, actorEmail);
        return saved;
    }
    async unlinkTask(taskId, actorEmail) {
        const task = await this.taskRepo.findOne({ where: { id: taskId } });
        if (!task)
            throw new common_1.NotFoundException(`Project task ${taskId} not found`);
        const previousUdActivityId = task.udActivityId;
        task.udActivityId = null;
        task.updatedAt = new Date().toISOString();
        const savedTask = await this.taskRepo.save(task);
        await this.logHistory('ud_activity_unlink_task', {
            udActivityId: previousUdActivityId,
            taskId,
            projectId: savedTask.projectId,
        }, actorEmail);
        return savedTask;
    }
};
exports.UdActivitiesService = UdActivitiesService;
exports.UdActivitiesService = UdActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ud_activity_model_1.UdActivity)),
    __param(1, (0, typeorm_1.InjectRepository)(project_task_model_1.ProjectTask)),
    __param(2, (0, typeorm_1.InjectRepository)(history_model_1.History)),
    __param(3, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(resource_model_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UdActivitiesService);
//# sourceMappingURL=ud-activities.service.js.map