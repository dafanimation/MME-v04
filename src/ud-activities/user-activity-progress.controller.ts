import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserActivityProgressService } from './user-activity-progress.service';

@Controller('ud-activities/:activityId/progress')
@UseGuards(JwtAuthGuard)
export class UserActivityProgressController {
  constructor(private readonly progressService: UserActivityProgressService) {}

  // GET my progress on this activity
  @Get('me')
  async getMyProgress(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Req() req: { user: { userId: number } },
  ) {
    return this.progressService.getProgress(activityId, req.user.userId);
  }

  // GET all students' progress (Admin/BIP only)
  @UseGuards(RolesGuard)
  @Roles('admin', 'bip')
  @Get()
  async getAllProgress(@Param('activityId', ParseIntPipe) activityId: number) {
    return this.progressService.getAllProgressForActivity(activityId);
  }

  // POST start/update my progress
  @Post('me')
  async updateMyProgress(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Req() req: { user: { userId: number } },
    @Body() body: {
      completedSteps?: string[];
      completedCheckmarks?: string[];
      progressPercent?: number;
      resourcesUsed?: number[];
    },
  ) {
    return this.progressService.startOrUpdate(activityId, req.user.userId, body);
  }

  // POST submit
  @Post('me/submit')
  async submit(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Req() req: { user: { userId: number } },
  ) {
    return this.progressService.submit(activityId, req.user.userId);
  }

  // POST validate (Admin/BIP)
  @UseGuards(RolesGuard)
  @Roles('admin', 'bip')
  @Post(':userId/validate')
  async validate(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: { user: { email: string } },
    @Body('grade') grade: number,
  ) {
    return this.progressService.validate(activityId, userId, req.user.email, grade);
  }

  // POST return (Admin/BIP)
  @UseGuards(RolesGuard)
  @Roles('admin', 'bip')
  @Post(':userId/return')
  async returnActivity(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('reason') reason: string,
  ) {
    return this.progressService.returnActivity(activityId, userId, reason);
  }
}

// Separate controller for admin reports
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'bip')
export class ActivityReportsController {
  constructor(private readonly progressService: UserActivityProgressService) {}

  @Get('activities')
  async getActivityReport(
    @Query('userId') userId?: string,
    @Query('activityId') activityId?: string,
    @Query('status') status?: string,
  ) {
    return this.progressService.getReport({
      userId: userId ? parseInt(userId) : undefined,
      activityId: activityId ? parseInt(activityId) : undefined,
      status,
    });
  }

  @Get('student/:userId')
  async getStudentReport(@Param('userId', ParseIntPipe) userId: number) {
    return this.progressService.getMyProgress(userId);
  }
}
