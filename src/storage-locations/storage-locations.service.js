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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageLocationsService = void 0;
var common_1 = require("@nestjs/common");
var StorageLocationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StorageLocationsService = _classThis = /** @class */ (function () {
        function StorageLocationsService_1(repo) {
            this.repo = repo;
        }
        StorageLocationsService_1.prototype.findAll = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var query, active;
                return __generator(this, function (_a) {
                    query = this.repo.createQueryBuilder('s').orderBy('s.zone', 'ASC').addOrderBy('s.label', 'ASC');
                    if (filters.room)
                        query.andWhere('LOWER(s.room) = :room', { room: String(filters.room).toLowerCase() });
                    if (filters.type)
                        query.andWhere('LOWER(s.type) = :type', { type: String(filters.type).toLowerCase() });
                    if (filters.zone)
                        query.andWhere('LOWER(s.zone) = :zone', { zone: String(filters.zone).toLowerCase() });
                    if (filters.active != null) {
                        active = String(filters.active).toLowerCase();
                        if (active === 'true' || active === '1')
                            query.andWhere('s.active = :active', { active: true });
                        if (active === 'false' || active === '0')
                            query.andWhere('s.active = :active', { active: false });
                    }
                    return [2 /*return*/, query.getMany()];
                });
            });
        };
        StorageLocationsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repo.findOne({ where: { id: id } })];
                        case 1:
                            row = _a.sent();
                            if (!row)
                                throw new common_1.NotFoundException("Storage location ".concat(id, " not found"));
                            return [2 /*return*/, row];
                    }
                });
            });
        };
        StorageLocationsService_1.prototype.create = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var now, row;
                return __generator(this, function (_a) {
                    now = new Date().toISOString();
                    row = this.repo.create({
                        type: String(payload.type || 'ESTANTERIA').toUpperCase(),
                        zone: String(payload.zone || 'A').toUpperCase(),
                        row: payload.row ? String(payload.row).toUpperCase() : null,
                        module: payload.module ? String(payload.module).toUpperCase() : null,
                        label: payload.label ? String(payload.label) : null,
                        room: payload.room ? String(payload.room).toUpperCase() : null,
                        capacity: Number(payload.capacity || 0),
                        active: payload.active !== undefined ? Boolean(payload.active) : true,
                        coordinates: payload.coordinates || null,
                        createdAt: now,
                        updatedAt: now,
                    });
                    return [2 /*return*/, this.repo.save(row)];
                });
            });
        };
        StorageLocationsService_1.prototype.update = function (id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var row;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            row = _a.sent();
                            if (payload.type !== undefined)
                                row.type = String(payload.type || row.type).toUpperCase();
                            if (payload.zone !== undefined)
                                row.zone = String(payload.zone || row.zone).toUpperCase();
                            if (payload.row !== undefined)
                                row.row = payload.row ? String(payload.row).toUpperCase() : null;
                            if (payload.module !== undefined)
                                row.module = payload.module ? String(payload.module).toUpperCase() : null;
                            if (payload.label !== undefined)
                                row.label = payload.label ? String(payload.label) : null;
                            if (payload.room !== undefined)
                                row.room = payload.room ? String(payload.room).toUpperCase() : null;
                            if (payload.capacity !== undefined)
                                row.capacity = Number(payload.capacity || 0);
                            if (payload.active !== undefined)
                                row.active = Boolean(payload.active);
                            if (payload.coordinates !== undefined)
                                row.coordinates = payload.coordinates || null;
                            row.updatedAt = new Date().toISOString();
                            return [2 /*return*/, this.repo.save(row)];
                    }
                });
            });
        };
        StorageLocationsService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.repo.delete(id)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: "Storage location ".concat(id, " removed") }];
                    }
                });
            });
        };
        return StorageLocationsService_1;
    }());
    __setFunctionName(_classThis, "StorageLocationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StorageLocationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StorageLocationsService = _classThis;
}();
exports.StorageLocationsService = StorageLocationsService;
