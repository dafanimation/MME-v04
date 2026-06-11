"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.ResourceService = void 0;
// src/resources/resource.service.ts
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var ResourceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ResourceService = _classThis = /** @class */ (function () {
        function ResourceService_1(resourceRepository, userRepository) {
            this.resourceRepository = resourceRepository;
            this.userRepository = userRepository;
        }
        ResourceService_1.prototype.findAll = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var status, location, type, userId, _a, page, _b, limit, queryBuilder, skip, _c, data, total, enriched;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            status = query.status, location = query.location, type = query.type, userId = query.userId, _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b;
                            queryBuilder = this.resourceRepository.createQueryBuilder('resource');
                            if (status) {
                                queryBuilder.andWhere('resource.status = :status', { status: status });
                            }
                            if (location) {
                                queryBuilder.andWhere('resource.location = :location', { location: location });
                            }
                            if (type) {
                                queryBuilder.andWhere('resource.type = :type', { type: type });
                            }
                            if (userId) {
                                queryBuilder.andWhere('resource.assignedToUserId = :userId', { userId: userId });
                            }
                            skip = (page - 1) * limit;
                            queryBuilder.skip(skip).take(limit);
                            queryBuilder.orderBy('resource.id', 'DESC');
                            return [4 /*yield*/, queryBuilder.getManyAndCount()];
                        case 1:
                            _c = _d.sent(), data = _c[0], total = _c[1];
                            return [4 /*yield*/, this.enrichResources(data)];
                        case 2:
                            enriched = _d.sent();
                            return [2 /*return*/, { data: enriched, total: total }];
                    }
                });
            });
        };
        ResourceService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var resource;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resourceRepository.findOne({ where: { id: id } })];
                        case 1:
                            resource = _a.sent();
                            if (!resource) {
                                throw new common_1.NotFoundException("Resource with id ".concat(id, " not found"));
                            }
                            return [2 /*return*/, this.enrichResource(resource)];
                    }
                });
            });
        };
        ResourceService_1.prototype.findUserResources = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resourceRepository.find({
                                where: { assignedToUserId: userId },
                                order: { code: 'ASC' },
                            })];
                        case 1:
                            list = _a.sent();
                            return [2 /*return*/, this.enrichResources(list)];
                    }
                });
            });
        };
        ResourceService_1.prototype.create = function (createResourceDto) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, resourceData, newResource, saved, baseUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = createResourceDto.userId, resourceData = __rest(createResourceDto, ["userId"]);
                            newResource = this.resourceRepository.create(__assign(__assign({}, resourceData), { assignedToUserId: userId !== undefined ? userId : null, createdAt: new Date().toISOString() }));
                            return [4 /*yield*/, this.resourceRepository.save(newResource)];
                        case 1:
                            saved = _a.sent();
                            if (!!saved.qrCode) return [3 /*break*/, 3];
                            baseUrl = process.env.BASE_URL || 'http://localhost:3000';
                            saved.qrCode = "".concat(baseUrl, "/recursos/").concat(saved.id);
                            return [4 /*yield*/, this.resourceRepository.save(saved)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, this.enrichResource(saved)];
                    }
                });
            });
        };
        ResourceService_1.prototype.update = function (id, updateResourceDto) {
            return __awaiter(this, void 0, void 0, function () {
                var resource, userId, updateData, cleanUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            resource = _a.sent();
                            userId = updateResourceDto.userId, updateData = __rest(updateResourceDto, ["userId"]);
                            if (userId !== undefined) {
                                resource.assignedToUserId = userId;
                            }
                            cleanUpdate = Object.fromEntries(Object.entries(updateData).filter(function (_a) {
                                var v = _a[1];
                                return v !== undefined;
                            }));
                            Object.assign(resource, cleanUpdate);
                            return [2 /*return*/, this.resourceRepository.save(resource)];
                    }
                });
            });
        };
        ResourceService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var resource;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            resource = _a.sent();
                            return [4 /*yield*/, this.resourceRepository.delete(id)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, resource];
                    }
                });
            });
        };
        // ========== MÈTODES ADDICIONALS ==========
        ResourceService_1.prototype.count = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.resourceRepository.count()];
                });
            });
        };
        ResourceService_1.prototype.countByStatus = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.resourceRepository.count({ where: { status: status } })];
                });
            });
        };
        ResourceService_1.prototype.getCurrentAssignments = function () {
            return __awaiter(this, void 0, void 0, function () {
                var list;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resourceRepository.find({
                                where: { status: 'assigned' },
                                order: { code: 'ASC' },
                            })];
                        case 1:
                            list = _a.sent();
                            return [2 /*return*/, this.enrichResources(list)];
                    }
                });
            });
        };
        ResourceService_1.prototype.releaseResource = function (resourceCode, requester) {
            return __awaiter(this, void 0, void 0, function () {
                var resource, role, isAdmin, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resourceRepository.findOne({
                                where: { code: resourceCode },
                            })];
                        case 1:
                            resource = _a.sent();
                            if (!resource) {
                                throw new common_1.NotFoundException("Resource ".concat(resourceCode, " not found"));
                            }
                            if (requester) {
                                role = String(requester.role || '').toLowerCase();
                                isAdmin = role === 'admin' ||
                                    role === 'admin_master' ||
                                    role === 'admin master';
                                if (!isAdmin && resource.assignedToUserId !== requester.userId) {
                                    throw new common_1.ForbiddenException("Resource ".concat(resourceCode, " is not assigned to current user"));
                                }
                            }
                            resource.status = 'available';
                            resource.assignedToUserId = null;
                            return [4 /*yield*/, this.resourceRepository.save(resource)];
                        case 2:
                            saved = _a.sent();
                            return [2 /*return*/, this.enrichResource(saved)];
                    }
                });
            });
        };
        // 👈 NOU MÈTODE assignResource
        ResourceService_1.prototype.assignResource = function (resourceCode, userEmail, location) {
            return __awaiter(this, void 0, void 0, function () {
                var resource, user, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resourceRepository.findOne({ where: { code: resourceCode } })];
                        case 1:
                            resource = _a.sent();
                            if (!resource) {
                                throw new common_1.NotFoundException("Resource ".concat(resourceCode, " not found"));
                            }
                            return [4 /*yield*/, this.userRepository.findOne({ where: { email: userEmail } })];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.NotFoundException("User with email ".concat(userEmail, " not found"));
                            }
                            // Assignar recurs
                            resource.status = 'assigned';
                            resource.assignedToUserId = user.id;
                            if (location &&
                                Number.isFinite(location.x) &&
                                Number.isFinite(location.z)) {
                                resource.location = __assign(__assign({}, (resource.location || {})), { type: location.type, tipo: location.tipo, label: location.label, mesaId: location.mesaId, num: location.num, estId: location.estId, room: location.room, placement: location.placement, anchor: location.anchor, renderAnchorIndex: Number.isFinite(Number(location.renderAnchorIndex)) ? Number(location.renderAnchorIndex) : null, x: Number(location.x), z: Number(location.z) });
                            }
                            return [4 /*yield*/, this.resourceRepository.save(resource)];
                        case 3:
                            saved = _a.sent();
                            return [2 /*return*/, this.enrichResource(saved)];
                    }
                });
            });
        };
        ResourceService_1.prototype.selfAssignResource = function (resourceCode, userId, userEmail, location) {
            return __awaiter(this, void 0, void 0, function () {
                var resource, availableStatuses, isAssignedToCurrentUser, saved, enriched;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resourceRepository.findOne({
                                where: { code: resourceCode },
                            })];
                        case 1:
                            resource = _a.sent();
                            if (!resource) {
                                throw new common_1.NotFoundException("Resource ".concat(resourceCode, " not found"));
                            }
                            availableStatuses = ['available', 'review'];
                            isAssignedToCurrentUser = resource.assignedToUserId === userId;
                            if (!isAssignedToCurrentUser && !availableStatuses.includes(resource.status)) {
                                throw new common_1.ConflictException("Resource ".concat(resourceCode, " is not available for self-assign"));
                            }
                            resource.assignedToUserId = userId;
                            resource.status = 'assigned';
                            if (location &&
                                Number.isFinite(location.x) &&
                                Number.isFinite(location.z)) {
                                resource.location = __assign(__assign({}, (resource.location || {})), { type: location.type, tipo: location.tipo, label: location.label, mesaId: location.mesaId, num: location.num, estId: location.estId, room: location.room, placement: location.placement, anchor: location.anchor, renderAnchorIndex: Number.isFinite(Number(location.renderAnchorIndex)) ? Number(location.renderAnchorIndex) : null, x: Number(location.x), z: Number(location.z) });
                            }
                            return [4 /*yield*/, this.resourceRepository.save(resource)];
                        case 2:
                            saved = _a.sent();
                            return [4 /*yield*/, this.enrichResource(saved)];
                        case 3:
                            enriched = _a.sent();
                            return [2 /*return*/, {
                                    message: "Resource ".concat(resourceCode, " self-assigned to ").concat(userEmail),
                                    resource: enriched,
                                }];
                    }
                });
            });
        };
        ResourceService_1.prototype.enrichResources = function (resources) {
            return __awaiter(this, void 0, void 0, function () {
                var assignedIds, usersById, users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!resources.length)
                                return [2 /*return*/, []];
                            assignedIds = __spreadArray([], new Set(resources
                                .map(function (r) { return r.assignedToUserId; })
                                .filter(function (id) { return typeof id === 'number' && Number.isFinite(id); })), true);
                            usersById = new Map();
                            if (!assignedIds.length) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.userRepository.find({ where: { id: (0, typeorm_1.In)(assignedIds) } })];
                        case 1:
                            users = _a.sent();
                            users.forEach(function (u) { return usersById.set(u.id, u); });
                            _a.label = 2;
                        case 2: return [2 /*return*/, resources.map(function (r) {
                                var assignedUser = r.assignedToUserId ? usersById.get(r.assignedToUserId) || null : null;
                                return __assign(__assign({}, r), { assignedUser: assignedUser ? {
                                        id: assignedUser.id,
                                        email: assignedUser.email,
                                        name: assignedUser.name,
                                        group: assignedUser.group,
                                        role: assignedUser.role,
                                    } : null, user_email: (assignedUser === null || assignedUser === void 0 ? void 0 : assignedUser.email) || null });
                            })];
                    }
                });
            });
        };
        ResourceService_1.prototype.enrichResource = function (resource) {
            return __awaiter(this, void 0, void 0, function () {
                var item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enrichResources([resource])];
                        case 1:
                            item = (_a.sent())[0];
                            return [2 /*return*/, item];
                    }
                });
            });
        };
        return ResourceService_1;
    }());
    __setFunctionName(_classThis, "ResourceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ResourceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ResourceService = _classThis;
}();
exports.ResourceService = ResourceService;
