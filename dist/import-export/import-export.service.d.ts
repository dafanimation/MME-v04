import { Repository } from 'typeorm';
import { Resource } from '../resources/resource.model';
export declare class ImportExportService {
    private resourceRepository;
    constructor(resourceRepository: Repository<Resource>);
    importExcel(fileBuffer: Buffer): Promise<{
        message: string;
        imported: number;
    }>;
    private parseSheet;
    private mapRowToResource;
}
