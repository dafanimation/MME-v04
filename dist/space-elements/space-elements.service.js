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
exports.SpaceElementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const space_element_model_1 = require("./space-element.model");
let SpaceElementsService = class SpaceElementsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(filters) {
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
    async upsert(payload, actorEmail) {
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
    async remove(id) {
        const existing = await this.repo.findOne({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Space element ${id} not found`);
        }
        await this.repo.delete(id);
        return { message: `Space element ${id} removed` };
    }
};
exports.SpaceElementsService = SpaceElementsService;
exports.SpaceElementsService = SpaceElementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(space_element_model_1.SpaceElement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SpaceElementsService);
//# sourceMappingURL=space-elements.service.js.map