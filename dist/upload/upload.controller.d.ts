import { UploadService } from './upload.service';
import type { Request } from 'express';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadActivityImage(file: Express.Multer.File, udCode: string, stepId: string, req: Request): Promise<{
        url: string;
    }>;
}
