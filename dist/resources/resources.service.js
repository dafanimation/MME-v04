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
    resourceRepository;
    userRepository;
    constructor(resourceRepository, userRepository) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }
    async count() {
        return this.resourceRepository.count();
    }
    async countByStatus(status) {
        if (status === 'assigned') {
            return this.resourceRepository.count({
                where: { status: (0, typeorm_2.In)(['assigned', 'shared', 'occupied']) },
            });
        }
        return this.resourceRepository.count({ where: { status } });
    }
    async getCurrentAssignments() {
        return this.resourceRepository
            .createQueryBuilder('resource')
            .where('resource.assignedToUserId IS NOT NULL')
            .andWhere('resource.status IN (:...statuses)', {
            statuses: ['assigned', 'shared', 'occupied'],
        })
            .orderBy('resource.id', 'DESC')
            .getMany();
    }
    async assignResource(resourceCode, userEmail) {
        const resource = await this.resourceRepository.findOne({ where: { code: resourceCode } });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with code ${resourceCode} not found`);
        }
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${userEmail} not found`);
        }
        resource.assignedToUserId = user.id;
        resource.status = 'assigned';
        return this.resourceRepository.save(resource);
    }
    async releaseResource(resourceCode) {
        const resource = await this.resourceRepository.findOne({ where: { code: resourceCode } });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with code ${resourceCode} not found`);
        }
        resource.assignedToUserId = null;
        resource.status = 'available';
        return this.resourceRepository.save(resource);
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
        return { data, total };
    }
    async findOne(id) {
        const resource = await this.resourceRepository.findOne({
            where: { id },
        });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with id ${id} not found`);
        }
        return resource;
    }
    async findUserResources(userId) {
        return this.resourceRepository.find({
            where: { assignedToUserId: userId },
            order: { code: 'ASC' },
        });
    }
    async create(createResourceDto) {
        const { userId, ...resourceData } = createResourceDto;
        const newResource = this.resourceRepository.create({
            ...resourceData,
            assignedToUserId: userId !== undefined ? userId : null,
            createdAt: new Date().toISOString(),
        });
        return this.resourceRepository.save(newResource);
    }
    async update(id, updateResourceDto) {
        const resource = await this.findOne(id);
        const { userId, ...updateData } = updateResourceDto;
        if (userId !== undefined) {
            resource.assignedToUserId = userId;
        }
        Object.assign(resource, updateData);
        return this.resourceRepository.save(resource);
    }
    async remove(id) {
        const resource = await this.findOne(id);
        await this.resourceRepository.delete(id);
        return resource;
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
//# sourceMappingURL=resources.service.js.map