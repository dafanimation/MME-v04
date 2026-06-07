import { Injectable, BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../resources/resource.model';

@Injectable()
export class ImportExportService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async importExcel(
    fileBuffer: Buffer,
  ): Promise<{ message: string; imported: number }> {
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
      if (!workbook.SheetNames.includes(sheetName)) continue;

      const worksheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet, {
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

  private parseSheet(sheetName: string, data: any[]): Partial<Resource>[] {
    const resources: Partial<Resource>[] = [];
    let headers: string[] = [];
    let isFirstRow = true;

    for (const row of data) {
      if (!row || row.length === 0) continue;

      const firstCell = String(row[0] || '').toLowerCase();
      if (
        firstCell.includes('nº') ||
        firstCell.includes('id') ||
        firstCell === 'nº ordenador'
      ) {
        headers = row.map((cell) =>
          String(cell || '')
            .toLowerCase()
            .trim(),
        );
        isFirstRow = false;
        continue;
      }

      if (isFirstRow || !row[0] || String(row[0]).startsWith('nº')) continue;

      const resource = this.mapRowToResource(sheetName, headers, row);
      if (resource && resource.code) {
        resources.push(resource);
      }
    }

    return resources;
  }

  private mapRowToResource(
    sheetName: string,
    headers: string[],
    row: any[],
  ): Partial<Resource> | null {
    const getValue = (key: string): string => {
      const index = headers.findIndex((h) => h.includes(key));
      return index >= 0 ? String(row[index] || '').trim() : '';
    };

    let code = getValue('ordenador');
    if (!code) code = getValue('id');
    if (!code && sheetName.includes('MBs')) code = getValue('placa');
    if (!code) return null;

    const statusMap: Record<string, string> = {
      '👍💪😀': 'available',
      '👍👌💪😀': 'available',
      '👎💀👀': 'occupied',
      '❓​🤷🏼‍♂️​😕🤷🏽‍♀️​': 'maintenance',
    };
    const rawStatus = getValue('estado');
    const status = statusMap[rawStatus] || 'available';

    let type = 'PC';
    if (sheetName.includes('Portatil')) type = 'Portàtil';
    if (sheetName.includes('MiniPortatil')) type = 'MiniPortàtil';
    if (sheetName.includes('Impresora')) type = 'Impressora';
    if (sheetName.includes('MBs')) type = 'Placa Base';

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
}
