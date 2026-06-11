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
exports.UdActivitiesService = void 0;
var common_1 = require("@nestjs/common");
var UdActivitiesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UdActivitiesService = _classThis = /** @class */ (function () {
        function UdActivitiesService_1(udRepo, taskRepo, historyRepo, userRepo, resourceRepo) {
            this.udRepo = udRepo;
            this.taskRepo = taskRepo;
            this.historyRepo = historyRepo;
            this.userRepo = userRepo;
            this.resourceRepo = resourceRepo;
        }
        UdActivitiesService_1.prototype.normalizeList = function (input) {
            if (!Array.isArray(input))
                return [];
            return input.map(function (v) { return String(v || '').trim(); }).filter(Boolean);
        };
        UdActivitiesService_1.prototype.resolveActor = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedEmail, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedEmail = String(email || '').toLowerCase().trim();
                            if (!normalizedEmail)
                                return [2 /*return*/, { id: 0 }];
                            return [4 /*yield*/, this.userRepo.findOne({ where: { email: normalizedEmail } })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, { id: 0, name: normalizedEmail }];
                            return [2 /*return*/, { id: user.id, name: user.name || user.email }];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.logHistory = function (action, details, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var actor, codes, primaryCode, resource, _a, row;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.resolveActor(actorEmail)];
                        case 1:
                            actor = _b.sent();
                            codes = this.normalizeList(details.resourceTypes);
                            primaryCode = codes[0] ? String(codes[0]).toUpperCase() : null;
                            if (!primaryCode) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.resourceRepo.findOne({ where: { code: primaryCode } })];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = null;
                            _b.label = 4;
                        case 4:
                            resource = _a;
                            row = {
                                userId: actor.id,
                                userName: actor.name,
                                action: action,
                                resourceId: resource === null || resource === void 0 ? void 0 : resource.id,
                                resourceCode: (resource === null || resource === void 0 ? void 0 : resource.code) || primaryCode || undefined,
                                details: JSON.stringify(details),
                                createdAt: new Date().toISOString(),
                            };
                            return [4 /*yield*/, this.historyRepo.save(row)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.findAll = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var query;
                return __generator(this, function (_a) {
                    query = this.udRepo.createQueryBuilder('ud').orderBy('ud.updatedAt', 'DESC');
                    if (filters.udCode) {
                        query.andWhere('LOWER(ud.udCode) = :udCode', { udCode: String(filters.udCode).toLowerCase() });
                    }
                    if (filters.status) {
                        query.andWhere('LOWER(ud.status) = :status', { status: String(filters.status).toLowerCase() });
                    }
                    if (filters.projectId) {
                        query.andWhere('ud.projectId = :projectId', { projectId: Number(filters.projectId) || 0 });
                    }
                    return [2 /*return*/, query.getMany()];
                });
            });
        };
        UdActivitiesService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.udRepo.findOne({ where: { id: id } })];
                        case 1:
                            row = _a.sent();
                            if (!row)
                                throw new common_1.NotFoundException("UD activity ".concat(id, " not found"));
                            return [2 /*return*/, row];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.create = function (payload, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var now, row, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date().toISOString();
                            row = this.udRepo.create({
                                udCode: String(payload.udCode || 'UD00').toUpperCase(),
                                title: String(payload.title || '').trim(),
                                date: payload.date ? String(payload.date) : null,
                                statement: payload.statement ? String(payload.statement) : null,
                                requiredEquipment: this.normalizeList(payload.requiredEquipment),
                                assignmentMode: String(payload.assignmentMode || 'admin'),
                                resourceTypes: this.normalizeList(payload.resourceTypes),
                                links: this.normalizeList(payload.links),
                                images: this.normalizeList(payload.images),
                                projectId: payload.projectId != null ? Number(payload.projectId) : null,
                                status: String(payload.status || 'planned'),
                                createdAt: now,
                                updatedAt: now,
                            });
                            return [4 /*yield*/, this.udRepo.save(row)];
                        case 1:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistory('ud_activity_create', {
                                    udActivityId: saved.id,
                                    udCode: saved.udCode,
                                    title: saved.title,
                                    projectId: saved.projectId,
                                    resourceTypes: saved.resourceTypes,
                                }, actorEmail)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.update = function (id, payload, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var row, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            row = _a.sent();
                            if (payload.udCode !== undefined)
                                row.udCode = String(payload.udCode || row.udCode).toUpperCase();
                            if (payload.title !== undefined)
                                row.title = String(payload.title || row.title).trim();
                            if (payload.date !== undefined)
                                row.date = payload.date ? String(payload.date) : null;
                            if (payload.statement !== undefined)
                                row.statement = payload.statement ? String(payload.statement) : null;
                            if (payload.requiredEquipment !== undefined)
                                row.requiredEquipment = this.normalizeList(payload.requiredEquipment);
                            if (payload.assignmentMode !== undefined)
                                row.assignmentMode = String(payload.assignmentMode || row.assignmentMode);
                            if (payload.resourceTypes !== undefined)
                                row.resourceTypes = this.normalizeList(payload.resourceTypes);
                            if (payload.links !== undefined)
                                row.links = this.normalizeList(payload.links);
                            if (payload.images !== undefined)
                                row.images = this.normalizeList(payload.images);
                            if (payload.projectId !== undefined)
                                row.projectId = payload.projectId != null ? Number(payload.projectId) : null;
                            if (payload.status !== undefined)
                                row.status = String(payload.status || row.status);
                            row.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.udRepo.save(row)];
                        case 2:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistory('ud_activity_update', {
                                    udActivityId: saved.id,
                                    udCode: saved.udCode,
                                    title: saved.title,
                                    projectId: saved.projectId,
                                    resourceTypes: saved.resourceTypes,
                                }, actorEmail)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.remove = function (id, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            row = _a.sent();
                            return [4 /*yield*/, this.taskRepo.update({ udActivityId: id }, { udActivityId: null })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.udRepo.delete(id)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.logHistory('ud_activity_remove', {
                                    udActivityId: row.id,
                                    udCode: row.udCode,
                                    title: row.title,
                                    projectId: row.projectId,
                                }, actorEmail)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { message: "UD activity ".concat(id, " removed") }];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.linkTask = function (id, taskId, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var task, savedTask;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.taskRepo.findOne({ where: { id: taskId } })];
                        case 2:
                            task = _a.sent();
                            if (!task)
                                throw new common_1.NotFoundException("Project task ".concat(taskId, " not found"));
                            task.udActivityId = id;
                            task.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.taskRepo.save(task)];
                        case 3:
                            savedTask = _a.sent();
                            return [4 /*yield*/, this.logHistory('ud_activity_link_task', {
                                    udActivityId: id,
                                    taskId: taskId,
                                    projectId: savedTask.projectId,
                                    resourceTypes: savedTask.resourceCode ? [savedTask.resourceCode] : [],
                                }, actorEmail)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, savedTask];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.addImage = function (id, imageUrl, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var row, current, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            row = _a.sent();
                            current = Array.isArray(row.images) ? row.images : [];
                            row.images = __spreadArray(__spreadArray([], current, true), [imageUrl], false);
                            row.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.udRepo.save(row)];
                        case 2:
                            saved = _a.sent();
                            return [4 /*yield*/, this.logHistory('ud_activity_add_image', {
                                    udActivityId: saved.id,
                                    imageUrl: imageUrl,
                                    resourceTypes: saved.resourceTypes,
                                }, actorEmail)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        UdActivitiesService_1.prototype.unlinkTask = function (taskId, actorEmail) {
            return __awaiter(this, void 0, void 0, function () {
                var task, previousUdActivityId, savedTask;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.taskRepo.findOne({ where: { id: taskId } })];
                        case 1:
                            task = _a.sent();
                            if (!task)
                                throw new common_1.NotFoundException("Project task ".concat(taskId, " not found"));
                            previousUdActivityId = task.udActivityId;
                            task.udActivityId = null;
                            task.updatedAt = new Date().toISOString();
                            return [4 /*yield*/, this.taskRepo.save(task)];
                        case 2:
                            savedTask = _a.sent();
                            return [4 /*yield*/, this.logHistory('ud_activity_unlink_task', {
                                    udActivityId: previousUdActivityId,
                                    taskId: taskId,
                                    projectId: savedTask.projectId,
                                }, actorEmail)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, savedTask];
                    }
                });
            });
        };
        return UdActivitiesService_1;
    }());
    __setFunctionName(_classThis, "UdActivitiesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UdActivitiesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UdActivitiesService = _classThis;
}();
exports.UdActivitiesService = UdActivitiesService;
