"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var ProjectsController = function () {
    var _classDecorators = [(0, common_1.Controller)('projects'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findProjects_decorators;
    var _findProject_decorators;
    var _exportProjectPdf_decorators;
    var _createProject_decorators;
    var _updateProject_decorators;
    var _removeProject_decorators;
    var _uploadProjectImage_decorators;
    var _findTasks_decorators;
    var _createTask_decorators;
    var _updateTask_decorators;
    var _removeTask_decorators;
    var ProjectsController = _classThis = /** @class */ (function () {
        function ProjectsController_1(projectsService) {
            this.projectsService = (__runInitializers(this, _instanceExtraInitializers), projectsService);
        }
        ProjectsController_1.prototype.findProjects = function (status, title) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.findProjects({ status: status, title: title })];
                });
            });
        };
        ProjectsController_1.prototype.findProject = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.findProject(id)];
                });
            });
        };
        ProjectsController_1.prototype.exportProjectPdf = function (id, res) {
            return __awaiter(this, void 0, void 0, function () {
                var pdf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.projectsService.exportProjectPdf(id)];
                        case 1:
                            pdf = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': "attachment; filename=\"project-".concat(id, ".pdf\""),
                                'Cache-Control': 'no-store',
                            });
                            return [2 /*return*/, new common_1.StreamableFile(pdf)];
                    }
                });
            });
        };
        ProjectsController_1.prototype.createProject = function (req, body) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, this.projectsService.createProject(body, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                });
            });
        };
        ProjectsController_1.prototype.updateProject = function (req, id, body) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, this.projectsService.updateProject(id, body, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                });
            });
        };
        ProjectsController_1.prototype.removeProject = function (req, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, this.projectsService.removeProject(id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                });
            });
        };
        ProjectsController_1.prototype.uploadProjectImage = function (req, id, file) {
            return __awaiter(this, void 0, void 0, function () {
                var fileUrl, project;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(file === null || file === void 0 ? void 0 : file.filename)) {
                                return [2 /*return*/, { message: 'No file uploaded' }];
                            }
                            fileUrl = "/uploads/projects/".concat(file.filename);
                            return [4 /*yield*/, this.projectsService.addProjectAttachment(id, fileUrl, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                        case 1:
                            project = _b.sent();
                            return [2 /*return*/, { fileUrl: fileUrl, project: project }];
                    }
                });
            });
        };
        ProjectsController_1.prototype.findTasks = function (projectId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.findTasks(projectId)];
                });
            });
        };
        ProjectsController_1.prototype.createTask = function (req, projectId, body) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, this.projectsService.createTask(projectId, body, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                });
            });
        };
        ProjectsController_1.prototype.updateTask = function (req, taskId, body) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, this.projectsService.updateTask(taskId, body, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                });
            });
        };
        ProjectsController_1.prototype.removeTask = function (req, taskId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    return [2 /*return*/, this.projectsService.removeTask(taskId, (_a = req.user) === null || _a === void 0 ? void 0 : _a.email)];
                });
            });
        };
        return ProjectsController_1;
    }());
    __setFunctionName(_classThis, "ProjectsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findProjects_decorators = [(0, common_1.Get)()];
        _findProject_decorators = [(0, common_1.Get)(':id')];
        _exportProjectPdf_decorators = [(0, common_1.Get)(':id/export/pdf')];
        _createProject_decorators = [(0, common_1.Post)()];
        _updateProject_decorators = [(0, common_1.Patch)(':id')];
        _removeProject_decorators = [(0, common_1.Delete)(':id')];
        _uploadProjectImage_decorators = [(0, common_1.Post)(':id/upload-image'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
                storage: (0, multer_1.diskStorage)({
                    destination: 'uploads/projects',
                    filename: function (_req, file, cb) {
                        var suffix = "".concat(Date.now(), "-").concat(Math.round(Math.random() * 1e9));
                        cb(null, "project-".concat(suffix).concat((0, path_1.extname)(file.originalname || '')));
                    },
                }),
            }))];
        _findTasks_decorators = [(0, common_1.Get)(':id/tasks')];
        _createTask_decorators = [(0, common_1.Post)(':id/tasks')];
        _updateTask_decorators = [(0, common_1.Patch)('tasks/:taskId')];
        _removeTask_decorators = [(0, common_1.Delete)('tasks/:taskId')];
        __esDecorate(_classThis, null, _findProjects_decorators, { kind: "method", name: "findProjects", static: false, private: false, access: { has: function (obj) { return "findProjects" in obj; }, get: function (obj) { return obj.findProjects; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findProject_decorators, { kind: "method", name: "findProject", static: false, private: false, access: { has: function (obj) { return "findProject" in obj; }, get: function (obj) { return obj.findProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportProjectPdf_decorators, { kind: "method", name: "exportProjectPdf", static: false, private: false, access: { has: function (obj) { return "exportProjectPdf" in obj; }, get: function (obj) { return obj.exportProjectPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createProject_decorators, { kind: "method", name: "createProject", static: false, private: false, access: { has: function (obj) { return "createProject" in obj; }, get: function (obj) { return obj.createProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProject_decorators, { kind: "method", name: "updateProject", static: false, private: false, access: { has: function (obj) { return "updateProject" in obj; }, get: function (obj) { return obj.updateProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeProject_decorators, { kind: "method", name: "removeProject", static: false, private: false, access: { has: function (obj) { return "removeProject" in obj; }, get: function (obj) { return obj.removeProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadProjectImage_decorators, { kind: "method", name: "uploadProjectImage", static: false, private: false, access: { has: function (obj) { return "uploadProjectImage" in obj; }, get: function (obj) { return obj.uploadProjectImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findTasks_decorators, { kind: "method", name: "findTasks", static: false, private: false, access: { has: function (obj) { return "findTasks" in obj; }, get: function (obj) { return obj.findTasks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTask_decorators, { kind: "method", name: "createTask", static: false, private: false, access: { has: function (obj) { return "createTask" in obj; }, get: function (obj) { return obj.createTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTask_decorators, { kind: "method", name: "updateTask", static: false, private: false, access: { has: function (obj) { return "updateTask" in obj; }, get: function (obj) { return obj.updateTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeTask_decorators, { kind: "method", name: "removeTask", static: false, private: false, access: { has: function (obj) { return "removeTask" in obj; }, get: function (obj) { return obj.removeTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectsController = _classThis;
}();
exports.ProjectsController = ProjectsController;
