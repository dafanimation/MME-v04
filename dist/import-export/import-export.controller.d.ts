import { ImportExportService } from './import-export.service';
export declare class ImportExportController {
    private readonly importExportService;
    constructor(importExportService: ImportExportService);
    importExcel(file: Express.Multer.File): Promise<{
        message: string;
        imported: number;
    }>;
}
