import { UdActivitiesService } from './ud-activities.service';
export declare class UdActivitiesController {
    private readonly udActivitiesService;
    constructor(udActivitiesService: UdActivitiesService);
    findAll(udCode?: string, status?: string, projectId?: string): Promise<import("./ud-activity.model").UdActivity[]>;
    findOne(id: number): Promise<import("./ud-activity.model").UdActivity>;
    create(req: {
        user: {
            email?: string;
        };
    }, body: {
        udCode?: string;
        title?: string;
        date?: string;
        statement?: string;
        requiredEquipment?: string[];
        assignmentMode?: string;
        resourceTypes?: string[];
        links?: string[];
        images?: string[];
        projectId?: number;
        status?: string;
    }): Promise<import("./ud-activity.model").UdActivity>;
    update(req: {
        user: {
            email?: string;
        };
    }, id: number, body: {
        udCode?: string;
        title?: string;
        date?: string;
        statement?: string;
        requiredEquipment?: string[];
        assignmentMode?: string;
        resourceTypes?: string[];
        links?: string[];
        images?: string[];
        projectId?: number;
        status?: string;
    }): Promise<import("./ud-activity.model").UdActivity>;
    remove(req: {
        user: {
            email?: string;
        };
    }, id: number): Promise<{
        message: string;
    }>;
    uploadImage(req: {
        user: {
            email?: string;
        };
    }, id: number, file?: {
        filename?: string;
    }): Promise<{
        message: string;
        fileUrl?: undefined;
        activity?: undefined;
    } | {
        fileUrl: string;
        activity: import("./ud-activity.model").UdActivity;
        message?: undefined;
    }>;
    linkTask(req: {
        user: {
            email?: string;
        };
    }, id: number, taskId: number): Promise<import("../projects/project-task.model").ProjectTask>;
    unlinkTask(req: {
        user: {
            email?: string;
        };
    }, taskId: number): Promise<import("../projects/project-task.model").ProjectTask>;
}
