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
  Res,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findProjects(
    @Query('status') status?: string,
    @Query('title') title?: string,
  ) {
    return this.projectsService.findProjects({ status, title });
  }

  @Get(':id')
  async findProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findProject(id);
  }

  @Get(':id/export/pdf')
  async exportProjectPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const pdf = await this.projectsService.exportProjectPdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="project-${id}.pdf"`,
      'Cache-Control': 'no-store',
    });
    return new StreamableFile(pdf);
  }

  @Post()
  async createProject(
    @Req() req: { user: { email?: string } },
    @Body()
    body: {
      title: string;
      description?: string;
      status?: string;
      dossierLinks?: string[];
      attachments?: string[];
      participants?: string[];
      mesaNum?: string;
    },
  ) {
    return this.projectsService.createProject(body, req.user?.email);
  }

  @Patch(':id')
  async updateProject(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      title?: string;
      description?: string;
      status?: string;
      dossierLinks?: string[];
      attachments?: string[];
      participants?: string[];
      mesaNum?: string;
    },
  ) {
    return this.projectsService.updateProject(id, body, req.user?.email);
  }

  @Delete(':id')
  async removeProject(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.removeProject(id, req.user?.email);
  }

  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/projects',
        filename: (_req, file, cb) => {
          const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `project-${suffix}${extname(file.originalname || '')}`);
        },
      }),
    }),
  )
  async uploadProjectImage(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: { filename?: string },
  ) {
    if (!file?.filename) {
      return { message: 'No file uploaded' };
    }
    const fileUrl = `/uploads/projects/${file.filename}`;
    const project = await this.projectsService.addProjectAttachment(
      id,
      fileUrl,
      req.user?.email,
    );
    return { fileUrl, project };
  }

  @Get(':id/tasks')
  async findTasks(@Param('id', ParseIntPipe) projectId: number) {
    return this.projectsService.findTasks(projectId);
  }

  @Post(':id/tasks')
  async createTask(
    @Req() req: { user: { email?: string } },
    @Param('id', ParseIntPipe) projectId: number,
    @Body()
    body: {
      udActivityId?: number;
      activityCode?: string;
      ownerUserEmail?: string;
      mesaNum?: string;
      resourceCode?: string;
      status?: string;
      notes?: string;
    },
  ) {
    return this.projectsService.createTask(projectId, body, req.user?.email);
  }

  @Patch('tasks/:taskId')
  async updateTask(
    @Req() req: { user: { email?: string } },
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body()
    body: {
      udActivityId?: number;
      activityCode?: string;
      ownerUserEmail?: string;
      mesaNum?: string;
      resourceCode?: string;
      status?: string;
      notes?: string;
    },
  ) {
    return this.projectsService.updateTask(taskId, body, req.user?.email);
  }

  @Delete('tasks/:taskId')
  async removeTask(
    @Req() req: { user: { email?: string } },
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.projectsService.removeTask(taskId, req.user?.email);
  }
}
