export type SpaceElementAssignment = {
    userEmail?: string;
    mesaNum?: string;
    activityCode?: string;
    projectName?: string;
    screenLink?: string;
    updatedAt?: string;
};
export declare class SpaceElement {
    id: number;
    room: string;
    elementUid: string;
    template: string;
    name: string;
    shape: string;
    dims: number[] | null;
    x: number;
    z: number;
    yOffset: number;
    rotationY: number;
    borderColor: string;
    fillColor: string;
    fillOpacity: number;
    assignment: SpaceElementAssignment | null;
    createdByEmail: string | null;
    createdAt: string;
    updatedAt: string;
}
