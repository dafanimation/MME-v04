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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("./upload.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UploadController = class UploadController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadActivityImage(file, udCode, stepId, req) {
        const userId = req.user?.userId ?? req.user?.sub ?? req.user?.id;
        if (!userId) {
            console.error('req.user recibido:', req.user);
            throw new Error('Usuario no autenticado: token sin userId');
        }
        if (!file)
            throw new Error('No se recibió imagen');
        if (!udCode || !stepId)
            throw new Error('Faltan udCode o stepId');
        const url = await this.uploadService.saveImage(file, Number(userId), udCode, stepId);
        return { url };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('activity-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (allowed.includes(file.mimetype))
                cb(null, true);
            else
                cb(new Error('Formato no soportado'), false);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('udCode')),
    __param(2, (0, common_1.Body)('stepId')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadActivityImage", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map