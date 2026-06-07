import { Repository } from 'typeorm';
import { UserActivityProgress } from './user-activity-progress.model';
export declare class UserActivityProgressService {
    private repo;
    constructor(repo: Repository<UserActivityProgress>);
    getProgress(activityId: number, userId: number): Promise<UserActivityProgress | null>;
    getAllProgressForActivity(activityId: number): Promise<UserActivityProgress[]>;
    getMyProgress(userId: number): Promise<UserActivityProgress[]>;
    startOrUpdate(activityId: number, userId: number, update: {
        completedSteps?: string[];
        completedCheckmarks?: string[];
        progressPercent?: number;
        resourcesUsed?: number[];
    }): Promise<UserActivityProgress>;
    submit(activityId: number, userId: number): Promise<UserActivityProgress>;
    validate(activityId: number, userId: number, validatorEmail: string, grade: number): Promise<UserActivityProgress>;
    returnActivity(activityId: number, userId: number, reason: string): Promise<UserActivityProgress>;
    getReport(filters: {
        userId?: number;
        activityId?: number;
        status?: string;
    }): Promise<{
        total: number;
        byStatus: Record<string, number>;
        avgGrade: number | null;
        items: UserActivityProgress[];
    }>;
}
