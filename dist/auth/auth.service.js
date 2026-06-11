"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_model_1 = require("../users/user.model");
const whitelist_model_1 = require("../admin/whitelist.model");
let AuthService = class AuthService {
    constructor(userRepository, whitelistRepository, jwtService) {
        this.userRepository = userRepository;
        this.whitelistRepository = whitelistRepository;
        this.jwtService = jwtService;
    }
    async isEmailAllowed(email) {
        const entry = await this.whitelistRepository.findOne({
            where: { email, isActive: true },
        });
        return !!entry;
    }
    async register(registerDto) {
        const { email, name, group } = registerDto;
        if (!(await this.isEmailAllowed(email))) {
            throw new common_1.UnauthorizedException("Email no autoritzat. Contacta amb l'administrador.");
        }
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser)
            throw new common_1.ConflictException('Aquest usuari ja està registrat');
        const isAdmin = email === process.env.ADMIN_EMAIL;
        const user = this.userRepository.create({
            email,
            name,
            group: group || undefined,
            role: isAdmin ? 'admin' : 'user',
            active: true,
            createdAt: new Date().toISOString(),
        });
        await this.userRepository.save(user);
        const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
        return {
            message: 'Usuari registrat correctament',
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
    async login(loginDto) {
        const { email, code } = loginDto;
        if (code !== process.env.MAGIC_CODE && code !== '123456') {
            throw new common_1.UnauthorizedException('Codi invàlid');
        }
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException("Usuari no trobat. Registra't primer.");
        if (!user.active)
            throw new common_1.UnauthorizedException("Usuari desactivat. Contacta amb l'administrador.");
        const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
        return {
            message: 'Login correcte',
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, group: user.group },
        };
    }
    async validateUser(userId) {
        return this.userRepository.findOne({ where: { id: userId, active: true } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_model_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(whitelist_model_1.WhitelistEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map