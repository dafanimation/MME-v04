import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageLocation } from './storage-location.model';
import { StorageLocationsController } from './storage-locations.controller';
import { StorageLocationsService } from './storage-locations.service';

@Module({
  imports: [TypeOrmModule.forFeature([StorageLocation])],
  controllers: [StorageLocationsController],
  providers: [StorageLocationsService],
  exports: [StorageLocationsService],
})
export class StorageLocationsModule {}
