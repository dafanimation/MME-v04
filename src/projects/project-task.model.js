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
exports.ProjectTask = void 0;
var typeorm_1 = require("typeorm");
var ProjectTask = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('project_tasks')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _projectId_decorators;
    var _projectId_initializers = [];
    var _projectId_extraInitializers = [];
    var _udActivityId_decorators;
    var _udActivityId_initializers = [];
    var _udActivityId_extraInitializers = [];
    var _activityCode_decorators;
    var _activityCode_initializers = [];
    var _activityCode_extraInitializers = [];
    var _ownerUserEmail_decorators;
    var _ownerUserEmail_initializers = [];
    var _ownerUserEmail_extraInitializers = [];
    var _mesaNum_decorators;
    var _mesaNum_initializers = [];
    var _mesaNum_extraInitializers = [];
    var _resourceCode_decorators;
    var _resourceCode_initializers = [];
    var _resourceCode_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var ProjectTask = _classThis = /** @class */ (function () {
        function ProjectTask_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.projectId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.udActivityId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _udActivityId_initializers, void 0));
            this.activityCode = (__runInitializers(this, _udActivityId_extraInitializers), __runInitializers(this, _activityCode_initializers, void 0));
            this.ownerUserEmail = (__runInitializers(this, _activityCode_extraInitializers), __runInitializers(this, _ownerUserEmail_initializers, void 0));
            this.mesaNum = (__runInitializers(this, _ownerUserEmail_extraInitializers), __runInitializers(this, _mesaNum_initializers, void 0));
            this.resourceCode = (__runInitializers(this, _mesaNum_extraInitializers), __runInitializers(this, _resourceCode_initializers, void 0));
            this.status = (__runInitializers(this, _resourceCode_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return ProjectTask_1;
    }());
    __setFunctionName(_classThis, "ProjectTask");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _projectId_decorators = [(0, typeorm_1.Column)()];
        _udActivityId_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _activityCode_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _ownerUserEmail_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _mesaNum_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _resourceCode_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({ default: 'pending' })];
        _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        _updatedAt_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: function (obj) { return "projectId" in obj; }, get: function (obj) { return obj.projectId; }, set: function (obj, value) { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _udActivityId_decorators, { kind: "field", name: "udActivityId", static: false, private: false, access: { has: function (obj) { return "udActivityId" in obj; }, get: function (obj) { return obj.udActivityId; }, set: function (obj, value) { obj.udActivityId = value; } }, metadata: _metadata }, _udActivityId_initializers, _udActivityId_extraInitializers);
        __esDecorate(null, null, _activityCode_decorators, { kind: "field", name: "activityCode", static: false, private: false, access: { has: function (obj) { return "activityCode" in obj; }, get: function (obj) { return obj.activityCode; }, set: function (obj, value) { obj.activityCode = value; } }, metadata: _metadata }, _activityCode_initializers, _activityCode_extraInitializers);
        __esDecorate(null, null, _ownerUserEmail_decorators, { kind: "field", name: "ownerUserEmail", static: false, private: false, access: { has: function (obj) { return "ownerUserEmail" in obj; }, get: function (obj) { return obj.ownerUserEmail; }, set: function (obj, value) { obj.ownerUserEmail = value; } }, metadata: _metadata }, _ownerUserEmail_initializers, _ownerUserEmail_extraInitializers);
        __esDecorate(null, null, _mesaNum_decorators, { kind: "field", name: "mesaNum", static: false, private: false, access: { has: function (obj) { return "mesaNum" in obj; }, get: function (obj) { return obj.mesaNum; }, set: function (obj, value) { obj.mesaNum = value; } }, metadata: _metadata }, _mesaNum_initializers, _mesaNum_extraInitializers);
        __esDecorate(null, null, _resourceCode_decorators, { kind: "field", name: "resourceCode", static: false, private: false, access: { has: function (obj) { return "resourceCode" in obj; }, get: function (obj) { return obj.resourceCode; }, set: function (obj, value) { obj.resourceCode = value; } }, metadata: _metadata }, _resourceCode_initializers, _resourceCode_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectTask = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectTask = _classThis;
}();
exports.ProjectTask = ProjectTask;
