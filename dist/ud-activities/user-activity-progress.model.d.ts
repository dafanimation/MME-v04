export declare class UserActivityProgress {
    id: number;
    userId: number;
    activityId: number;
    status: 'pending' | 'in_progress' | 'submitted' | 'validated' | 'returned';
    progressPercent: number;
    completedSteps: string[];
    completedCheckmarks: string[];
    grade: number;
    submittedAt: string;
    validatedBy: string;
    returnedReason: string;
    resourcesUsed: number[];
    createdAt: string;
    updatedAt: string;
}
