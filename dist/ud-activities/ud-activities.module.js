"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdActivitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ud_activities_controller_1 = require("./ud-activities.controller");
const ud_activities_service_1 = require("./ud-activities.service");
const ud_activity_model_1 = require("./ud-activity.model");
const user_activity_progress_model_1 = require("./user-activity-progress.model");
const user_activity_progress_controller_1 = require("./user-activity-progress.controller");
const user_activity_progress_service_1 = require("./user-activity-progress.service");
const project_task_model_1 = require("../projects/project-task.model");
const history_model_1 = require("../history/history.model");
const user_model_1 = require("../users/user.model");
const resource_model_1 = require("../resources/resource.model");
let UdActivitiesModule = class UdActivitiesModule {
};
exports.UdActivitiesModule = UdActivitiesModule;
exports.UdActivitiesModule = UdActivitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ud_activity_model_1.UdActivity, user_activity_progress_model_1.UserActivityProgress, project_task_model_1.ProjectTask, history_model_1.History, user_model_1.User, resource_model_1.Resource])],
        controllers: [ud_activities_controller_1.UdActivitiesController, user_activity_progress_controller_1.UserActivityProgressController, user_activity_progress_controller_1.ActivityReportsController],
        providers: [ud_activities_service_1.UdActivitiesService, user_activity_progress_service_1.UserActivityProgressService],
        exports: [ud_activities_service_1.UdActivitiesService, user_activity_progress_service_1.UserActivityProgressService],
    })
], UdActivitiesModule);
//# sourceMappingURL=ud-activities.module.js.map