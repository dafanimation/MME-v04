import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UdActivitiesController } from './ud-activities.controller';
import { UdActivitiesService } from './ud-activities.service';
import { UdActivity } from './ud-activity.model';
import { UserActivityProgress } from './user-activity-progress.model';
import { UserActivityProgressController, ActivityReportsController } from './user-activity-progress.controller';
import { UserActivityProgressService } from './user-activity-progress.service';
import { ProjectTask } from '../projects/project-task.model';
import { History } from '../history/history.model';
import { User } from '../users/user.model';
import { Resource } from '../resources/resource.model';

@Module({
  imports: [TypeOrmModule.forFeature([UdActivity, UserActivityProgress, ProjectTask, History, User, Resource])],
  controllers: [UdActivitiesController, UserActivityProgressController, ActivityReportsController],
  providers: [UdActivitiesService, UserActivityProgressService],
  exports: [UdActivitiesService, UserActivityProgressService],
})
export class UdActivitiesModule {}
