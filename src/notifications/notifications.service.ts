import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface AppNotification {
  id: string;
  userId: number;
  type: 'assignment' | 'release' | 'new_activity' | 'deadline' | 'status_change' | 'bip_upgrade';
  title: string;
  message: string;
  data?: object;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  private readonly events$ = new Subject<AppNotification>();

  push(notification: Omit<AppNotification, 'id' | 'createdAt'>): void {
    this.events$.next({
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    });
  }

  streamForUser(userId: number): Observable<MessageEvent> {
    return this.events$.pipe(
      filter((n) => n.userId === userId),
      map(
        (n) =>
          ({ data: JSON.stringify(n) }) as MessageEvent,
      ),
    );
  }

  // Broadcast to multiple users (e.g., all in a group)
  pushToMany(userIds: number[], base: Omit<AppNotification, 'id' | 'createdAt' | 'userId'>): void {
    for (const userId of userIds) {
      this.push({ ...base, userId });
    }
  }
}
