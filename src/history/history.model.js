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
exports.History = void 0;
var typeorm_1 = require("typeorm");
var History = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('history')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _userName_decorators;
    var _userName_initializers = [];
    var _userName_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _resourceId_decorators;
    var _resourceId_initializers = [];
    var _resourceId_extraInitializers = [];
    var _resourceCode_decorators;
    var _resourceCode_initializers = [];
    var _resourceCode_extraInitializers = [];
    var _details_decorators;
    var _details_initializers = [];
    var _details_extraInitializers = [];
    var _activityId_decorators;
    var _activityId_initializers = [];
    var _activityId_extraInitializers = [];
    var _oldValue_decorators;
    var _oldValue_initializers = [];
    var _oldValue_extraInitializers = [];
    var _newValue_decorators;
    var _newValue_initializers = [];
    var _newValue_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var History = _classThis = /** @class */ (function () {
        function History_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.userName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
            this.action = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.resourceId = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _resourceId_initializers, void 0));
            this.resourceCode = (__runInitializers(this, _resourceId_extraInitializers), __runInitializers(this, _resourceCode_initializers, void 0));
            this.details = (__runInitializers(this, _resourceCode_extraInitializers), __runInitializers(this, _details_initializers, void 0));
            // Extended fields
            this.activityId = (__runInitializers(this, _details_extraInitializers), __runInitializers(this, _activityId_initializers, void 0));
            this.oldValue = (__runInitializers(this, _activityId_extraInitializers), __runInitializers(this, _oldValue_initializers, void 0));
            this.newValue = (__runInitializers(this, _oldValue_extraInitializers), __runInitializers(this, _newValue_initializers, void 0));
            this.notes = (__runInitializers(this, _newValue_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdBy = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return History_1;
    }());
    __setFunctionName(_classThis, "History");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _userId_decorators = [(0, typeorm_1.Column)()];
        _userName_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _action_decorators = [(0, typeorm_1.Column)()];
        _resourceId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _resourceCode_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _details_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _activityId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _oldValue_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _newValue_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _notes_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _createdBy_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _metadata_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'simple-json' })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: function (obj) { return "userName" in obj; }, get: function (obj) { return obj.userName; }, set: function (obj, value) { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _resourceId_decorators, { kind: "field", name: "resourceId", static: false, private: false, access: { has: function (obj) { return "resourceId" in obj; }, get: function (obj) { return obj.resourceId; }, set: function (obj, value) { obj.resourceId = value; } }, metadata: _metadata }, _resourceId_initializers, _resourceId_extraInitializers);
        __esDecorate(null, null, _resourceCode_decorators, { kind: "field", name: "resourceCode", static: false, private: false, access: { has: function (obj) { return "resourceCode" in obj; }, get: function (obj) { return obj.resourceCode; }, set: function (obj, value) { obj.resourceCode = value; } }, metadata: _metadata }, _resourceCode_initializers, _resourceCode_extraInitializers);
        __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: function (obj) { return "details" in obj; }, get: function (obj) { return obj.details; }, set: function (obj, value) { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
        __esDecorate(null, null, _activityId_decorators, { kind: "field", name: "activityId", static: false, private: false, access: { has: function (obj) { return "activityId" in obj; }, get: function (obj) { return obj.activityId; }, set: function (obj, value) { obj.activityId = value; } }, metadata: _metadata }, _activityId_initializers, _activityId_extraInitializers);
        __esDecorate(null, null, _oldValue_decorators, { kind: "field", name: "oldValue", static: false, private: false, access: { has: function (obj) { return "oldValue" in obj; }, get: function (obj) { return obj.oldValue; }, set: function (obj, value) { obj.oldValue = value; } }, metadata: _metadata }, _oldValue_initializers, _oldValue_extraInitializers);
        __esDecorate(null, null, _newValue_decorators, { kind: "field", name: "newValue", static: false, private: false, access: { has: function (obj) { return "newValue" in obj; }, get: function (obj) { return obj.newValue; }, set: function (obj, value) { obj.newValue = value; } }, metadata: _metadata }, _newValue_initializers, _newValue_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        History = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return History = _classThis;
}();
exports.History = History;
