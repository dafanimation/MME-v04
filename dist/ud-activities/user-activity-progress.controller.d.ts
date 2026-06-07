import { UserActivityProgressService } from './user-activity-progress.service';
export declare class UserActivityProgressController {
    private readonly progressService;
    constructor(progressService: UserActivityProgressService);
    getMyProgress(activityId: number, req: {
        user: {
            userId: number;
        };
    }): Promise<import("./user-activity-progress.model").UserActivityProgress | null>;
    getAllProgress(activityId: number): Promise<import("./user-activity-progress.model").UserActivityProgress[]>;
    updateMyProgress(activityId: number, req: {
        user: {
            userId: number;
        };
    }, body: {
        completedSteps?: string[];
        completedCheckmarks?: string[];
        progressPercent?: number;
        resourcesUsed?: number[];
    }): Promise<import("./user-activity-progress.model").UserActivityProgress>;
    submit(activityId: number, req: {
        user: {
            userId: number;
        };
    }): Promise<import("./user-activity-progress.model").UserActivityProgress>;
    validate(activityId: number, userId: number, req: {
        user: {
            email: string;
        };
    }, grade: number): Promise<import("./user-activity-progress.model").UserActivityProgress>;
    returnActivity(activityId: number, userId: number, reason: string): Promise<import("./user-activity-progress.model").UserActivityProgress>;
}
export declare class ActivityReportsController {
    private readonly progressService;
    constructor(progressService: UserActivityProgressService);
    getActivityReport(userId?: string, activityId?: string, status?: string): Promise<{
        total: number;
        byStatus: Record<string, number>;
        avgGrade: number | null;
        items: import("./user-activity-progress.model").UserActivityProgress[];
    }>;
    getStudentReport(userId: number): Promise<import("./user-activity-progress.model").UserActivityProgress[]>;
}
