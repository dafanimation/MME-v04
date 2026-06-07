// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { WhitelistEntry } from './whitelist.model';
import { User } from '../users/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([WhitelistEntry, User])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
