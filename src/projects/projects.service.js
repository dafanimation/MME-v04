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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
var common_1 = require("@nestjs/common");
var pdfkit_1 = require("pdfkit");
var ProjectsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProjectsService = _classThis = /** @class */ (function () {
        function ProjectsService_1(projectRepo, taskRepo, historyRepo, userRepo, resourceRepo) {
            this.projectRepo = projectRepo;
            this.taskRepo = taskRepo;
            this.historyRepo = historyRepo;
            this.userRepo = userRepo;
            this.resourceRepo = resourceRepo;
        }
        ProjectsService_1.prototype.resolveActor = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedEmail, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedEmail = String(email || '')
                                .toLowerCase()
                                .trim();
                            if (!normalizedEmail)
                                return [2 /*return*/, { id: null, name: null }];
                            return [4 /*yield*/, this.userRepo.findOne({
                                    where: { email: normalizedEmail },
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, { id: null, name: normalizedEmail }];
                            return [2 /*return*/, { id: user.id, name: user.name || user.email }];
                    }
                });
            });
        };
        ProjectsService_1.prototype.resolveResource = function (resourceCode) {
            return __awaiter(this, void 0, void 0, function () {
                var code;
                return __generator(this, function (_a) {
                    code = String(resourceCode || '')
                        .toUpperCase()
                        .trim();
                    if (!code)
                        return [2 /*return*/, null];
                    return [2 /*return*/, this.resourceRepo.findOne({ where: { code: code } })];
                });
            });
        };
        ProjectsService_1.prototype.logHistoryEvent = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var actor, resource, row;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.resolveActor(args.actorEmail || args.ownerEmail)];
                        case 1:
                            actor = _c.sent();
                            return [4 /*yield*/, this.resolveResource(args.resourceCode)];
                        case 2:
                            resource = _c.sent();
                            row = {
                                userId: (_a = actor.id) !== null && _a !== void 0 ? _a : 0,
                                userName: actor.name || undefined,
                                action: args.action,
                                resourceId: (_b = resource === null || resource === void 0 ? void 0 : resource.id) !== null && _b !== void 0 ? _b : undefined,
                                resourceCode: (resource === null || resource === void 0 ? void 0 : resource.code) ||
                                    (args.resourceCode
                                        ? String(args.resourceCode).toUpperCase()
                                        : undefined),
                                details: args.details,
                                createdAt: new Date().toISOString(),
                            };
                            return [4 /*yield*/, this.historyRepo.save(row)];
                        case 3:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ProjectsService_1.prototype.findProjects = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var query;
                return __generator(this, function (_a) {
                    query = this.projectRepo
                        .createQueryBuilder('project')
                        .orderBy('project.updatedAt', 'DESC');
                    if (filters.status) {
                        query.andWhere('project.status = :status', { status: filters.status });
                    }
                    if (filters.title) {
                        query.andWhere('LOWER(project.title) LIKE :title', {
                            title: "%".concat(String(filters.title).toLowerCase(), "%"),
                        });
                    }
                    return [2 /*return*/, query.getMany()];
                });
            });
        };
        ProjectsService_1.prototype.findProject = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.projectRepo.findOne({ where: { id: id } })];
                        case 1:
                            project = _a.sent();
                            if (!project)
                                throw new common_1.NotFoundException("Project ".concat(id, " not found"));
                            return [2 /*return*/, project];
                    }
                });
            });
        };
        ProjectsService_1.prototype.exportProjectPdf = function (projectId) {
            return __awaiter(this, void 0, void 0, function () {
                var project, tasks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProject(projectId)];
                        case 1:
                            project = _a.sent();
                            return [4 /*yield*/, this.findTasks(projectId)];
                        case 2:
                            tasks = _a.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var doc = new pdfkit_1.default({ margin: 40, size: 'A4' });
                                    var chunks = [];
                                    doc.on('data', function (chunk) {
                                        return chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
                                    });
                                    doc.on('end', function () { return resolve(Buffer.concat(chunks)); });
                                    doc.on('error', reject);
                                    doc.fontSize(20).text("Proyecto: ".concat(project.title || 'Sin titulo'));
                                    doc.moveDown(0.4);
                                    doc.fontSize(11).text("Estado: ".concat(project.status || 'draft'));
                                    doc.fontSize(11).text("Mesa: ".concat(project.mesaNum || 'Sin asignar'));
                                    doc.fontSize(11).text("Actualizado: ".concat(project.updatedAt || '-'));
                                    doc.moveDown(0.8);
                                    doc.fontSize(13).text('Descripcion');
                                    doc.fontSize(10).text(project.description || 'Sin descripcion');
                                    var participants = Array.isArray(project.participants)
                                        ? project.participants
                                        : [];
                                    doc.moveDown(0.8);
                                    doc.fontSize(13).text('Participantes');
                                    if (!participants.length) {
                                        doc.fontSize(10).text('- Sin participantes');
                                    }
                                    else {
                                        participants.forEach(function (entry) { return doc.fontSize(10).text("- ".concat(entry)); });
                                    }
                                    var links = Array.isArray(project.dossierLinks)
                                        ? project.dossierLinks
                                        : [];
                                    doc.moveDown(0.8);
                                    doc.fontSize(13).text('Links dosier');
                                    if (!links.length) {
                                        doc.fontSize(10).text('- Sin enlaces');
                                    }
                                    else {
                                        links.forEach(function (entry) { return doc.fontSize(10).text("- ".concat(entry)); });
                                    }
                                    doc.moveDown(0.8);
                                    doc.fontSize(13).text('Tareas');
                                    if (!tasks.length) {
                                        doc.fontSize(10).text('- Sin tareas');
                                    }
                                    else {
                                        tasks.forEach(function (task, index) {
                                            doc
                                                .fontSize(10)
                                                .text("".concat(index + 1, ". ").concat(task.activityCode || '-', " | owner=").concat(task.ownerUserEmail || '-', " | mesa=").concat(task.mesaNum || '-', " | recurso=").concat(task.resourceCode || '-', " | estado=").concat(task.status || 'pending'));
                                            if (task.notes) {
                                                doc.fontSize(9).fillColor('#444').text("   notas: ".concat(task.notes));
                                                doc.fillColor('#000');
                                            }
                                        });
                                    }
                                    doc.end();
                                })];
                    }
                });
            });
        };
        ProjectsService_1.prototype.createProject = function (payload, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var now, project, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date().toISOString();
                            project = this.projectRepo.create({
                                title: String(payload.title || '').trim(),
                                description: payload.description ? String(payload.description) : null,
                                status: payload.status || 'draft',
                                dossierLinks: Array.isArray(payload.dossierLinks)
                                    ? payload.dossierLinks
                                    : [],
                                attachments: Array.isArray(payload.attachments)
                                    ? payload.attachments
                                    : [],
                                participants: Array.isArray(payload.participants)
                                    ? payload.participants
                                    : [],
                                mesaNum: payload.mesaNum ? String(payload.mesaNum) : null,
                                createdByEmail: actorEmail || null,
                                createdAt: now,
                                updatedAt: now,
                            });
                            return [4 /*yield*/, this.projectRepo.save(project)];
                        case 1:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_create',
                                    actorEmail: actorEmail,
                                    details: JSON.stringify({ projectId: saved.id, title: saved.title }),
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        ProjectsService_1.prototype.updateProject = function (id, payload, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var project, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProject(id)];
                        case 1:
                            project = _a.sent();
                            if (payload.title != null)
                                project.title = String(payload.title || '').trim() || project.title;
                            if (payload.description !== undefined)
                                project.description = payload.description
                                    ? String(payload.description)
                                    : null;
                            if (payload.status !== undefined)
                                project.status = String(payload.status || 'draft');
                            if (payload.dossierLinks !== undefined)
                                project.dossierLinks = Array.isArray(payload.dossierLinks)
                                    ? payload.dossierLinks
                                    : [];
                            if (payload.attachments !== undefined)
                                project.attachments = Array.isArray(payload.attachments)
                                    ? payload.attachments
                                    : [];
                            if (payload.participants !== undefined)
                                project.participants = Array.isArray(payload.participants)
                                    ? payload.participants
                                    : [];
                            if (payload.mesaNum !== undefined)
                                project.mesaNum = payload.mesaNum ? String(payload.mesaNum) : null;
                            project.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.projectRepo.save(project)];
                        case 2:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_update',
                                    actorEmail: actorEmail,
                                    details: JSON.stringify({
                                        projectId: saved.id,
                                        title: saved.title,
                                        status: saved.status,
                                    }),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        ProjectsService_1.prototype.removeProject = function (id, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var project;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProject(id)];
                        case 1:
                            project = _a.sent();
                            return [4 /*yield*/, this.taskRepo.delete({ projectId: id })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.projectRepo.delete(id)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_remove',
                                    actorEmail: actorEmail,
                                    details: JSON.stringify({ projectId: id, title: project.title }),
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { message: "Project ".concat(id, " removed") }];
                    }
                });
            });
        };
        ProjectsService_1.prototype.addProjectAttachment = function (id, fileUrl, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var project, current, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProject(id)];
                        case 1:
                            project = _a.sent();
                            current = Array.isArray(project.attachments)
                                ? project.attachments
                                : [];
                            project.attachments = __spreadArray(__spreadArray([], current, true), [fileUrl], false);
                            project.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.projectRepo.save(project)];
                        case 2:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_attachment_add',
                                    actorEmail: actorEmail,
                                    details: JSON.stringify({ projectId: saved.id, fileUrl: fileUrl }),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        ProjectsService_1.prototype.findTasks = function (projectId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findProject(projectId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.taskRepo.find({
                                    where: { projectId: projectId },
                                    order: { updatedAt: 'DESC' },
                                })];
                    }
                });
            });
        };
        ProjectsService_1.prototype.createTask = function (projectId, payload, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var project, now, task, saved;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findProject(projectId)];
                        case 1:
                            project = _b.sent();
                            now = new Date().toISOString();
                            task = this.taskRepo.create({
                                projectId: projectId,
                                udActivityId: (_a = payload.udActivityId) !== null && _a !== void 0 ? _a : null,
                                activityCode: payload.activityCode
                                    ? String(payload.activityCode).toUpperCase()
                                    : null,
                                ownerUserEmail: payload.ownerUserEmail
                                    ? String(payload.ownerUserEmail).toLowerCase()
                                    : null,
                                mesaNum: payload.mesaNum ? String(payload.mesaNum) : null,
                                resourceCode: payload.resourceCode
                                    ? String(payload.resourceCode).toUpperCase()
                                    : null,
                                status: payload.status || 'pending',
                                notes: payload.notes ? String(payload.notes) : null,
                                createdAt: now,
                                updatedAt: now,
                            });
                            return [4 /*yield*/, this.taskRepo.save(task)];
                        case 2:
                            saved = _b.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_task_create',
                                    actorEmail: actorEmail,
                                    ownerEmail: saved.ownerUserEmail || undefined,
                                    resourceCode: saved.resourceCode || undefined,
                                    details: JSON.stringify({
                                        projectId: projectId,
                                        projectTitle: project.title,
                                        taskId: saved.id,
                                        udActivityId: saved.udActivityId,
                                        activityCode: saved.activityCode,
                                        mesaNum: saved.mesaNum,
                                        status: saved.status,
                                    }),
                                })];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        ProjectsService_1.prototype.updateTask = function (taskId, payload, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var task, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.taskRepo.findOne({ where: { id: taskId } })];
                        case 1:
                            task = _a.sent();
                            if (!task)
                                throw new common_1.NotFoundException("Project task ".concat(taskId, " not found"));
                            if (payload.udActivityId !== undefined)
                                task.udActivityId = Number(payload.udActivityId) || null;
                            if (payload.activityCode !== undefined)
                                task.activityCode = payload.activityCode
                                    ? String(payload.activityCode).toUpperCase()
                                    : null;
                            if (payload.ownerUserEmail !== undefined)
                                task.ownerUserEmail = payload.ownerUserEmail
                                    ? String(payload.ownerUserEmail).toLowerCase()
                                    : null;
                            if (payload.mesaNum !== undefined)
                                task.mesaNum = payload.mesaNum ? String(payload.mesaNum) : null;
                            if (payload.resourceCode !== undefined)
                                task.resourceCode = payload.resourceCode
                                    ? String(payload.resourceCode).toUpperCase()
                                    : null;
                            if (payload.status !== undefined)
                                task.status = String(payload.status || 'pending');
                            if (payload.notes !== undefined)
                                task.notes = payload.notes ? String(payload.notes) : null;
                            task.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.taskRepo.save(task)];
                        case 2:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_task_update',
                                    actorEmail: actorEmail,
                                    ownerEmail: saved.ownerUserEmail || undefined,
                                    resourceCode: saved.resourceCode || undefined,
                                    details: JSON.stringify({
                                        taskId: saved.id,
                                        projectId: saved.projectId,
                                        udActivityId: saved.udActivityId,
                                        activityCode: saved.activityCode,
                                        mesaNum: saved.mesaNum,
                                        status: saved.status,
                                    }),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        ProjectsService_1.prototype.removeTask = function (taskId, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var task;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.taskRepo.findOne({ where: { id: taskId } })];
                        case 1:
                            task = _a.sent();
                            if (!task)
                                throw new common_1.NotFoundException("Project task ".concat(taskId, " not found"));
                            return [4 /*yield*/, this.taskRepo.delete(taskId)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.logHistoryEvent({
                                    action: 'project_task_remove',
                                    actorEmail: actorEmail,
                                    ownerEmail: task.ownerUserEmail || undefined,
                                    resourceCode: task.resourceCode || undefined,
                                    details: JSON.stringify({
                                        taskId: task.id,
                                        projectId: task.projectId,
                                        udActivityId: task.udActivityId,
                                        activityCode: task.activityCode,
                                        mesaNum: task.mesaNum,
                                        status: task.status,
                                    }),
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: "Project task ".concat(taskId, " removed") }];
                    }
                });
            });
        };
        return ProjectsService_1;
    }());
    __setFunctionName(_classThis, "ProjectsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectsService = _classThis;
}();
exports.ProjectsService = ProjectsService;
