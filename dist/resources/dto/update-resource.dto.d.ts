type ResourceLocationDto = {
    x: number;
    z: number;
    type?: string;
    tipo?: string;
    label?: string;
    mesaId?: number;
    num?: number;
    estId?: string;
    room?: string;
    placement?: string;
    anchor?: string;
    renderAnchorIndex?: number | null;
};
export declare class UpdateResourceDto {
    code?: string;
    name?: string;
    os?: string;
    cpu?: string;
    ghz?: string;
    bits?: number;
    motherboard?: string;
    ram?: string;
    storage?: string;
    qrCode?: string;
    extras?: string;
    notes?: string;
    status?: string;
    type?: string;
    driveLink?: string;
    userId?: number | null;
    location?: ResourceLocationDto | null;
}
export {};
