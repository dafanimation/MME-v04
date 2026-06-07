import { Repository } from 'typeorm';
import { SpaceElement, SpaceElementAssignment } from './space-element.model';
type UpsertSpaceElementInput = {
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
    assignment?: SpaceElementAssignment | null;
};
export declare class SpaceElementsService {
    private readonly repo;
    constructor(repo: Repository<SpaceElement>);
    findAll(filters: {
        room?: string;
        activityCode?: string;
        projectName?: string;
        mesaNum?: string;
    }): Promise<SpaceElement[]>;
    upsert(payload: UpsertSpaceElementInput, actorEmail?: string): Promise<SpaceElement>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
