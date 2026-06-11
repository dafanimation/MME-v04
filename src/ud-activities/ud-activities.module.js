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
exports.UdActivitiesModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var ud_activities_controller_1 = require("./ud-activities.controller");
var ud_activities_service_1 = require("./ud-activities.service");
var ud_activity_model_1 = require("./ud-activity.model");
var user_activity_progress_model_1 = require("./user-activity-progress.model");
var user_activity_progress_controller_1 = require("./user-activity-progress.controller");
var user_activity_progress_service_1 = require("./user-activity-progress.service");
var project_task_model_1 = require("../projects/project-task.model");
var history_model_1 = require("../history/history.model");
var user_model_1 = require("../users/user.model");
var resource_model_1 = require("../resources/resource.model");
var UdActivitiesModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([ud_activity_model_1.UdActivity, user_activity_progress_model_1.UserActivityProgress, project_task_model_1.ProjectTask, history_model_1.History, user_model_1.User, resource_model_1.Resource])],
            controllers: [ud_activities_controller_1.UdActivitiesController, user_activity_progress_controller_1.UserActivityProgressController, user_activity_progress_controller_1.ActivityReportsController],
            providers: [ud_activities_service_1.UdActivitiesService, user_activity_progress_service_1.UserActivityProgressService],
            exports: [ud_activities_service_1.UdActivitiesService, user_activity_progress_service_1.UserActivityProgressService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UdActivitiesModule = _classThis = /** @class */ (function () {
        function UdActivitiesModule_1() {
        }
        return UdActivitiesModule_1;
    }());
    __setFunctionName(_classThis, "UdActivitiesModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UdActivitiesModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UdActivitiesModule = _classThis;
}();
exports.UdActivitiesModule = UdActivitiesModule;
