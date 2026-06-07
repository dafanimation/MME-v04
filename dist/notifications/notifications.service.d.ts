import { Observable } from 'rxjs';
export interface AppNotification {
    id: string;
    userId: number;
    type: 'assignment' | 'release' | 'new_activity' | 'deadline' | 'status_change' | 'bip_upgrade';
    title: string;
    message: string;
    data?: object;
    createdAt: string;
}
export declare class NotificationsService {
    private readonly events$;
    push(notification: Omit<AppNotification, 'id' | 'createdAt'>): void;
    streamForUser(userId: number): Observable<MessageEvent>;
    pushToMany(userIds: number[], base: Omit<AppNotification, 'id' | 'createdAt' | 'userId'>): void;
}
