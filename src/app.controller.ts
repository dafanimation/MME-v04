// src/app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'servidor-recursos-v03',
      timestamp: new Date().toISOString(),
    };
  }

  // Opcional: redirigir a login.html
  @Get('home')
  getHome(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'login.html'));
  }
}
