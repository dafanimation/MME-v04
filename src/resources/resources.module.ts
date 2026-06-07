// src/resources/resources.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesController } from './resources.controller';
import { ResourceService } from './resource.service';
import { Resource } from './resource.model';
import { User } from '../users/user.model';  // 👈 AFEGIR

@Module({
  imports: [TypeOrmModule.forFeature([Resource, User])],  // 👈 AFEGIR User
  controllers: [ResourcesController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourcesModule {}