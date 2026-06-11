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
exports.ActivityReportsController = exports.UserActivityProgressController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../guards/roles.guard");
var roles_decorator_1 = require("../decorators/roles.decorator");
var UserActivityProgressController = function () {
    var _classDecorators = [(0, common_1.Controller)('ud-activities/:activityId/progress'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMyProgress_decorators;
    var _getAllProgress_decorators;
    var _updateMyProgress_decorators;
    var _submit_decorators;
    var _validate_decorators;
    var _returnActivity_decorators;
    var UserActivityProgressController = _classThis = /** @class */ (function () {
        function UserActivityProgressController_1(progressService) {
            this.progressService = (__runInitializers(this, _instanceExtraInitializers), progressService);
        }
        // GET my progress on this activity
        UserActivityProgressController_1.prototype.getMyProgress = function (activityId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.getProgress(activityId, req.user.userId)];
                });
            });
        };
        // GET all students' progress (Admin/BIP only)
        UserActivityProgressController_1.prototype.getAllProgress = function (activityId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.getAllProgressForActivity(activityId)];
                });
            });
        };
        // POST start/update my progress
        UserActivityProgressController_1.prototype.updateMyProgress = function (activityId, req, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.startOrUpdate(activityId, req.user.userId, body)];
                });
            });
        };
        // POST submit
        UserActivityProgressController_1.prototype.submit = function (activityId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.submit(activityId, req.user.userId)];
                });
            });
        };
        // POST validate (Admin/BIP)
        UserActivityProgressController_1.prototype.validate = function (activityId, userId, req, grade) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.validate(activityId, userId, req.user.email, grade)];
                });
            });
        };
        // POST return (Admin/BIP)
        UserActivityProgressController_1.prototype.returnActivity = function (activityId, userId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.returnActivity(activityId, userId, reason)];
                });
            });
        };
        return UserActivityProgressController_1;
    }());
    __setFunctionName(_classThis, "UserActivityProgressController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMyProgress_decorators = [(0, common_1.Get)('me')];
        _getAllProgress_decorators = [(0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin', 'bip'), (0, common_1.Get)()];
        _updateMyProgress_decorators = [(0, common_1.Post)('me')];
        _submit_decorators = [(0, common_1.Post)('me/submit')];
        _validate_decorators = [(0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin', 'bip'), (0, common_1.Post)(':userId/validate')];
        _returnActivity_decorators = [(0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin', 'bip'), (0, common_1.Post)(':userId/return')];
        __esDecorate(_classThis, null, _getMyProgress_decorators, { kind: "method", name: "getMyProgress", static: false, private: false, access: { has: function (obj) { return "getMyProgress" in obj; }, get: function (obj) { return obj.getMyProgress; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllProgress_decorators, { kind: "method", name: "getAllProgress", static: false, private: false, access: { has: function (obj) { return "getAllProgress" in obj; }, get: function (obj) { return obj.getAllProgress; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMyProgress_decorators, { kind: "method", name: "updateMyProgress", static: false, private: false, access: { has: function (obj) { return "updateMyProgress" in obj; }, get: function (obj) { return obj.updateMyProgress; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submit_decorators, { kind: "method", name: "submit", static: false, private: false, access: { has: function (obj) { return "submit" in obj; }, get: function (obj) { return obj.submit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: function (obj) { return "validate" in obj; }, get: function (obj) { return obj.validate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _returnActivity_decorators, { kind: "method", name: "returnActivity", static: false, private: false, access: { has: function (obj) { return "returnActivity" in obj; }, get: function (obj) { return obj.returnActivity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserActivityProgressController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserActivityProgressController = _classThis;
}();
exports.UserActivityProgressController = UserActivityProgressController;
// Separate controller for admin reports
var ActivityReportsController = function () {
    var _classDecorators = [(0, common_1.Controller)('admin/reports'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('admin', 'bip')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getActivityReport_decorators;
    var _getStudentReport_decorators;
    var ActivityReportsController = _classThis = /** @class */ (function () {
        function ActivityReportsController_1(progressService) {
            this.progressService = (__runInitializers(this, _instanceExtraInitializers), progressService);
        }
        ActivityReportsController_1.prototype.getActivityReport = function (userId, activityId, status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.getReport({
                            userId: userId ? parseInt(userId) : undefined,
                            activityId: activityId ? parseInt(activityId) : undefined,
                            status: status,
                        })];
                });
            });
        };
        ActivityReportsController_1.prototype.getStudentReport = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.progressService.getMyProgress(userId)];
                });
            });
        };
        return ActivityReportsController_1;
    }());
    __setFunctionName(_classThis, "ActivityReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getActivityReport_decorators = [(0, common_1.Get)('activities')];
        _getStudentReport_decorators = [(0, common_1.Get)('student/:userId')];
        __esDecorate(_classThis, null, _getActivityReport_decorators, { kind: "method", name: "getActivityReport", static: false, private: false, access: { has: function (obj) { return "getActivityReport" in obj; }, get: function (obj) { return obj.getActivityReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStudentReport_decorators, { kind: "method", name: "getStudentReport", static: false, private: false, access: { has: function (obj) { return "getStudentReport" in obj; }, get: function (obj) { return obj.getStudentReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ActivityReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ActivityReportsController = _classThis;
}();
exports.ActivityReportsController = ActivityReportsController;
