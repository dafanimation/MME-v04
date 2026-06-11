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
exports.StorageLocation = void 0;
var typeorm_1 = require("typeorm");
var StorageLocation = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('storage_locations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _zone_decorators;
    var _zone_initializers = [];
    var _zone_extraInitializers = [];
    var _row_decorators;
    var _row_initializers = [];
    var _row_extraInitializers = [];
    var _module_decorators;
    var _module_initializers = [];
    var _module_extraInitializers = [];
    var _label_decorators;
    var _label_initializers = [];
    var _label_extraInitializers = [];
    var _room_decorators;
    var _room_initializers = [];
    var _room_extraInitializers = [];
    var _capacity_decorators;
    var _capacity_initializers = [];
    var _capacity_extraInitializers = [];
    var _active_decorators;
    var _active_initializers = [];
    var _active_extraInitializers = [];
    var _coordinates_decorators;
    var _coordinates_initializers = [];
    var _coordinates_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var StorageLocation = _classThis = /** @class */ (function () {
        function StorageLocation_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.zone = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
            this.row = (__runInitializers(this, _zone_extraInitializers), __runInitializers(this, _row_initializers, void 0));
            this.module = (__runInitializers(this, _row_extraInitializers), __runInitializers(this, _module_initializers, void 0));
            this.label = (__runInitializers(this, _module_extraInitializers), __runInitializers(this, _label_initializers, void 0));
            this.room = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _room_initializers, void 0));
            this.capacity = (__runInitializers(this, _room_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
            this.active = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.coordinates = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _coordinates_initializers, void 0));
            this.createdAt = (__runInitializers(this, _coordinates_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return StorageLocation_1;
    }());
    __setFunctionName(_classThis, "StorageLocation");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _type_decorators = [(0, typeorm_1.Column)()];
        _zone_decorators = [(0, typeorm_1.Column)()];
        _row_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _module_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _label_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _room_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _capacity_decorators = [(0, typeorm_1.Column)({ default: 0 })];
        _active_decorators = [(0, typeorm_1.Column)({ default: true })];
        _coordinates_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        _updatedAt_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: function (obj) { return "zone" in obj; }, get: function (obj) { return obj.zone; }, set: function (obj, value) { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
        __esDecorate(null, null, _row_decorators, { kind: "field", name: "row", static: false, private: false, access: { has: function (obj) { return "row" in obj; }, get: function (obj) { return obj.row; }, set: function (obj, value) { obj.row = value; } }, metadata: _metadata }, _row_initializers, _row_extraInitializers);
        __esDecorate(null, null, _module_decorators, { kind: "field", name: "module", static: false, private: false, access: { has: function (obj) { return "module" in obj; }, get: function (obj) { return obj.module; }, set: function (obj, value) { obj.module = value; } }, metadata: _metadata }, _module_initializers, _module_extraInitializers);
        __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: function (obj) { return "label" in obj; }, get: function (obj) { return obj.label; }, set: function (obj, value) { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
        __esDecorate(null, null, _room_decorators, { kind: "field", name: "room", static: false, private: false, access: { has: function (obj) { return "room" in obj; }, get: function (obj) { return obj.room; }, set: function (obj, value) { obj.room = value; } }, metadata: _metadata }, _room_initializers, _room_extraInitializers);
        __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: function (obj) { return "capacity" in obj; }, get: function (obj) { return obj.capacity; }, set: function (obj, value) { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: function (obj) { return "active" in obj; }, get: function (obj) { return obj.active; }, set: function (obj, value) { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _coordinates_decorators, { kind: "field", name: "coordinates", static: false, private: false, access: { has: function (obj) { return "coordinates" in obj; }, get: function (obj) { return obj.coordinates; }, set: function (obj, value) { obj.coordinates = value; } }, metadata: _metadata }, _coordinates_initializers, _coordinates_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StorageLocation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StorageLocation = _classThis;
}();
exports.StorageLocation = StorageLocation;
