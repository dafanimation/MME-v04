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
exports.ResourceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_model_1 = require("./resource.model");
const user_model_1 = require("../users/user.model");
let ResourceService = class ResourceService {
    constructor(resourceRepository, userRepository) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }
    async findAll(query) {
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
    async findOne(id) {
        const resource = await this.resourceRepository.findOne({ where: { id } });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with id ${id} not found`);
        }
        return this.enrichResource(resource);
    }
    async findUserResources(userId) {
        const list = await this.resourceRepository.find({
            where: { assignedToUserId: userId },
            order: { code: 'ASC' },
        });
        return this.enrichResources(list);
    }
    async create(createResourceDto) {
        const { userId, ...resourceData } = createResourceDto;
        const newResource = this.resourceRepository.create({
            ...resourceData,
            assignedToUserId: userId !== undefined ? userId : null,
            createdAt: new Date().toISOString(),
        });
        const saved = await this.resourceRepository.save(newResource);
        if (!saved.qrCode) {
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
            saved.qrCode = `${baseUrl}/recursos/${saved.id}`;
            await this.resourceRepository.save(saved);
        }
        return this.enrichResource(saved);
    }
    async update(id, updateResourceDto) {
        const resource = await this.findOne(id);
        const { userId, ...updateData } = updateResourceDto;
        if (userId !== undefined) {
            resource.assignedToUserId = userId;
        }
        const cleanUpdate = Object.fromEntries(Object.entries(updateData).filter(([, v]) => v !== undefined));
        Object.assign(resource, cleanUpdate);
        return this.resourceRepository.save(resource);
    }
    async remove(id) {
        const resource = await this.findOne(id);
        await this.resourceRepository.delete(id);
        return resource;
    }
    async count() {
        return this.resourceRepository.count();
    }
    async countByStatus(status) {
        return this.resourceRepository.count({ where: { status } });
    }
    async getCurrentAssignments() {
        const list = await this.resourceRepository.find({
            where: { status: 'assigned' },
            order: { code: 'ASC' },
        });
        return this.enrichResources(list);
    }
    async releaseResource(resourceCode, requester) {
        const resource = await this.resourceRepository.findOne({
            where: { code: resourceCode },
        });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource ${resourceCode} not found`);
        }
        if (requester) {
            const role = String(requester.role || '').toLowerCase();
            const isAdmin = role === 'admin' ||
                role === 'admin_master' ||
                role === 'admin master';
            if (!isAdmin && resource.assignedToUserId !== requester.userId) {
                throw new common_1.ForbiddenException(`Resource ${resourceCode} is not assigned to current user`);
            }
        }
        resource.status = 'available';
        resource.assignedToUserId = null;
        const saved = await this.resourceRepository.save(resource);
        return this.enrichResource(saved);
    }
    async assignResource(resourceCode, userEmail, location) {
        const resource = await this.resourceRepository.findOne({ where: { code: resourceCode } });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource ${resourceCode} not found`);
        }
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${userEmail} not found`);
        }
        resource.status = 'assigned';
        resource.assignedToUserId = user.id;
        if (location &&
            Number.isFinite(location.x) &&
            Number.isFinite(location.z)) {
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
    async selfAssignResource(resourceCode, userId, userEmail, location) {
        const resource = await this.resourceRepository.findOne({
            where: { code: resourceCode },
        });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource ${resourceCode} not found`);
        }
        const availableStatuses = ['available', 'review'];
        const isAssignedToCurrentUser = resource.assignedToUserId === userId;
        if (!isAssignedToCurrentUser && !availableStatuses.includes(resource.status)) {
            throw new common_1.ConflictException(`Resource ${resourceCode} is not available for self-assign`);
        }
        resource.assignedToUserId = userId;
        resource.status = 'assigned';
        if (location &&
            Number.isFinite(location.x) &&
            Number.isFinite(location.z)) {
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
    async enrichResources(resources) {
        if (!resources.length)
            return [];
        const assignedIds = [...new Set(resources
                .map((r) => r.assignedToUserId)
                .filter((id) => typeof id === 'number' && Number.isFinite(id)))];
        const usersById = new Map();
        if (assignedIds.length) {
            const users = await this.userRepository.find({ where: { id: (0, typeorm_2.In)(assignedIds) } });
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
    async enrichResource(resource) {
        const [item] = await this.enrichResources([resource]);
        return item;
    }
};
exports.ResourceService = ResourceService;
exports.ResourceService = ResourceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_model_1.Resource)),
    __param(1, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ResourceService);
//# sourceMappingURL=resource.service.js.map