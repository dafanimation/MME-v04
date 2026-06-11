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
exports.UserActivityProgress = void 0;
var typeorm_1 = require("typeorm");
var UserActivityProgress = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('user_activity_progress')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _activityId_decorators;
    var _activityId_initializers = [];
    var _activityId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _progressPercent_decorators;
    var _progressPercent_initializers = [];
    var _progressPercent_extraInitializers = [];
    var _completedSteps_decorators;
    var _completedSteps_initializers = [];
    var _completedSteps_extraInitializers = [];
    var _completedCheckmarks_decorators;
    var _completedCheckmarks_initializers = [];
    var _completedCheckmarks_extraInitializers = [];
    var _grade_decorators;
    var _grade_initializers = [];
    var _grade_extraInitializers = [];
    var _submittedAt_decorators;
    var _submittedAt_initializers = [];
    var _submittedAt_extraInitializers = [];
    var _validatedBy_decorators;
    var _validatedBy_initializers = [];
    var _validatedBy_extraInitializers = [];
    var _returnedReason_decorators;
    var _returnedReason_initializers = [];
    var _returnedReason_extraInitializers = [];
    var _resourcesUsed_decorators;
    var _resourcesUsed_initializers = [];
    var _resourcesUsed_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var UserActivityProgress = _classThis = /** @class */ (function () {
        function UserActivityProgress_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.activityId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _activityId_initializers, void 0));
            this.status = (__runInitializers(this, _activityId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.progressPercent = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _progressPercent_initializers, void 0));
            this.completedSteps = (__runInitializers(this, _progressPercent_extraInitializers), __runInitializers(this, _completedSteps_initializers, void 0));
            this.completedCheckmarks = (__runInitializers(this, _completedSteps_extraInitializers), __runInitializers(this, _completedCheckmarks_initializers, void 0));
            this.grade = (__runInitializers(this, _completedCheckmarks_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
            this.submittedAt = (__runInitializers(this, _grade_extraInitializers), __runInitializers(this, _submittedAt_initializers, void 0));
            this.validatedBy = (__runInitializers(this, _submittedAt_extraInitializers), __runInitializers(this, _validatedBy_initializers, void 0));
            this.returnedReason = (__runInitializers(this, _validatedBy_extraInitializers), __runInitializers(this, _returnedReason_initializers, void 0));
            this.resourcesUsed = (__runInitializers(this, _returnedReason_extraInitializers), __runInitializers(this, _resourcesUsed_initializers, void 0));
            this.createdAt = (__runInitializers(this, _resourcesUsed_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return UserActivityProgress_1;
    }());
    __setFunctionName(_classThis, "UserActivityProgress");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _userId_decorators = [(0, typeorm_1.Column)()];
        _activityId_decorators = [(0, typeorm_1.Column)()];
        _status_decorators = [(0, typeorm_1.Column)({ default: 'pending' })];
        _progressPercent_decorators = [(0, typeorm_1.Column)({ default: 0 })];
        _completedSteps_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'simple-json' })];
        _completedCheckmarks_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'simple-json' })];
        _grade_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'real' })];
        _submittedAt_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _validatedBy_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _returnedReason_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _resourcesUsed_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'simple-json' })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        _updatedAt_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _activityId_decorators, { kind: "field", name: "activityId", static: false, private: false, access: { has: function (obj) { return "activityId" in obj; }, get: function (obj) { return obj.activityId; }, set: function (obj, value) { obj.activityId = value; } }, metadata: _metadata }, _activityId_initializers, _activityId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _progressPercent_decorators, { kind: "field", name: "progressPercent", static: false, private: false, access: { has: function (obj) { return "progressPercent" in obj; }, get: function (obj) { return obj.progressPercent; }, set: function (obj, value) { obj.progressPercent = value; } }, metadata: _metadata }, _progressPercent_initializers, _progressPercent_extraInitializers);
        __esDecorate(null, null, _completedSteps_decorators, { kind: "field", name: "completedSteps", static: false, private: false, access: { has: function (obj) { return "completedSteps" in obj; }, get: function (obj) { return obj.completedSteps; }, set: function (obj, value) { obj.completedSteps = value; } }, metadata: _metadata }, _completedSteps_initializers, _completedSteps_extraInitializers);
        __esDecorate(null, null, _completedCheckmarks_decorators, { kind: "field", name: "completedCheckmarks", static: false, private: false, access: { has: function (obj) { return "completedCheckmarks" in obj; }, get: function (obj) { return obj.completedCheckmarks; }, set: function (obj, value) { obj.completedCheckmarks = value; } }, metadata: _metadata }, _completedCheckmarks_initializers, _completedCheckmarks_extraInitializers);
        __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: function (obj) { return "grade" in obj; }, get: function (obj) { return obj.grade; }, set: function (obj, value) { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
        __esDecorate(null, null, _submittedAt_decorators, { kind: "field", name: "submittedAt", static: false, private: false, access: { has: function (obj) { return "submittedAt" in obj; }, get: function (obj) { return obj.submittedAt; }, set: function (obj, value) { obj.submittedAt = value; } }, metadata: _metadata }, _submittedAt_initializers, _submittedAt_extraInitializers);
        __esDecorate(null, null, _validatedBy_decorators, { kind: "field", name: "validatedBy", static: false, private: false, access: { has: function (obj) { return "validatedBy" in obj; }, get: function (obj) { return obj.validatedBy; }, set: function (obj, value) { obj.validatedBy = value; } }, metadata: _metadata }, _validatedBy_initializers, _validatedBy_extraInitializers);
        __esDecorate(null, null, _returnedReason_decorators, { kind: "field", name: "returnedReason", static: false, private: false, access: { has: function (obj) { return "returnedReason" in obj; }, get: function (obj) { return obj.returnedReason; }, set: function (obj, value) { obj.returnedReason = value; } }, metadata: _metadata }, _returnedReason_initializers, _returnedReason_extraInitializers);
        __esDecorate(null, null, _resourcesUsed_decorators, { kind: "field", name: "resourcesUsed", static: false, private: false, access: { has: function (obj) { return "resourcesUsed" in obj; }, get: function (obj) { return obj.resourcesUsed; }, set: function (obj, value) { obj.resourcesUsed = value; } }, metadata: _metadata }, _resourcesUsed_initializers, _resourcesUsed_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserActivityProgress = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserActivityProgress = _classThis;
}();
exports.UserActivityProgress = UserActivityProgress;
