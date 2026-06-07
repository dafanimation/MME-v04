export declare class StorageLocation {
    id: number;
    type: string;
    zone: string;
    row: string | null;
    module: string | null;
    label: string | null;
    room: string | null;
    capacity: number;
    active: boolean;
    coordinates: {
        x: number;
        z: number;
        y?: number;
    } | null;
    createdAt: string;
    updatedAt: string;
}
