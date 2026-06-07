import { Repository } from 'typeorm';
import { StorageLocation } from './storage-location.model';
type StorageLocationInput = {
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
};
export declare class StorageLocationsService {
    private readonly repo;
    constructor(repo: Repository<StorageLocation>);
    findAll(filters: {
        room?: string;
        type?: string;
        zone?: string;
        active?: string;
    }): Promise<StorageLocation[]>;
    findOne(id: number): Promise<StorageLocation>;
    create(payload: StorageLocationInput): Promise<StorageLocation>;
    update(id: number, payload: StorageLocationInput): Promise<StorageLocation>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
