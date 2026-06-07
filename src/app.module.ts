import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';
import { CategoriesModule } from './categories/categories.module';
import { HistoryModule } from './history/history.module';
import { ImportExportModule } from './import-export/import-export.module';
import { AdminModule } from './admin/admin.module';
import { SpaceElementsModule } from './space-elements/space-elements.module';
import { ProjectsModule } from './projects/projects.module';
import { UdActivitiesModule } from './ud-activities/ud-activities.module';
import { StorageLocationsModule } from './storage-locations/storage-locations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.model';
import { Resource } from './resources/resource.model';
import { Category } from './categories/category.model';
import { History } from './history/history.model';
import { SpaceElement } from './space-elements/space-element.model';
import { Project } from './projects/project.model';
import { ProjectTask } from './projects/project-task.model';
import { UdActivity } from './ud-activities/ud-activity.model';
import { UserActivityProgress } from './ud-activities/user-activity-progress.model';
import { StorageLocation } from './storage-locations/storage-location.model';
import { WhitelistEntry } from './admin/whitelist.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [
        User,
        Resource,
        Category,
        History,
        SpaceElement,
        Project,
        ProjectTask,
        UdActivity,
        UserActivityProgress,
        StorageLocation,
        WhitelistEntry,
      ],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    ResourcesModule,
    CategoriesModule,
    HistoryModule,
    ImportExportModule,
    AdminModule,
    SpaceElementsModule,
    ProjectsModule,
    UdActivitiesModule,
    StorageLocationsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
