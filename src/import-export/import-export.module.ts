import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportExportService } from './import-export.service';
import { ImportExportController } from './import-export.controller';
import { Resource } from '../resources/resource.model';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  controllers: [ImportExportController],
  providers: [ImportExportService],
})
export class ImportExportModule {}
