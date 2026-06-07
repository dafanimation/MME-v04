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
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const create_resource_dto_1 = require("./dto/create-resource.dto");
const find_resources_query_dto_1 = require("./dto/find-resources-query.dto");
const update_resource_dto_1 = require("./dto/update-resource.dto");
const resource_service_1 = require("./resource.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ResourcesController = class ResourcesController {
    resourceService;
    constructor(resourceService) {
        this.resourceService = resourceService;
    }
    async findAll(query) {
        return this.resourceService.findAll(query);
    }
    async create(createResourceDto) {
        return this.resourceService.create(createResourceDto);
    }
    async update(id, updateResourceDto) {
        return this.resourceService.update(id, updateResourceDto);
    }
    async remove(id) {
        return this.resourceService.remove(id);
    }
    async getStats() {
        const totalResources = await this.resourceService.count();
        const availableResources = await this.resourceService.countByStatus('available');
        const assignedResources = await this.resourceService.countByStatus('assigned');
        return {
            total_resources: totalResources,
            available_resources: availableResources,
            assigned_resources: assignedResources,
            total_students: 0,
        };
    }
    async getCurrentAssignments() {
        return this.resourceService.getCurrentAssignments();
    }
    async getUserResources(userId) {
        return this.resourceService.findUserResources(userId);
    }
    async releaseResource(req, resourceCode) {
        return this.resourceService.releaseResource(resourceCode, req.user);
    }
    async assignResource(body) {
        return this.resourceService.assignResource(body.resource_code, body.user_email, body.location);
    }
    async getMyResources(req) {
        return this.resourceService.findUserResources(req.user.userId);
    }
    async selfAssignResource(req, body) {
        return this.resourceService.selfAssignResource(body.resource_code, req.user.userId, req.user.email, body.location);
    }
    async findOne(id) {
        return this.resourceService.findOne(id);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_resources_query_dto_1.FindResourcesQueryDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_resource_dto_1.CreateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_resource_dto_1.UpdateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('stats/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('assignments/current'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getCurrentAssignments", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getUserResources", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('release'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('resource_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "releaseResource", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "assignResource", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getMyResources", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('self-assign'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "selfAssignResource", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findOne", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, common_1.Controller)('resources'),
    __metadata("design:paramtypes", [resource_service_1.ResourceService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map