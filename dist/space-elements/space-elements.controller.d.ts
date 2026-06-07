import { SpaceElementsService } from './space-elements.service';
export declare class SpaceElementsController {
    private readonly service;
    constructor(service: SpaceElementsService);
    findAll(room?: string, activityCode?: string, projectName?: string, mesaNum?: string): Promise<import("./space-element.model").SpaceElement[]>;
    upsert(req: {
        user: {
            email?: string;
        };
    }, body: {
        room: string;
        elementUid: string;
        template?: string;
        name?: string;
        shape?: string;
        dims?: number[];
        x?: number;
        z?: number;
        yOffset?: number;
        rotationY?: number;
        borderColor?: string;
        fillColor?: string;
        fillOpacity?: number;
        assignment?: {
            userEmail?: string;
            mesaNum?: string;
            activityCode?: string;
            projectName?: string;
            screenLink?: string;
            updatedAt?: string;
        } | null;
    }): Promise<import("./space-element.model").SpaceElement>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
