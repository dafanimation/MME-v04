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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
// src/admin/admin.service.ts
var common_1 = require("@nestjs/common");
var whitelist_model_1 = require("./whitelist.model");
var fs = require("fs");
var path = require("path");
var ExcelJS = require("exceljs");
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(whitelistRepository) {
            this.whitelistRepository = whitelistRepository;
            // ─── Help Docs ────────────────────────────────────────────────────────────
            this.defaultHelpDocs = {
                usuarios: "# Ajuda usuaris\n\n- Login: POST /api/auth/login\n- Token JWT: Bearer a cada peticio\n- Veure meus recursos: GET /api/resources/my\n- Autoassignar recurs: POST /api/resources/self-assign\n- Alliberar recurs propi: POST /api/resources/release\n",
                grupos: "# Ajuda grups (mode informatiu)\n\n- Objectiu: associar alumnes, recursos i mesa de projecte.\n- Estat recomanat: planificacio -> desenvolupament -> exposicio -> completat.\n",
                apiMetodos: "# Metodes funcionals API\n\nAuth\n- POST /api/auth/login\n\nRecursos\n- GET /api/resources\n- GET /api/resources/my\n- POST /api/resources/self-assign\n- POST /api/resources/assign\n- POST /api/resources/release\n\nAdmin\n- GET /api/admin/whitelist\n- POST /api/admin/whitelist\n- DELETE /api/admin/whitelist/:email\n- POST /api/admin/whitelist/close-year\n",
            };
            this.getHelpDocsPath = function () { return path.join(process.cwd(), 'data', 'help-docs.json'); };
            this.getHelpDocsHistoryPath = function () { return path.join(process.cwd(), 'data', 'help-docs-history.json'); };
        }
        // On startup: import Excel whitelist if DB is empty
        AdminService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.whitelistRepository.count()];
                        case 1:
                            count = _a.sent();
                            if (!(count === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.importFromExcel()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.importFromExcel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var xlsxPath, adminEmail, emails, wb, ws, _a, _i, emails_1, email;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            xlsxPath = path.join(process.cwd(), 'data', 'whitelist.xlsx');
                            adminEmail = process.env.ADMIN_EMAIL || 'dlabiano@iesjoanramis.org';
                            emails = [adminEmail];
                            if (!fs.existsSync(xlsxPath)) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            wb = new ExcelJS.Workbook();
                            return [4 /*yield*/, wb.xlsx.readFile(xlsxPath)];
                        case 2:
                            _b.sent();
                            ws = wb.worksheets[0];
                            ws.eachRow(function (row, i) {
                                if (i === 1)
                                    return;
                                var email = String(row.getCell(1).value || '').trim();
                                if (email && !emails.includes(email))
                                    emails.push(email);
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            console.warn('⚠️ No s\'ha pogut llegir whitelist.xlsx — usant admin per defecte');
                            return [3 /*break*/, 4];
                        case 4:
                            _i = 0, emails_1 = emails;
                            _b.label = 5;
                        case 5:
                            if (!(_i < emails_1.length)) return [3 /*break*/, 8];
                            email = emails_1[_i];
                            return [4 /*yield*/, this.whitelistRepository.save(this.whitelistRepository.create({
                                    email: email,
                                    isActive: true,
                                    canEdit: true,
                                    approvedBy: 'system',
                                    approvedAt: new Date().toISOString(),
                                }))];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 5];
                        case 8:
                            console.log("\u2705 Whitelist importada: ".concat(emails.length, " emails"));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─── Whitelist CRUD ───────────────────────────────────────────────────────
        AdminService_1.prototype.getWhitelist = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                var qb;
                return __generator(this, function (_a) {
                    qb = this.whitelistRepository.createQueryBuilder('w');
                    if (filters === null || filters === void 0 ? void 0 : filters.academicYear)
                        qb.andWhere('w.academicYear = :y', { y: filters.academicYear });
                    if (filters === null || filters === void 0 ? void 0 : filters.module)
                        qb.andWhere('w.module = :m', { m: filters.module });
                    if ((filters === null || filters === void 0 ? void 0 : filters.isActive) !== undefined)
                        qb.andWhere('w.isActive = :a', { a: filters.isActive });
                    qb.orderBy('w.email', 'ASC');
                    return [2 /*return*/, qb.getMany()];
                });
            });
        };
        AdminService_1.prototype.isEmailAllowed = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.whitelistRepository.findOne({
                                where: { email: email, isActive: true },
                            })];
                        case 1:
                            entry = _a.sent();
                            return [2 /*return*/, !!entry];
                    }
                });
            });
        };
        AdminService_1.prototype.addToWhitelist = function (email, options) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.whitelistRepository.findOne({ where: { email: email } })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                if (existing.isActive)
                                    throw new common_1.ConflictException('Email ja està a la llista blanca');
                                // Reactivate
                                existing.isActive = true;
                                existing.canEdit = true;
                                existing.approvedAt = new Date().toISOString();
                                if (options === null || options === void 0 ? void 0 : options.approvedBy)
                                    existing.approvedBy = options.approvedBy;
                                return [2 /*return*/, this.whitelistRepository.save(existing)];
                            }
                            entry = this.whitelistRepository.create({
                                email: email,
                                academicYear: options === null || options === void 0 ? void 0 : options.academicYear,
                                module: options === null || options === void 0 ? void 0 : options.module,
                                isActive: true,
                                canEdit: true,
                                approvedBy: (options === null || options === void 0 ? void 0 : options.approvedBy) || 'admin',
                                approvedAt: new Date().toISOString(),
                            });
                            return [2 /*return*/, this.whitelistRepository.save(entry)];
                    }
                });
            });
        };
        AdminService_1.prototype.removeFromWhitelist = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.whitelistRepository.findOne({ where: { email: email } })];
                        case 1:
                            entry = _a.sent();
                            if (!entry)
                                throw new common_1.NotFoundException('Email no trobat a la llista blanca');
                            entry.isActive = false;
                            return [4 /*yield*/, this.whitelistRepository.save(entry)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: "Email ".concat(email, " desactivat de la llista blanca") }];
                    }
                });
            });
        };
        AdminService_1.prototype.closeAcademicYear = function (academicYear) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.whitelistRepository
                                .createQueryBuilder()
                                .update(whitelist_model_1.WhitelistEntry)
                                .set({ canEdit: false, isActive: false })
                                .where('academicYear = :y', { y: academicYear })
                                .execute()];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, {
                                    message: "Curs ".concat(academicYear, " tancat. Usuaris en mode consulta."),
                                    affected: (_a = result.affected) !== null && _a !== void 0 ? _a : 0,
                                }];
                    }
                });
            });
        };
        AdminService_1.prototype.ensureDataDir = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dir;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dir = path.join(process.cwd(), 'data');
                            if (!!fs.existsSync(dir)) return [3 /*break*/, 2];
                            return [4 /*yield*/, fs.promises.mkdir(dir, { recursive: true })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.getHelpDocs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var raw, p, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!fs.existsSync(this.getHelpDocsPath()))
                                return [2 /*return*/, this.defaultHelpDocs];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs.promises.readFile(this.getHelpDocsPath(), 'utf8')];
                        case 2:
                            raw = _b.sent();
                            p = JSON.parse(raw);
                            return [2 /*return*/, {
                                    usuarios: typeof (p === null || p === void 0 ? void 0 : p.usuarios) === 'string' ? p.usuarios : this.defaultHelpDocs.usuarios,
                                    grupos: typeof (p === null || p === void 0 ? void 0 : p.grupos) === 'string' ? p.grupos : this.defaultHelpDocs.grupos,
                                    apiMetodos: typeof (p === null || p === void 0 ? void 0 : p.apiMetodos) === 'string' ? p.apiMetodos : this.defaultHelpDocs.apiMetodos,
                                }];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, this.defaultHelpDocs];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.saveHelpDocs = function (docs_1) {
            return __awaiter(this, arguments, void 0, function (docs, updatedBy) {
                var current, normalized, history;
                if (updatedBy === void 0) { updatedBy = 'admin'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getHelpDocs()];
                        case 1:
                            current = _a.sent();
                            normalized = {
                                usuarios: typeof (docs === null || docs === void 0 ? void 0 : docs.usuarios) === 'string' ? docs.usuarios : current.usuarios,
                                grupos: typeof (docs === null || docs === void 0 ? void 0 : docs.grupos) === 'string' ? docs.grupos : current.grupos,
                                apiMetodos: typeof (docs === null || docs === void 0 ? void 0 : docs.apiMetodos) === 'string' ? docs.apiMetodos : current.apiMetodos,
                            };
                            return [4 /*yield*/, this.ensureDataDir()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, fs.promises.writeFile(this.getHelpDocsPath(), JSON.stringify(normalized, null, 2), 'utf8')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.getHelpDocsHistory()];
                        case 4:
                            history = _a.sent();
                            return [4 /*yield*/, fs.promises.writeFile(this.getHelpDocsHistoryPath(), JSON.stringify(__spreadArray([{ timestamp: new Date().toISOString(), updatedBy: updatedBy, summary: "u:".concat(normalized.usuarios.length, " g:").concat(normalized.grupos.length) }], history, true).slice(0, 50), null, 2), 'utf8')];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, { message: 'Help docs actualitzats' }];
                    }
                });
            });
        };
        AdminService_1.prototype.getHelpDocsHistory = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!fs.existsSync(this.getHelpDocsHistoryPath()))
                                return [2 /*return*/, []];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 4]);
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, fs.promises.readFile(this.getHelpDocsHistoryPath(), 'utf8')];
                        case 2: return [2 /*return*/, _b.apply(_a, [_d.sent()]).slice(0, 50)];
                        case 3:
                            _c = _d.sent();
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AdminService_1.prototype.exportHelpDocsMarkdown = function () {
            return __awaiter(this, void 0, void 0, function () {
                var docs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getHelpDocs()];
                        case 1:
                            docs = _a.sent();
                            return [2 /*return*/, { markdown: "# Guia API\n\n## Usuaris\n".concat(docs.usuarios, "\n\n## Grups\n").concat(docs.grupos, "\n\n## Metodes\n").concat(docs.apiMetodos, "\n\nGenerat: ").concat(new Date().toISOString()) }];
                    }
                });
            });
        };
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
