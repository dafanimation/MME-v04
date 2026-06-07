"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceElementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const space_element_model_1 = require("./space-element.model");
const space_elements_service_1 = require("./space-elements.service");
const space_elements_controller_1 = require("./space-elements.controller");
let SpaceElementsModule = class SpaceElementsModule {
};
exports.SpaceElementsModule = SpaceElementsModule;
exports.SpaceElementsModule = SpaceElementsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([space_element_model_1.SpaceElement])],
        providers: [space_elements_service_1.SpaceElementsService],
        controllers: [space_elements_controller_1.SpaceElementsController],
        exports: [space_elements_service_1.SpaceElementsService],
    })
], SpaceElementsModule);
//# sourceMappingURL=space-elements.module.js.map