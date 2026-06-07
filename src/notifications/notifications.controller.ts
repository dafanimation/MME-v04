import { Controller, Get, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('stream')
  stream(@Req() req: { user: { userId: number } }): Observable<MessageEvent> {
    return this.notificationsService.streamForUser(req.user.userId);
  }
}
