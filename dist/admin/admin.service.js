"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const whitelist_model_1 = require("./whitelist.model");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ExcelJS = __importStar(require("exceljs"));
let AdminService = class AdminService {
    constructor(whitelistRepository) {
        this.whitelistRepository = whitelistRepository;
        this.defaultHelpDocs = {
            usuarios: `# Ajuda usuaris\n\n- Login: POST /api/auth/login\n- Token JWT: Bearer a cada peticio\n- Veure meus recursos: GET /api/resources/my\n- Autoassignar recurs: POST /api/resources/self-assign\n- Alliberar recurs propi: POST /api/resources/release\n`,
            grupos: `# Ajuda grups (mode informatiu)\n\n- Objectiu: associar alumnes, recursos i mesa de projecte.\n- Estat recomanat: planificacio -> desenvolupament -> exposicio -> completat.\n`,
            apiMetodos: `# Metodes funcionals API\n\nAuth\n- POST /api/auth/login\n\nRecursos\n- GET /api/resources\n- GET /api/resources/my\n- POST /api/resources/self-assign\n- POST /api/resources/assign\n- POST /api/resources/release\n\nAdmin\n- GET /api/admin/whitelist\n- POST /api/admin/whitelist\n- DELETE /api/admin/whitelist/:email\n- POST /api/admin/whitelist/close-year\n`,
        };
        this.getHelpDocsPath = () => path.join(process.cwd(), 'data', 'help-docs.json');
        this.getHelpDocsHistoryPath = () => path.join(process.cwd(), 'data', 'help-docs-history.json');
    }
    async onModuleInit() {
        const count = await this.whitelistRepository.count();
        if (count === 0) {
            await this.importFromExcel();
        }
    }
    async importFromExcel() {
        const xlsxPath = path.join(process.cwd(), 'data', 'whitelist.xlsx');
        const adminEmail = process.env.ADMIN_EMAIL || 'dlabiano@iesjoanramis.org';
        const emails = [adminEmail];
        if (fs.existsSync(xlsxPath)) {
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.readFile(xlsxPath);
                const ws = wb.worksheets[0];
                ws.eachRow((row, i) => {
                    if (i === 1)
                        return;
                    const email = String(row.getCell(1).value || '').trim();
                    if (email && !emails.includes(email))
                        emails.push(email);
                });
            }
            catch {
                console.warn('⚠️ No s\'ha pogut llegir whitelist.xlsx — usant admin per defecte');
            }
        }
        for (const email of emails) {
            await this.whitelistRepository.save(this.whitelistRepository.create({
                email,
                isActive: true,
                canEdit: true,
                approvedBy: 'system',
                approvedAt: new Date().toISOString(),
            }));
        }
        console.log(`✅ Whitelist importada: ${emails.length} emails`);
    }
    async getWhitelist(filters) {
        const qb = this.whitelistRepository.createQueryBuilder('w');
        if (filters?.academicYear)
            qb.andWhere('w.academicYear = :y', { y: filters.academicYear });
        if (filters?.module)
            qb.andWhere('w.module = :m', { m: filters.module });
        if (filters?.isActive !== undefined)
            qb.andWhere('w.isActive = :a', { a: filters.isActive });
        qb.orderBy('w.email', 'ASC');
        return qb.getMany();
    }
    async isEmailAllowed(email) {
        const entry = await this.whitelistRepository.findOne({
            where: { email, isActive: true },
        });
        return !!entry;
    }
    async addToWhitelist(email, options) {
        const existing = await this.whitelistRepository.findOne({ where: { email } });
        if (existing) {
            if (existing.isActive)
                throw new common_1.ConflictException('Email ja està a la llista blanca');
            existing.isActive = true;
            existing.canEdit = true;
            existing.approvedAt = new Date().toISOString();
            if (options?.approvedBy)
                existing.approvedBy = options.approvedBy;
            return this.whitelistRepository.save(existing);
        }
        const entry = this.whitelistRepository.create({
            email,
            academicYear: options?.academicYear,
            module: options?.module,
            isActive: true,
            canEdit: true,
            approvedBy: options?.approvedBy || 'admin',
            approvedAt: new Date().toISOString(),
        });
        return this.whitelistRepository.save(entry);
    }
    async removeFromWhitelist(email) {
        const entry = await this.whitelistRepository.findOne({ where: { email } });
        if (!entry)
            throw new common_1.NotFoundException('Email no trobat a la llista blanca');
        entry.isActive = false;
        await this.whitelistRepository.save(entry);
        return { message: `Email ${email} desactivat de la llista blanca` };
    }
    async closeAcademicYear(academicYear) {
        const result = await this.whitelistRepository
            .createQueryBuilder()
            .update(whitelist_model_1.WhitelistEntry)
            .set({ canEdit: false, isActive: false })
            .where('academicYear = :y', { y: academicYear })
            .execute();
        return {
            message: `Curs ${academicYear} tancat. Usuaris en mode consulta.`,
            affected: result.affected ?? 0,
        };
    }
    async ensureDataDir() {
        const dir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dir))
            await fs.promises.mkdir(dir, { recursive: true });
    }
    async getHelpDocs() {
        if (!fs.existsSync(this.getHelpDocsPath()))
            return this.defaultHelpDocs;
        try {
            const raw = await fs.promises.readFile(this.getHelpDocsPath(), 'utf8');
            const p = JSON.parse(raw);
            return {
                usuarios: typeof p?.usuarios === 'string' ? p.usuarios : this.defaultHelpDocs.usuarios,
                grupos: typeof p?.grupos === 'string' ? p.grupos : this.defaultHelpDocs.grupos,
                apiMetodos: typeof p?.apiMetodos === 'string' ? p.apiMetodos : this.defaultHelpDocs.apiMetodos,
            };
        }
        catch {
            return this.defaultHelpDocs;
        }
    }
    async saveHelpDocs(docs, updatedBy = 'admin') {
        const current = await this.getHelpDocs();
        const normalized = {
            usuarios: typeof docs?.usuarios === 'string' ? docs.usuarios : current.usuarios,
            grupos: typeof docs?.grupos === 'string' ? docs.grupos : current.grupos,
            apiMetodos: typeof docs?.apiMetodos === 'string' ? docs.apiMetodos : current.apiMetodos,
        };
        await this.ensureDataDir();
        await fs.promises.writeFile(this.getHelpDocsPath(), JSON.stringify(normalized, null, 2), 'utf8');
        const history = await this.getHelpDocsHistory();
        await fs.promises.writeFile(this.getHelpDocsHistoryPath(), JSON.stringify([{ timestamp: new Date().toISOString(), updatedBy, summary: `u:${normalized.usuarios.length} g:${normalized.grupos.length}` }, ...history].slice(0, 50), null, 2), 'utf8');
        return { message: 'Help docs actualitzats' };
    }
    async getHelpDocsHistory() {
        if (!fs.existsSync(this.getHelpDocsHistoryPath()))
            return [];
        try {
            return JSON.parse(await fs.promises.readFile(this.getHelpDocsHistoryPath(), 'utf8')).slice(0, 50);
        }
        catch {
            return [];
        }
    }
    async exportHelpDocsMarkdown() {
        const docs = await this.getHelpDocs();
        return { markdown: `# Guia API\n\n## Usuaris\n${docs.usuarios}\n\n## Grups\n${docs.grupos}\n\n## Metodes\n${docs.apiMetodos}\n\nGenerat: ${new Date().toISOString()}` };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(whitelist_model_1.WhitelistEntry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map