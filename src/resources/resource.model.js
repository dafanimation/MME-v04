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
exports.Resource = void 0;
var typeorm_1 = require("typeorm");
var Resource = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('resources')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _os_decorators;
    var _os_initializers = [];
    var _os_extraInitializers = [];
    var _cpu_decorators;
    var _cpu_initializers = [];
    var _cpu_extraInitializers = [];
    var _ghz_decorators;
    var _ghz_initializers = [];
    var _ghz_extraInitializers = [];
    var _bits_decorators;
    var _bits_initializers = [];
    var _bits_extraInitializers = [];
    var _motherboard_decorators;
    var _motherboard_initializers = [];
    var _motherboard_extraInitializers = [];
    var _ram_decorators;
    var _ram_initializers = [];
    var _ram_extraInitializers = [];
    var _storage_decorators;
    var _storage_initializers = [];
    var _storage_extraInitializers = [];
    var _qrCode_decorators;
    var _qrCode_initializers = [];
    var _qrCode_extraInitializers = [];
    var _extras_decorators;
    var _extras_initializers = [];
    var _extras_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _assignedToUserId_decorators;
    var _assignedToUserId_initializers = [];
    var _assignedToUserId_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _driveLink_decorators;
    var _driveLink_initializers = [];
    var _driveLink_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var Resource = _classThis = /** @class */ (function () {
        function Resource_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.os = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _os_initializers, void 0));
            this.cpu = (__runInitializers(this, _os_extraInitializers), __runInitializers(this, _cpu_initializers, void 0));
            this.ghz = (__runInitializers(this, _cpu_extraInitializers), __runInitializers(this, _ghz_initializers, void 0));
            this.bits = (__runInitializers(this, _ghz_extraInitializers), __runInitializers(this, _bits_initializers, void 0));
            this.motherboard = (__runInitializers(this, _bits_extraInitializers), __runInitializers(this, _motherboard_initializers, void 0));
            this.ram = (__runInitializers(this, _motherboard_extraInitializers), __runInitializers(this, _ram_initializers, void 0));
            this.storage = (__runInitializers(this, _ram_extraInitializers), __runInitializers(this, _storage_initializers, void 0));
            this.qrCode = (__runInitializers(this, _storage_extraInitializers), __runInitializers(this, _qrCode_initializers, void 0));
            this.extras = (__runInitializers(this, _qrCode_extraInitializers), __runInitializers(this, _extras_initializers, void 0));
            this.notes = (__runInitializers(this, _extras_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.status = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.type = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            // CORREGIT: Tipus explícit 'integer' per SQLite
            this.assignedToUserId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _assignedToUserId_initializers, void 0));
            this.createdAt = (__runInitializers(this, _assignedToUserId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.driveLink = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _driveLink_initializers, void 0));
            this.location = (__runInitializers(this, _driveLink_extraInitializers), __runInitializers(this, _location_initializers, void 0));
            __runInitializers(this, _location_extraInitializers);
        }
        return Resource_1;
    }());
    __setFunctionName(_classThis, "Resource");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _code_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _name_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _os_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _cpu_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _ghz_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _bits_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'integer' })];
        _motherboard_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _ram_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _storage_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _qrCode_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _extras_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _notes_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({ default: 'available' })];
        _type_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _assignedToUserId_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'integer' })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        _driveLink_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _location_decorators = [(0, typeorm_1.Column)({ nullable: true, type: 'simple-json' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _os_decorators, { kind: "field", name: "os", static: false, private: false, access: { has: function (obj) { return "os" in obj; }, get: function (obj) { return obj.os; }, set: function (obj, value) { obj.os = value; } }, metadata: _metadata }, _os_initializers, _os_extraInitializers);
        __esDecorate(null, null, _cpu_decorators, { kind: "field", name: "cpu", static: false, private: false, access: { has: function (obj) { return "cpu" in obj; }, get: function (obj) { return obj.cpu; }, set: function (obj, value) { obj.cpu = value; } }, metadata: _metadata }, _cpu_initializers, _cpu_extraInitializers);
        __esDecorate(null, null, _ghz_decorators, { kind: "field", name: "ghz", static: false, private: false, access: { has: function (obj) { return "ghz" in obj; }, get: function (obj) { return obj.ghz; }, set: function (obj, value) { obj.ghz = value; } }, metadata: _metadata }, _ghz_initializers, _ghz_extraInitializers);
        __esDecorate(null, null, _bits_decorators, { kind: "field", name: "bits", static: false, private: false, access: { has: function (obj) { return "bits" in obj; }, get: function (obj) { return obj.bits; }, set: function (obj, value) { obj.bits = value; } }, metadata: _metadata }, _bits_initializers, _bits_extraInitializers);
        __esDecorate(null, null, _motherboard_decorators, { kind: "field", name: "motherboard", static: false, private: false, access: { has: function (obj) { return "motherboard" in obj; }, get: function (obj) { return obj.motherboard; }, set: function (obj, value) { obj.motherboard = value; } }, metadata: _metadata }, _motherboard_initializers, _motherboard_extraInitializers);
        __esDecorate(null, null, _ram_decorators, { kind: "field", name: "ram", static: false, private: false, access: { has: function (obj) { return "ram" in obj; }, get: function (obj) { return obj.ram; }, set: function (obj, value) { obj.ram = value; } }, metadata: _metadata }, _ram_initializers, _ram_extraInitializers);
        __esDecorate(null, null, _storage_decorators, { kind: "field", name: "storage", static: false, private: false, access: { has: function (obj) { return "storage" in obj; }, get: function (obj) { return obj.storage; }, set: function (obj, value) { obj.storage = value; } }, metadata: _metadata }, _storage_initializers, _storage_extraInitializers);
        __esDecorate(null, null, _qrCode_decorators, { kind: "field", name: "qrCode", static: false, private: false, access: { has: function (obj) { return "qrCode" in obj; }, get: function (obj) { return obj.qrCode; }, set: function (obj, value) { obj.qrCode = value; } }, metadata: _metadata }, _qrCode_initializers, _qrCode_extraInitializers);
        __esDecorate(null, null, _extras_decorators, { kind: "field", name: "extras", static: false, private: false, access: { has: function (obj) { return "extras" in obj; }, get: function (obj) { return obj.extras; }, set: function (obj, value) { obj.extras = value; } }, metadata: _metadata }, _extras_initializers, _extras_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _assignedToUserId_decorators, { kind: "field", name: "assignedToUserId", static: false, private: false, access: { has: function (obj) { return "assignedToUserId" in obj; }, get: function (obj) { return obj.assignedToUserId; }, set: function (obj, value) { obj.assignedToUserId = value; } }, metadata: _metadata }, _assignedToUserId_initializers, _assignedToUserId_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _driveLink_decorators, { kind: "field", name: "driveLink", static: false, private: false, access: { has: function (obj) { return "driveLink" in obj; }, get: function (obj) { return obj.driveLink; }, set: function (obj, value) { obj.driveLink = value; } }, metadata: _metadata }, _driveLink_initializers, _driveLink_extraInitializers);
        __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Resource = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Resource = _classThis;
}();
exports.Resource = Resource;
