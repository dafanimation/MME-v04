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
exports.StorageLocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const storage_location_model_1 = require("./storage-location.model");
let StorageLocationsService = class StorageLocationsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(filters) {
        const query = this.repo.createQueryBuilder('s').orderBy('s.zone', 'ASC').addOrderBy('s.label', 'ASC');
        if (filters.room)
            query.andWhere('LOWER(s.room) = :room', { room: String(filters.room).toLowerCase() });
        if (filters.type)
            query.andWhere('LOWER(s.type) = :type', { type: String(filters.type).toLowerCase() });
        if (filters.zone)
            query.andWhere('LOWER(s.zone) = :zone', { zone: String(filters.zone).toLowerCase() });
        if (filters.active != null) {
            const active = String(filters.active).toLowerCase();
            if (active === 'true' || active === '1')
                query.andWhere('s.active = :active', { active: true });
            if (active === 'false' || active === '0')
                query.andWhere('s.active = :active', { active: false });
        }
        return query.getMany();
    }
    async findOne(id) {
        const row = await this.repo.findOne({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException(`Storage location ${id} not found`);
        return row;
    }
    async create(payload) {
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
    async update(id, payload) {
        const row = await this.findOne(id);
        if (payload.type !== undefined)
            row.type = String(payload.type || row.type).toUpperCase();
        if (payload.zone !== undefined)
            row.zone = String(payload.zone || row.zone).toUpperCase();
        if (payload.row !== undefined)
            row.row = payload.row ? String(payload.row).toUpperCase() : null;
        if (payload.module !== undefined)
            row.module = payload.module ? String(payload.module).toUpperCase() : null;
        if (payload.label !== undefined)
            row.label = payload.label ? String(payload.label) : null;
        if (payload.room !== undefined)
            row.room = payload.room ? String(payload.room).toUpperCase() : null;
        if (payload.capacity !== undefined)
            row.capacity = Number(payload.capacity || 0);
        if (payload.active !== undefined)
            row.active = Boolean(payload.active);
        if (payload.coordinates !== undefined)
            row.coordinates = payload.coordinates || null;
        row.updatedAt = new Date().toISOString();
        return this.repo.save(row);
    }
    async remove(id) {
        await this.findOne(id);
        await this.repo.delete(id);
        return { message: `Storage location ${id} removed` };
    }
};
exports.StorageLocationsService = StorageLocationsService;
exports.StorageLocationsService = StorageLocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(storage_location_model_1.StorageLocation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StorageLocationsService);
//# sourceMappingURL=storage-locations.service.js.map