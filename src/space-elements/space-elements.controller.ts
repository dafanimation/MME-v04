import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SpaceElementsService } from './space-elements.service';

@Controller('space-elements')
@UseGuards(JwtAuthGuard)
export class SpaceElementsController {
  constructor(private readonly service: SpaceElementsService) {}

  @Get()
  async findAll(
    @Query('room') room?: string,
    @Query('activityCode') activityCode?: string,
    @Query('projectName') projectName?: string,
    @Query('mesaNum') mesaNum?: string,
  ) {
    return this.service.findAll({ room, activityCode, projectName, mesaNum });
  }

  @Post()
  async upsert(
    @Req() req: { user: { email?: string } },
    @Body()
    body: {
      room: string;
      elementUid: string;
      template?: string;
      name?: string;
      shape?: string;
      dims?: number[];
      x?: number;
      z?: number;
      yOffset?: number;
      rotationY?: number;
      borderColor?: string;
      fillColor?: string;
      fillOpacity?: number;
      assignment?: {
        userEmail?: string;
        mesaNum?: string;
        activityCode?: string;
        projectName?: string;
        screenLink?: string;
        updatedAt?: string;
      } | null;
    },
  ) {
    return this.service.upsert(body, req.user?.email);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
