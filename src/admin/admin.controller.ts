// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Whitelist ────────────────────────────────────────────────────────────

  @Roles('admin')
  @Get('whitelist')
  async getWhitelist(
    @Query('year') academicYear?: string,
    @Query('module') module?: string,
  ) {
    return this.adminService.getWhitelist({ academicYear, module });
  }

  @Roles('admin')
  @Post('whitelist')
  async addToWhitelist(
    @Req() req: { user: { email: string } },
    @Body() body: { email: string; academicYear?: string; module?: string },
  ) {
    return this.adminService.addToWhitelist(body.email, {
      academicYear: body.academicYear,
      module: body.module,
      approvedBy: req.user.email,
    });
  }

  @Roles('admin')
  @Delete('whitelist/:email')
  async removeFromWhitelist(@Param('email') email: string) {
    return this.adminService.removeFromWhitelist(email);
  }

  @Roles('admin')
  @Post('whitelist/close-year')
  async closeYear(@Body('academicYear') academicYear: string) {
    return this.adminService.closeAcademicYear(academicYear);
  }

  // ─── Help Docs ────────────────────────────────────────────────────────────

  @Get('help-docs')
  async getHelpDocs() {
    return this.adminService.getHelpDocs();
  }

  @Roles('admin', 'bip')
  @Post('help-docs')
  async saveHelpDocs(
    @Req() req: { user?: { email?: string } },
    @Body() docs: { usuarios?: string; grupos?: string; apiMetodos?: string },
  ) {
    return this.adminService.saveHelpDocs(docs, req?.user?.email || 'admin');
  }

  @Get('help-docs/history')
  async getHelpDocsHistory() {
    return this.adminService.getHelpDocsHistory();
  }

  @Get('help-docs/export')
  async exportHelpDocsMarkdown() {
    return this.adminService.exportHelpDocsMarkdown();
  }
}
