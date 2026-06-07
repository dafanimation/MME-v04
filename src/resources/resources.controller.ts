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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';
import { Resource } from './resource.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async findAll(@Query() query: FindResourcesQueryDto) {
    return this.resourceService.findAll(query);
  }

  @Post()
  async create(
    @Body() createResourceDto: CreateResourceDto,
  ): Promise<Resource> {
    return this.resourceService.create(createResourceDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    return this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    return this.resourceService.remove(id);
  }

  // ========== ENDPOINTS ADDICIONALS ==========
  @Get('stats/all')
  async getStats() {
    const totalResources = await this.resourceService.count();
    const availableResources =
      await this.resourceService.countByStatus('available');
    const assignedResources =
      await this.resourceService.countByStatus('assigned');
    return {
      total_resources: totalResources,
      available_resources: availableResources,
      assigned_resources: assignedResources,
      total_students: 0,
    };
  }

  @Get('assignments/current')
  async getCurrentAssignments() {
    return this.resourceService.getCurrentAssignments();
  }

  @Get('user/:userId')
  async getUserResources(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Resource[]> {
    return this.resourceService.findUserResources(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('release')
  async releaseResource(
    @Req() req: { user: { userId: number; role: string } },
    @Body('resource_code') resourceCode: string,
  ) {
    return this.resourceService.releaseResource(resourceCode, req.user);
  }

  @Post('assign')
  async assignResource(
    @Body() body: {
      resource_code: string;
      user_email: string;
      location?: {
        x: number;
        z: number;
        type?: string;
        tipo?: string;
        label?: string;
        mesaId?: number;
        num?: number;
        estId?: string;
        room?: string;
        placement?: string;
        anchor?: string;
        renderAnchorIndex?: number | null;
      };
    },
  ) {
    return this.resourceService.assignResource(body.resource_code, body.user_email, body.location);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyResources(@Req() req: { user: { userId: number } }): Promise<Resource[]> {
    return this.resourceService.findUserResources(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('self-assign')
  async selfAssignResource(
    @Req() req: { user: { userId: number; email: string } },
    @Body() body: {
      resource_code: string;
      location?: {
        x: number;
        z: number;
        type?: string;
        tipo?: string;
        label?: string;
        mesaId?: number;
        num?: number;
        estId?: string;
        room?: string;
        placement?: string;
        anchor?: string;
        renderAnchorIndex?: number | null;
      };
    },
  ) {
    return this.resourceService.selfAssignResource(
      body.resource_code,
      req.user.userId,
      req.user.email,
      body.location,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Resource> {
    return this.resourceService.findOne(id);
  }
}
