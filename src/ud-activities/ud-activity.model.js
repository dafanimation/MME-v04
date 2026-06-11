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
exports.UdActivity = void 0;
var typeorm_1 = require("typeorm");
var UdActivity = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('ud_activities')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _udCode_decorators;
    var _udCode_initializers = [];
    var _udCode_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _statement_decorators;
    var _statement_initializers = [];
    var _statement_extraInitializers = [];
    var _requiredEquipment_decorators;
    var _requiredEquipment_initializers = [];
    var _requiredEquipment_extraInitializers = [];
    var _assignmentMode_decorators;
    var _assignmentMode_initializers = [];
    var _assignmentMode_extraInitializers = [];
    var _resourceTypes_decorators;
    var _resourceTypes_initializers = [];
    var _resourceTypes_extraInitializers = [];
    var _links_decorators;
    var _links_initializers = [];
    var _links_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var _projectId_decorators;
    var _projectId_initializers = [];
    var _projectId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var UdActivity = _classThis = /** @class */ (function () {
        function UdActivity_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.udCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _udCode_initializers, void 0));
            this.title = (__runInitializers(this, _udCode_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.date = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.statement = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _statement_initializers, void 0));
            this.requiredEquipment = (__runInitializers(this, _statement_extraInitializers), __runInitializers(this, _requiredEquipment_initializers, void 0));
            this.assignmentMode = (__runInitializers(this, _requiredEquipment_extraInitializers), __runInitializers(this, _assignmentMode_initializers, void 0));
            this.resourceTypes = (__runInitializers(this, _assignmentMode_extraInitializers), __runInitializers(this, _resourceTypes_initializers, void 0));
            this.links = (__runInitializers(this, _resourceTypes_extraInitializers), __runInitializers(this, _links_initializers, void 0));
            this.images = (__runInitializers(this, _links_extraInitializers), __runInitializers(this, _images_initializers, void 0));
            this.projectId = (__runInitializers(this, _images_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.status = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return UdActivity_1;
    }());
    __setFunctionName(_classThis, "UdActivity");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _udCode_decorators = [(0, typeorm_1.Column)()];
        _title_decorators = [(0, typeorm_1.Column)()];
        _date_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _statement_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _requiredEquipment_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _assignmentMode_decorators = [(0, typeorm_1.Column)({ default: 'admin' })];
        _resourceTypes_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _links_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _images_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _projectId_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({ default: 'planned' })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        _updatedAt_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _udCode_decorators, { kind: "field", name: "udCode", static: false, private: false, access: { has: function (obj) { return "udCode" in obj; }, get: function (obj) { return obj.udCode; }, set: function (obj, value) { obj.udCode = value; } }, metadata: _metadata }, _udCode_initializers, _udCode_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _statement_decorators, { kind: "field", name: "statement", static: false, private: false, access: { has: function (obj) { return "statement" in obj; }, get: function (obj) { return obj.statement; }, set: function (obj, value) { obj.statement = value; } }, metadata: _metadata }, _statement_initializers, _statement_extraInitializers);
        __esDecorate(null, null, _requiredEquipment_decorators, { kind: "field", name: "requiredEquipment", static: false, private: false, access: { has: function (obj) { return "requiredEquipment" in obj; }, get: function (obj) { return obj.requiredEquipment; }, set: function (obj, value) { obj.requiredEquipment = value; } }, metadata: _metadata }, _requiredEquipment_initializers, _requiredEquipment_extraInitializers);
        __esDecorate(null, null, _assignmentMode_decorators, { kind: "field", name: "assignmentMode", static: false, private: false, access: { has: function (obj) { return "assignmentMode" in obj; }, get: function (obj) { return obj.assignmentMode; }, set: function (obj, value) { obj.assignmentMode = value; } }, metadata: _metadata }, _assignmentMode_initializers, _assignmentMode_extraInitializers);
        __esDecorate(null, null, _resourceTypes_decorators, { kind: "field", name: "resourceTypes", static: false, private: false, access: { has: function (obj) { return "resourceTypes" in obj; }, get: function (obj) { return obj.resourceTypes; }, set: function (obj, value) { obj.resourceTypes = value; } }, metadata: _metadata }, _resourceTypes_initializers, _resourceTypes_extraInitializers);
        __esDecorate(null, null, _links_decorators, { kind: "field", name: "links", static: false, private: false, access: { has: function (obj) { return "links" in obj; }, get: function (obj) { return obj.links; }, set: function (obj, value) { obj.links = value; } }, metadata: _metadata }, _links_initializers, _links_extraInitializers);
        __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: function (obj) { return "projectId" in obj; }, get: function (obj) { return obj.projectId; }, set: function (obj, value) { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UdActivity = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UdActivity = _classThis;
}();
exports.UdActivity = UdActivity;
