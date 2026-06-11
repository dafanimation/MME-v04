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
exports.SpaceElement = void 0;
var typeorm_1 = require("typeorm");
var SpaceElement = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('space_elements')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _room_decorators;
    var _room_initializers = [];
    var _room_extraInitializers = [];
    var _elementUid_decorators;
    var _elementUid_initializers = [];
    var _elementUid_extraInitializers = [];
    var _template_decorators;
    var _template_initializers = [];
    var _template_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _shape_decorators;
    var _shape_initializers = [];
    var _shape_extraInitializers = [];
    var _dims_decorators;
    var _dims_initializers = [];
    var _dims_extraInitializers = [];
    var _x_decorators;
    var _x_initializers = [];
    var _x_extraInitializers = [];
    var _z_decorators;
    var _z_initializers = [];
    var _z_extraInitializers = [];
    var _yOffset_decorators;
    var _yOffset_initializers = [];
    var _yOffset_extraInitializers = [];
    var _rotationY_decorators;
    var _rotationY_initializers = [];
    var _rotationY_extraInitializers = [];
    var _borderColor_decorators;
    var _borderColor_initializers = [];
    var _borderColor_extraInitializers = [];
    var _fillColor_decorators;
    var _fillColor_initializers = [];
    var _fillColor_extraInitializers = [];
    var _fillOpacity_decorators;
    var _fillOpacity_initializers = [];
    var _fillOpacity_extraInitializers = [];
    var _assignment_decorators;
    var _assignment_initializers = [];
    var _assignment_extraInitializers = [];
    var _createdByEmail_decorators;
    var _createdByEmail_initializers = [];
    var _createdByEmail_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var SpaceElement = _classThis = /** @class */ (function () {
        function SpaceElement_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.room = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _room_initializers, void 0));
            this.elementUid = (__runInitializers(this, _room_extraInitializers), __runInitializers(this, _elementUid_initializers, void 0));
            this.template = (__runInitializers(this, _elementUid_extraInitializers), __runInitializers(this, _template_initializers, void 0));
            this.name = (__runInitializers(this, _template_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.shape = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _shape_initializers, void 0));
            this.dims = (__runInitializers(this, _shape_extraInitializers), __runInitializers(this, _dims_initializers, void 0));
            this.x = (__runInitializers(this, _dims_extraInitializers), __runInitializers(this, _x_initializers, void 0));
            this.z = (__runInitializers(this, _x_extraInitializers), __runInitializers(this, _z_initializers, void 0));
            this.yOffset = (__runInitializers(this, _z_extraInitializers), __runInitializers(this, _yOffset_initializers, void 0));
            this.rotationY = (__runInitializers(this, _yOffset_extraInitializers), __runInitializers(this, _rotationY_initializers, void 0));
            this.borderColor = (__runInitializers(this, _rotationY_extraInitializers), __runInitializers(this, _borderColor_initializers, void 0));
            this.fillColor = (__runInitializers(this, _borderColor_extraInitializers), __runInitializers(this, _fillColor_initializers, void 0));
            this.fillOpacity = (__runInitializers(this, _fillColor_extraInitializers), __runInitializers(this, _fillOpacity_initializers, void 0));
            this.assignment = (__runInitializers(this, _fillOpacity_extraInitializers), __runInitializers(this, _assignment_initializers, void 0));
            this.createdByEmail = (__runInitializers(this, _assignment_extraInitializers), __runInitializers(this, _createdByEmail_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdByEmail_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return SpaceElement_1;
    }());
    __setFunctionName(_classThis, "SpaceElement");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _room_decorators = [(0, typeorm_1.Column)()];
        _elementUid_decorators = [(0, typeorm_1.Column)()];
        _template_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _name_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _shape_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _dims_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _x_decorators = [(0, typeorm_1.Column)({ type: 'real', default: 0 })];
        _z_decorators = [(0, typeorm_1.Column)({ type: 'real', default: 0 })];
        _yOffset_decorators = [(0, typeorm_1.Column)({ type: 'real', default: 0 })];
        _rotationY_decorators = [(0, typeorm_1.Column)({ type: 'real', default: 0 })];
        _borderColor_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _fillColor_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _fillOpacity_decorators = [(0, typeorm_1.Column)({ type: 'real', default: 0.25 })];
        _assignment_decorators = [(0, typeorm_1.Column)({ type: 'simple-json', nullable: true })];
        _createdByEmail_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.Column)()];
        _updatedAt_decorators = [(0, typeorm_1.Column)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _room_decorators, { kind: "field", name: "room", static: false, private: false, access: { has: function (obj) { return "room" in obj; }, get: function (obj) { return obj.room; }, set: function (obj, value) { obj.room = value; } }, metadata: _metadata }, _room_initializers, _room_extraInitializers);
        __esDecorate(null, null, _elementUid_decorators, { kind: "field", name: "elementUid", static: false, private: false, access: { has: function (obj) { return "elementUid" in obj; }, get: function (obj) { return obj.elementUid; }, set: function (obj, value) { obj.elementUid = value; } }, metadata: _metadata }, _elementUid_initializers, _elementUid_extraInitializers);
        __esDecorate(null, null, _template_decorators, { kind: "field", name: "template", static: false, private: false, access: { has: function (obj) { return "template" in obj; }, get: function (obj) { return obj.template; }, set: function (obj, value) { obj.template = value; } }, metadata: _metadata }, _template_initializers, _template_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _shape_decorators, { kind: "field", name: "shape", static: false, private: false, access: { has: function (obj) { return "shape" in obj; }, get: function (obj) { return obj.shape; }, set: function (obj, value) { obj.shape = value; } }, metadata: _metadata }, _shape_initializers, _shape_extraInitializers);
        __esDecorate(null, null, _dims_decorators, { kind: "field", name: "dims", static: false, private: false, access: { has: function (obj) { return "dims" in obj; }, get: function (obj) { return obj.dims; }, set: function (obj, value) { obj.dims = value; } }, metadata: _metadata }, _dims_initializers, _dims_extraInitializers);
        __esDecorate(null, null, _x_decorators, { kind: "field", name: "x", static: false, private: false, access: { has: function (obj) { return "x" in obj; }, get: function (obj) { return obj.x; }, set: function (obj, value) { obj.x = value; } }, metadata: _metadata }, _x_initializers, _x_extraInitializers);
        __esDecorate(null, null, _z_decorators, { kind: "field", name: "z", static: false, private: false, access: { has: function (obj) { return "z" in obj; }, get: function (obj) { return obj.z; }, set: function (obj, value) { obj.z = value; } }, metadata: _metadata }, _z_initializers, _z_extraInitializers);
        __esDecorate(null, null, _yOffset_decorators, { kind: "field", name: "yOffset", static: false, private: false, access: { has: function (obj) { return "yOffset" in obj; }, get: function (obj) { return obj.yOffset; }, set: function (obj, value) { obj.yOffset = value; } }, metadata: _metadata }, _yOffset_initializers, _yOffset_extraInitializers);
        __esDecorate(null, null, _rotationY_decorators, { kind: "field", name: "rotationY", static: false, private: false, access: { has: function (obj) { return "rotationY" in obj; }, get: function (obj) { return obj.rotationY; }, set: function (obj, value) { obj.rotationY = value; } }, metadata: _metadata }, _rotationY_initializers, _rotationY_extraInitializers);
        __esDecorate(null, null, _borderColor_decorators, { kind: "field", name: "borderColor", static: false, private: false, access: { has: function (obj) { return "borderColor" in obj; }, get: function (obj) { return obj.borderColor; }, set: function (obj, value) { obj.borderColor = value; } }, metadata: _metadata }, _borderColor_initializers, _borderColor_extraInitializers);
        __esDecorate(null, null, _fillColor_decorators, { kind: "field", name: "fillColor", static: false, private: false, access: { has: function (obj) { return "fillColor" in obj; }, get: function (obj) { return obj.fillColor; }, set: function (obj, value) { obj.fillColor = value; } }, metadata: _metadata }, _fillColor_initializers, _fillColor_extraInitializers);
        __esDecorate(null, null, _fillOpacity_decorators, { kind: "field", name: "fillOpacity", static: false, private: false, access: { has: function (obj) { return "fillOpacity" in obj; }, get: function (obj) { return obj.fillOpacity; }, set: function (obj, value) { obj.fillOpacity = value; } }, metadata: _metadata }, _fillOpacity_initializers, _fillOpacity_extraInitializers);
        __esDecorate(null, null, _assignment_decorators, { kind: "field", name: "assignment", static: false, private: false, access: { has: function (obj) { return "assignment" in obj; }, get: function (obj) { return obj.assignment; }, set: function (obj, value) { obj.assignment = value; } }, metadata: _metadata }, _assignment_initializers, _assignment_extraInitializers);
        __esDecorate(null, null, _createdByEmail_decorators, { kind: "field", name: "createdByEmail", static: false, private: false, access: { has: function (obj) { return "createdByEmail" in obj; }, get: function (obj) { return obj.createdByEmail; }, set: function (obj, value) { obj.createdByEmail = value; } }, metadata: _metadata }, _createdByEmail_initializers, _createdByEmail_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SpaceElement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SpaceElement = _classThis;
}();
exports.SpaceElement = SpaceElement;
