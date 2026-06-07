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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getWhitelist(academicYear, module) {
        return this.adminService.getWhitelist({ academicYear, module });
    }
    async addToWhitelist(req, body) {
        return this.adminService.addToWhitelist(body.email, {
            academicYear: body.academicYear,
            module: body.module,
            approvedBy: req.user.email,
        });
    }
    async removeFromWhitelist(email) {
        return this.adminService.removeFromWhitelist(email);
    }
    async closeYear(academicYear) {
        return this.adminService.closeAcademicYear(academicYear);
    }
    async getHelpDocs() {
        return this.adminService.getHelpDocs();
    }
    async saveHelpDocs(req, docs) {
        return this.adminService.saveHelpDocs(docs, req?.user?.email || 'admin');
    }
    async getHelpDocsHistory() {
        return this.adminService.getHelpDocsHistory();
    }
    async exportHelpDocsMarkdown() {
        return this.adminService.exportHelpDocsMarkdown();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Get)('whitelist'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getWhitelist", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('whitelist'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addToWhitelist", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Delete)('whitelist/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeFromWhitelist", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Post)('whitelist/close-year'),
    __param(0, (0, common_1.Body)('academicYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "closeYear", null);
__decorate([
    (0, common_1.Get)('help-docs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHelpDocs", null);
__decorate([
    (0, roles_decorator_1.Roles)('admin', 'bip'),
    (0, common_1.Post)('help-docs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "saveHelpDocs", null);
__decorate([
    (0, common_1.Get)('help-docs/history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getHelpDocsHistory", null);
__decorate([
    (0, common_1.Get)('help-docs/export'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportHelpDocsMarkdown", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map