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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityProgress = void 0;
const typeorm_1 = require("typeorm");
let UserActivityProgress = class UserActivityProgress {
};
exports.UserActivityProgress = UserActivityProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserActivityProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserActivityProgress.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserActivityProgress.prototype, "activityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], UserActivityProgress.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserActivityProgress.prototype, "progressPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'simple-json' }),
    __metadata("design:type", Array)
], UserActivityProgress.prototype, "completedSteps", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'simple-json' }),
    __metadata("design:type", Array)
], UserActivityProgress.prototype, "completedCheckmarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'real' }),
    __metadata("design:type", Number)
], UserActivityProgress.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserActivityProgress.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserActivityProgress.prototype, "validatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserActivityProgress.prototype, "returnedReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'simple-json' }),
    __metadata("design:type", Array)
], UserActivityProgress.prototype, "resourcesUsed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserActivityProgress.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserActivityProgress.prototype, "updatedAt", void 0);
exports.UserActivityProgress = UserActivityProgress = __decorate([
    (0, typeorm_1.Entity)('user_activity_progress')
], UserActivityProgress);
//# sourceMappingURL=user-activity-progress.model.js.map