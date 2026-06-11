export declare class UploadService {
    saveImage(file: Express.Multer.File, userId: number, udCode: string, stepId: string): Promise<string>;
}
