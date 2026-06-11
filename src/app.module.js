"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("./auth/auth.module");
var users_module_1 = require("./users/users.module");
var resources_module_1 = require("./resources/resources.module");
var categories_module_1 = require("./categories/categories.module");
var history_module_1 = require("./history/history.module");
var import_export_module_1 = require("./import-export/import-export.module");
var admin_module_1 = require("./admin/admin.module");
var space_elements_module_1 = require("./space-elements/space-elements.module");
var projects_module_1 = require("./projects/projects.module");
var ud_activities_module_1 = require("./ud-activities/ud-activities.module");
var storage_locations_module_1 = require("./storage-locations/storage-locations.module");
var notifications_module_1 = require("./notifications/notifications.module");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var user_model_1 = require("./users/user.model");
var resource_model_1 = require("./resources/resource.model");
var category_model_1 = require("./categories/category.model");
var history_model_1 = require("./history/history.model");
var space_element_model_1 = require("./space-elements/space-element.model");
var project_model_1 = require("./projects/project.model");
var project_task_model_1 = require("./projects/project-task.model");
var ud_activity_model_1 = require("./ud-activities/ud-activity.model");
var user_activity_progress_model_1 = require("./ud-activities/user-activity-progress.model");
var storage_location_model_1 = require("./storage-locations/storage-location.model");
var whitelist_model_1 = require("./admin/whitelist.model");
var upload_module_1 = require("./upload/upload.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
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
                upload_module_1.UploadModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
