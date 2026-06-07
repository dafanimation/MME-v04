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
exports.ActivityReportsController = exports.UserActivityProgressController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_activity_progress_service_1 = require("./user-activity-progress.service");
let UserActivityProgressController = class UserActivityProgressController {
    progressService;
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getMyProgress(activityId, req) {
        return this.progressService.getProgress(activityId, req.user.userId);
    }
    async getAllProgress(activityId) {
        return this.progressService.getAllProgressForActivity(activityId);
    }
    async updateMyProgress(activityId, req, body) {
        return this.progressService.startOrUpdate(activityId, req.user.userId, body);
    }
    async submit(activityId, req) {
        return this.progressService.submit(activityId, req.user.userId);
    }
    async validate(activityId, userId, req, grade) {
        return this.progressService.validate(activityId, userId, req.user.email, grade);
    }
    async returnActivity(activityId, userId, reason) {
        return this.progressService.returnActivity(activityId, userId, reason);
    }
};
exports.UserActivityProgressController = UserActivityProgressController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Param)('activityId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserActivityProgressController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'bip'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('activityId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserActivityProgressController.prototype, "getAllProgress", null);
__decorate([
    (0, common_1.Post)('me'),
    __param(0, (0, common_1.Param)('activityId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserActivityProgressController.prototype, "updateMyProgress", null);
__decorate([
    (0, common_1.Post)('me/submit'),
    __param(0, (0, common_1.Param)('activityId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserActivityProgressController.prototype, "submit", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'bip'),
    (0, common_1.Post)(':userId/validate'),
    __param(0, (0, common_1.Param)('activityId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Body)('grade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Number]),
    __metadata("design:returntype", Promise)
], UserActivityProgressController.prototype, "validate", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'bip'),
    (0, common_1.Post)(':userId/return'),
    __param(0, (0, common_1.Param)('activityId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserActivityProgressController.prototype, "returnActivity", null);
exports.UserActivityProgressController = UserActivityProgressController = __decorate([
    (0, common_1.Controller)('ud-activities/:activityId/progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_activity_progress_service_1.UserActivityProgressService])
], UserActivityProgressController);
let ActivityReportsController = class ActivityReportsController {
    progressService;
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getActivityReport(userId, activityId, status) {
        return this.progressService.getReport({
            userId: userId ? parseInt(userId) : undefined,
            activityId: activityId ? parseInt(activityId) : undefined,
            status,
        });
    }
    async getStudentReport(userId) {
        return this.progressService.getMyProgress(userId);
    }
};
exports.ActivityReportsController = ActivityReportsController;
__decorate([
    (0, common_1.Get)('activities'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('activityId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ActivityReportsController.prototype, "getActivityReport", null);
__decorate([
    (0, common_1.Get)('student/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ActivityReportsController.prototype, "getStudentReport", null);
exports.ActivityReportsController = ActivityReportsController = __decorate([
    (0, common_1.Controller)('admin/reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'bip'),
    __metadata("design:paramtypes", [user_activity_progress_service_1.UserActivityProgressService])
], ActivityReportsController);
//# sourceMappingURL=user-activity-progress.controller.js.map