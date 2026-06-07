import {
  Body,
  Controller,
  Delete,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UdActivitiesService } from './ud-activities.service';

@Controller('ud-activities')
@UseGuards(JwtAuthGuard)
export class UdActivitiesController {
  constructor(private readonly udActivitiesService: UdActivitiesService) {}

  @Get()
  async findAll(
    @Query('udCode') udCode?: string,
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.udActivitiesService.findAll({ udCode, status, projectId });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.udActivitiesService.findOne(id);
  }

  @Post()
  async create(
    @Req() req: { user: { email?: string } },
    @Body()
    body: {
      udCode?: string;
      title?: string;
      date?: string;
      statement?: string;
      requiredEquipment?: string[];
      assignmentMode?: string;
      resourceTypes?: string[];
      links?: string[];
      images?: string[];
      projectId?: number;
      status?: string;
    },
  ) {
    return this.udActivitiesService.create(body, req.user?.email);
  }

  @Patch(':id')
  async update(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      udCode?: string;
      title?: string;
      date?: string;
      statement?: string;
      requiredEquipment?: string[];
      assignmentMode?: string;
      resourceTypes?: string[];
      links?: string[];
      images?: string[];
      projectId?: number;
      status?: string;
    },
  ) {
    return this.udActivitiesService.update(id, body, req.user?.email);
  }

  @Delete(':id')
  async remove(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.udActivitiesService.remove(id, req.user?.email);
  }

  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/ud-activities',
        filename: (_req, file, cb) => {
          const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `ud-activity-${suffix}${extname(file.originalname || '')}`);
        },
      }),
    }),
  )
  async uploadImage(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: { filename?: string },
  ) {
    if (!file?.filename) {
      return { message: 'No file uploaded' };
    }
    const fileUrl = `/uploads/ud-activities/${file.filename}`;
    const activity = await this.udActivitiesService.addImage(id, fileUrl, req.user?.email);
    return { fileUrl, activity };
  }

  @Post(':id/link-task/:taskId')
  async linkTask(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.udActivitiesService.linkTask(id, taskId, req.user?.email);
  }

  @Post('unlink-task/:taskId')
  async unlinkTask(
    @Req() req: { user: { email?: string } },
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.udActivitiesService.unlinkTask(taskId, req.user?.email);
  }
}
