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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_model_1 = require("./user.model");
const resource_model_1 = require("../resources/resource.model");
let UsersService = class UsersService {
    constructor(userRepository, resourceRepository) {
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }
    async findAll(query) {
        const { active, role, kingdom, page = 1, limit = 10 } = query;
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (active !== undefined) {
            queryBuilder.andWhere('user.active = :active', { active });
        }
        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }
        if (kingdom) {
            queryBuilder.andWhere('user.kingdom = :kingdom', { kingdom });
        }
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        queryBuilder.orderBy('user.id', 'DESC');
        const [data, total] = await queryBuilder.getManyAndCount();
        return { data, total };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
    async findUserResources(userId) {
        return this.resourceRepository.find({
            where: { assignedToUserId: userId },
            order: { code: 'ASC' },
        });
    }
    async create(createUserDto) {
        const newUser = this.userRepository.create({
            ...createUserDto,
            active: true,
            createdAt: new Date().toISOString(),
        });
        return this.userRepository.save(newUser);
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.delete(id);
        return user;
    }
    async upgradeRole(userId, role) {
        await this.userRepository.update(userId, { role });
        return this.findOne(userId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(resource_model_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map