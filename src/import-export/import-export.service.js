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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportService = void 0;
var common_1 = require("@nestjs/common");
var XLSX = require("xlsx");
var ImportExportService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ImportExportService = _classThis = /** @class */ (function () {
        function ImportExportService_1(resourceRepository) {
            this.resourceRepository = resourceRepository;
        }
        ImportExportService_1.prototype.importExcel = function (fileBuffer) {
            return __awaiter(this, void 0, void 0, function () {
                var workbook, totalImported, sheetsToImport, _i, sheetsToImport_1, sheetName, worksheet, data, resources, _a, resources_1, resource, existing;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            workbook = XLSX.read(fileBuffer, { type: 'buffer' });
                            totalImported = 0;
                            sheetsToImport = [
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
                            _i = 0, sheetsToImport_1 = sheetsToImport;
                            _b.label = 1;
                        case 1:
                            if (!(_i < sheetsToImport_1.length)) return [3 /*break*/, 7];
                            sheetName = sheetsToImport_1[_i];
                            if (!workbook.SheetNames.includes(sheetName))
                                return [3 /*break*/, 6];
                            worksheet = workbook.Sheets[sheetName];
                            data = XLSX.utils.sheet_to_json(worksheet, {
                                header: 1,
                                defval: '',
                            });
                            resources = this.parseSheet(sheetName, data);
                            _a = 0, resources_1 = resources;
                            _b.label = 2;
                        case 2:
                            if (!(_a < resources_1.length)) return [3 /*break*/, 6];
                            resource = resources_1[_a];
                            return [4 /*yield*/, this.resourceRepository.findOne({
                                    where: { code: resource.code },
                                })];
                        case 3:
                            existing = _b.sent();
                            if (!!existing) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.resourceRepository.save(resource)];
                        case 4:
                            _b.sent();
                            totalImported++;
                            _b.label = 5;
                        case 5:
                            _a++;
                            return [3 /*break*/, 2];
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/, { message: "Importaci\u00F3 completada", imported: totalImported }];
                    }
                });
            });
        };
        ImportExportService_1.prototype.parseSheet = function (sheetName, data) {
            var resources = [];
            var headers = [];
            var isFirstRow = true;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var row = data_1[_i];
                if (!row || row.length === 0)
                    continue;
                var firstCell = String(row[0] || '').toLowerCase();
                if (firstCell.includes('nº') ||
                    firstCell.includes('id') ||
                    firstCell === 'nº ordenador') {
                    headers = row.map(function (cell) {
                        return String(cell || '')
                            .toLowerCase()
                            .trim();
                    });
                    isFirstRow = false;
                    continue;
                }
                if (isFirstRow || !row[0] || String(row[0]).startsWith('nº'))
                    continue;
                var resource = this.mapRowToResource(sheetName, headers, row);
                if (resource && resource.code) {
                    resources.push(resource);
                }
            }
            return resources;
        };
        ImportExportService_1.prototype.mapRowToResource = function (sheetName, headers, row) {
            var getValue = function (key) {
                var index = headers.findIndex(function (h) { return h.includes(key); });
                return index >= 0 ? String(row[index] || '').trim() : '';
            };
            var code = getValue('ordenador');
            if (!code)
                code = getValue('id');
            if (!code && sheetName.includes('MBs'))
                code = getValue('placa');
            if (!code)
                return null;
            var statusMap = {
                '👍💪😀': 'available',
                '👍👌💪😀': 'available',
                '👎💀👀': 'occupied',
                '❓​🤷🏼‍♂️​😕🤷🏽‍♀️​': 'maintenance',
            };
            var rawStatus = getValue('estado');
            var status = statusMap[rawStatus] || 'available';
            var type = 'PC';
            if (sheetName.includes('Portatil'))
                type = 'Portàtil';
            if (sheetName.includes('MiniPortatil'))
                type = 'MiniPortàtil';
            if (sheetName.includes('Impresora'))
                type = 'Impressora';
            if (sheetName.includes('MBs'))
                type = 'Placa Base';
            var bitsValue = parseInt(getValue('bits'));
            var bits = !isNaN(bitsValue) ? bitsValue : undefined;
            return {
                code: code,
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
                status: status,
                type: type,
                createdAt: new Date().toISOString(),
            };
        };
        return ImportExportService_1;
    }());
    __setFunctionName(_classThis, "ImportExportService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ImportExportService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ImportExportService = _classThis;
}();
exports.ImportExportService = ImportExportService;
