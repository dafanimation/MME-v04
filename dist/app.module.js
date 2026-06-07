"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const resources_module_1 = require("./resources/resources.module");
const categories_module_1 = require("./categories/categories.module");
const history_module_1 = require("./history/history.module");
const import_export_module_1 = require("./import-export/import-export.module");
const admin_module_1 = require("./admin/admin.module");
const space_elements_module_1 = require("./space-elements/space-elements.module");
const projects_module_1 = require("./projects/projects.module");
const ud_activities_module_1 = require("./ud-activities/ud-activities.module");
const storage_locations_module_1 = require("./storage-locations/storage-locations.module");
const notifications_module_1 = require("./notifications/notifications.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_model_1 = require("./users/user.model");
const resource_model_1 = require("./resources/resource.model");
const category_model_1 = require("./categories/category.model");
const history_model_1 = require("./history/history.model");
const space_element_model_1 = require("./space-elements/space-element.model");
const project_model_1 = require("./projects/project.model");
const project_task_model_1 = require("./projects/project-task.model");
const ud_activity_model_1 = require("./ud-activities/ud-activity.model");
const user_activity_progress_model_1 = require("./ud-activities/user-activity-progress.model");
const storage_location_model_1 = require("./storage-locations/storage-location.model");
const whitelist_model_1 = require("./admin/whitelist.model");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'better-sqlite3',
                database: 'database.sqlite',
                entities: [
                    user_model_1.User,
                    resource_model_1.Resource,
                    category_model_1.Category,
                    history_model_1.History,
                    space_element_model_1.SpaceElement,
                    project_model_1.Project,
                    project_task_model_1.ProjectTask,
                    ud_activity_model_1.UdActivity,
                    user_activity_progress_model_1.UserActivityProgress,
                    storage_location_model_1.StorageLocation,
                    whitelist_model_1.WhitelistEntry,
                ],
                synchronize: true,
                logging: false,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            resources_module_1.ResourcesModule,
            categories_module_1.CategoriesModule,
            history_module_1.HistoryModule,
            import_export_module_1.ImportExportModule,
            admin_module_1.AdminModule,
            space_elements_module_1.SpaceElementsModule,
            projects_module_1.ProjectsModule,
            ud_activities_module_1.UdActivitiesModule,
            storage_locations_module_1.StorageLocationsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map