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
exports.ImportExportService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_model_1 = require("../resources/resource.model");
let ImportExportService = class ImportExportService {
    resourceRepository;
    constructor(resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
    async importExcel(fileBuffer) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        let totalImported = 0;
        const sheetsToImport = [
            'PCs A-TALLER-2024',
            'PCs B-TALLER-2024',
            'PCs C-TALLER-2024',
            'PCs D-TALLER-2024',
            'PCs U-TALLER-2024',
            'Portatils-TALLER-2024',
            'MiniPortatils-TALLER-2024',
            'Impresoras-TALLER-2024',
            'MBs -TALLER-2024',
        ];
        for (const sheetName of sheetsToImport) {
            if (!workbook.SheetNames.includes(sheetName))
                continue;
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: '',
            });
            const resources = this.parseSheet(sheetName, data);
            for (const resource of resources) {
                const existing = await this.resourceRepository.findOne({
                    where: { code: resource.code },
                });
                if (!existing) {
                    await this.resourceRepository.save(resource);
                    totalImported++;
                }
            }
        }
        return { message: `Importació completada`, imported: totalImported };
    }
    parseSheet(sheetName, data) {
        const resources = [];
        let headers = [];
        let isFirstRow = true;
        for (const row of data) {
            if (!row || row.length === 0)
                continue;
            const firstCell = String(row[0] || '').toLowerCase();
            if (firstCell.includes('nº') ||
                firstCell.includes('id') ||
                firstCell === 'nº ordenador') {
                headers = row.map((cell) => String(cell || '')
                    .toLowerCase()
                    .trim());
                isFirstRow = false;
                continue;
            }
            if (isFirstRow || !row[0] || String(row[0]).startsWith('nº'))
                continue;
            const resource = this.mapRowToResource(sheetName, headers, row);
            if (resource && resource.code) {
                resources.push(resource);
            }
        }
        return resources;
    }
    mapRowToResource(sheetName, headers, row) {
        const getValue = (key) => {
            const index = headers.findIndex((h) => h.includes(key));
            return index >= 0 ? String(row[index] || '').trim() : '';
        };
        let code = getValue('ordenador');
        if (!code)
            code = getValue('id');
        if (!code && sheetName.includes('MBs'))
            code = getValue('placa');
        if (!code)
            return null;
        const statusMap = {
            '👍💪😀': 'available',
            '👍👌💪😀': 'available',
            '👎💀👀': 'occupied',
            '❓​🤷🏼‍♂️​😕🤷🏽‍♀️​': 'maintenance',
        };
        const rawStatus = getValue('estado');
        const status = statusMap[rawStatus] || 'available';
        let type = 'PC';
        if (sheetName.includes('Portatil'))
            type = 'Portàtil';
        if (sheetName.includes('MiniPortatil'))
            type = 'MiniPortàtil';
        if (sheetName.includes('Impresora'))
            type = 'Impressora';
        if (sheetName.includes('MBs'))
            type = 'Placa Base';
        const bitsValue = parseInt(getValue('bits'));
        const bits = !isNaN(bitsValue) ? bitsValue : undefined;
        return {
            code,
            name: getValue('ordenador') || code,
            os: getValue('so'),
            cpu: getValue('cpu'),
            ghz: getValue('ghz'),
            bits: bits,
            motherboard: getValue('placab'),
            ram: getValue('ram'),
            storage: getValue('hdd/ssd'),
            qrCode: getValue('ficha qr'),
            extras: getValue('extras'),
            notes: getValue('notas'),
            status,
            type,
            createdAt: new Date().toISOString(),
        };
    }
};
exports.ImportExportService = ImportExportService;
exports.ImportExportService = ImportExportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_model_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImportExportService);
//# sourceMappingURL=import-export.service.js.map