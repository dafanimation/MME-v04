import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StorageLocationsService } from './storage-locations.service';

@Controller('storage-locations')
@UseGuards(JwtAuthGuard)
export class StorageLocationsController {
  constructor(private readonly storageLocationsService: StorageLocationsService) {}

  @Get()
  async findAll(
    @Query('room') room?: string,
    @Query('type') type?: string,
    @Query('zone') zone?: string,
    @Query('active') active?: string,
  ) {
    return this.storageLocationsService.findAll({ room, type, zone, active });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storageLocationsService.findOne(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      type?: string;
      zone?: string;
      row?: string;
      module?: string;
      label?: string;
      room?: string;
      capacity?: number;
      active?: boolean;
      coordinates?: { x: number; z: number; y?: number };
    },
  ) {
    return this.storageLocationsService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      type?: string;
      zone?: string;
      row?: string;
      module?: string;
      label?: string;
      room?: string;
      capacity?: number;
      active?: boolean;
      coordinates?: { x: number; z: number; y?: number };
    },
  ) {
    return this.storageLocationsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.storageLocationsService.remove(id);
  }
}
