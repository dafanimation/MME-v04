import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    stream(req: {
        user: {
            userId: number;
        };
    }): Observable<MessageEvent>;
}
