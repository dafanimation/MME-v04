import { StorageLocationsService } from './storage-locations.service';
export declare class StorageLocationsController {
    private readonly storageLocationsService;
    constructor(storageLocationsService: StorageLocationsService);
    findAll(room?: string, type?: string, zone?: string, active?: string): Promise<import("./storage-location.model").StorageLocation[]>;
    findOne(id: number): Promise<import("./storage-location.model").StorageLocation>;
    create(body: {
        type?: string;
        zone?: string;
        row?: string;
        module?: string;
        label?: string;
        room?: string;
        capacity?: number;
        active?: boolean;
        coordinates?: {
            x: number;
            z: number;
            y?: number;
        };
    }): Promise<import("./storage-location.model").StorageLocation>;
    update(id: number, body: {
        type?: string;
        zone?: string;
        row?: string;
        module?: string;
        label?: string;
        room?: string;
        capacity?: number;
        active?: boolean;
        coordinates?: {
            x: number;
            z: number;
            y?: number;
        };
    }): Promise<import("./storage-location.model").StorageLocation>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
