import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './project.model';
import { ProjectTask } from './project-task.model';
import { History } from '../history/history.model';
import { User } from '../users/user.model';
import { Resource } from '../resources/resource.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectTask, History, User, Resource]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
