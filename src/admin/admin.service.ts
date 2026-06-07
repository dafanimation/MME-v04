// src/admin/admin.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistEntry } from './whitelist.model';
import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(WhitelistEntry)
    private whitelistRepository: Repository<WhitelistEntry>,
  ) {}

  // On startup: import Excel whitelist if DB is empty
  async onModuleInit() {
    const count = await this.whitelistRepository.count();
    if (count === 0) {
      await this.importFromExcel();
    }
  }

  private async importFromExcel(): Promise<void> {
    const xlsxPath = path.join(process.cwd(), 'data', 'whitelist.xlsx');
    const adminEmail = process.env.ADMIN_EMAIL || 'dlabiano@iesjoanramis.org';

    const emails: string[] = [adminEmail];

    if (fs.existsSync(xlsxPath)) {
      try {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(xlsxPath);
        const ws = wb.worksheets[0];
        ws.eachRow((row, i) => {
          if (i === 1) return;
          const email = String(row.getCell(1).value || '').trim();
          if (email && !emails.includes(email)) emails.push(email);
        });
      } catch {
        console.warn('⚠️ No s\'ha pogut llegir whitelist.xlsx — usant admin per defecte');
      }
    }

    for (const email of emails) {
      await this.whitelistRepository.save(
        this.whitelistRepository.create({
          email,
          isActive: true,
          canEdit: true,
          approvedBy: 'system',
          approvedAt: new Date().toISOString(),
        }),
      );
    }
    console.log(`✅ Whitelist importada: ${emails.length} emails`);
  }

  // ─── Whitelist CRUD ───────────────────────────────────────────────────────

  async getWhitelist(filters?: {
    academicYear?: string;
    module?: string;
    isActive?: boolean;
  }): Promise<WhitelistEntry[]> {
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

  async isEmailAllowed(email: string): Promise<boolean> {
    const entry = await this.whitelistRepository.findOne({
      where: { email, isActive: true },
    });
    return !!entry;
  }

  async addToWhitelist(
    email: string,
    options?: { academicYear?: string; module?: string; approvedBy?: string },
  ): Promise<WhitelistEntry> {
    const existing = await this.whitelistRepository.findOne({ where: { email } });
    if (existing) {
      if (existing.isActive) throw new ConflictException('Email ja està a la llista blanca');
      // Reactivate
      existing.isActive = true;
      existing.canEdit = true;
      existing.approvedAt = new Date().toISOString();
      if (options?.approvedBy) existing.approvedBy = options.approvedBy;
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

  async removeFromWhitelist(email: string): Promise<{ message: string }> {
    const entry = await this.whitelistRepository.findOne({ where: { email } });
    if (!entry) throw new NotFoundException('Email no trobat a la llista blanca');
    entry.isActive = false;
    await this.whitelistRepository.save(entry);
    return { message: `Email ${email} desactivat de la llista blanca` };
  }

  async closeAcademicYear(academicYear: string): Promise<{ message: string; affected: number }> {
    const result = await this.whitelistRepository
      .createQueryBuilder()
      .update(WhitelistEntry)
      .set({ canEdit: false, isActive: false })
      .where('academicYear = :y', { y: academicYear })
      .execute();
    return {
      message: `Curs ${academicYear} tancat. Usuaris en mode consulta.`,
      affected: result.affected ?? 0,
    };
  }

  // ─── Help Docs ────────────────────────────────────────────────────────────

  private readonly defaultHelpDocs = {
    usuarios: `# Ajuda usuaris\n\n- Login: POST /api/auth/login\n- Token JWT: Bearer a cada peticio\n- Veure meus recursos: GET /api/resources/my\n- Autoassignar recurs: POST /api/resources/self-assign\n- Alliberar recurs propi: POST /api/resources/release\n`,
    grupos: `# Ajuda grups (mode informatiu)\n\n- Objectiu: associar alumnes, recursos i mesa de projecte.\n- Estat recomanat: planificacio -> desenvolupament -> exposicio -> completat.\n`,
    apiMetodos: `# Metodes funcionals API\n\nAuth\n- POST /api/auth/login\n\nRecursos\n- GET /api/resources\n- GET /api/resources/my\n- POST /api/resources/self-assign\n- POST /api/resources/assign\n- POST /api/resources/release\n\nAdmin\n- GET /api/admin/whitelist\n- POST /api/admin/whitelist\n- DELETE /api/admin/whitelist/:email\n- POST /api/admin/whitelist/close-year\n`,
  };

  private getHelpDocsPath = () => path.join(process.cwd(), 'data', 'help-docs.json');
  private getHelpDocsHistoryPath = () => path.join(process.cwd(), 'data', 'help-docs-history.json');

  private async ensureDataDir() {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
  }

  async getHelpDocs() {
    if (!fs.existsSync(this.getHelpDocsPath())) return this.defaultHelpDocs;
    try {
      const raw = await fs.promises.readFile(this.getHelpDocsPath(), 'utf8');
      const p = JSON.parse(raw);
      return {
        usuarios: typeof p?.usuarios === 'string' ? p.usuarios : this.defaultHelpDocs.usuarios,
        grupos: typeof p?.grupos === 'string' ? p.grupos : this.defaultHelpDocs.grupos,
        apiMetodos: typeof p?.apiMetodos === 'string' ? p.apiMetodos : this.defaultHelpDocs.apiMetodos,
      };
    } catch { return this.defaultHelpDocs; }
  }

  async saveHelpDocs(docs: { usuarios?: string; grupos?: string; apiMetodos?: string }, updatedBy = 'admin') {
    const current = await this.getHelpDocs();
    const normalized = {
      usuarios: typeof docs?.usuarios === 'string' ? docs.usuarios : current.usuarios,
      grupos: typeof docs?.grupos === 'string' ? docs.grupos : current.grupos,
      apiMetodos: typeof docs?.apiMetodos === 'string' ? docs.apiMetodos : current.apiMetodos,
    };
    await this.ensureDataDir();
    await fs.promises.writeFile(this.getHelpDocsPath(), JSON.stringify(normalized, null, 2), 'utf8');

    const history = await this.getHelpDocsHistory();
    await fs.promises.writeFile(
      this.getHelpDocsHistoryPath(),
      JSON.stringify([{ timestamp: new Date().toISOString(), updatedBy, summary: `u:${normalized.usuarios.length} g:${normalized.grupos.length}` }, ...history].slice(0, 50), null, 2),
      'utf8',
    );
    return { message: 'Help docs actualitzats' };
  }

  async getHelpDocsHistory() {
    if (!fs.existsSync(this.getHelpDocsHistoryPath())) return [];
    try { return (JSON.parse(await fs.promises.readFile(this.getHelpDocsHistoryPath(), 'utf8')) as Array<unknown>).slice(0, 50); }
    catch { return []; }
  }

  async exportHelpDocsMarkdown() {
    const docs = await this.getHelpDocs();
    return { markdown: `# Guia API\n\n## Usuaris\n${docs.usuarios}\n\n## Grups\n${docs.grupos}\n\n## Metodes\n${docs.apiMetodos}\n\nGenerat: ${new Date().toISOString()}` };
  }
}
