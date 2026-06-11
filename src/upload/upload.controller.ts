// src/upload/upload.controller.ts
// Controlador para manejar la subida de imágenes de actividades
// Define una ruta POST /upload/activity-image que recibe una imagen, la procesa y la guarda en el servidor, devolviendo su URL
// Requiere autenticación JWT y validación de tipo y tamaño de archivo
// Utiliza el servicio UploadService para procesar y almacenar la imagen
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Body, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('activity-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new Error('Formato no soportado'), false);
    },
  }))
  async uploadActivityImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('udCode') udCode: string,
    @Body('stepId') stepId: string,
    @Req() req: Request,
  ) {
    // Extraer userId de diferentes posibles nombres de propiedad
    const userId = (req.user as any)?.userId ?? (req.user as any)?.sub ?? (req.user as any)?.id;
    if (!userId) {
      console.error('req.user recibido:', req.user);
      throw new Error('Usuario no autenticado: token sin userId');
    }
    if (!file) throw new Error('No se recibió imagen');
    if (!udCode || !stepId) throw new Error('Faltan udCode o stepId');

    const url = await this.uploadService.saveImage(file, Number(userId), udCode, stepId);
    return { url };
  }
}