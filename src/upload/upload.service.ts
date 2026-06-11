// backend/src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

// Importación CommonJS para evitar problemas con ES modules
import sharp from 'sharp';

@Injectable()
export class UploadService {
  async saveImage(file: Express.Multer.File, userId: number, udCode: string, stepId: string): Promise<string> {
    // Crear directorio de usuario/ud/paso
    const baseDir = path.join(process.cwd(), 'uploads', 'activity-images', String(userId), udCode, stepId);
    await fs.mkdir(baseDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `${timestamp}_cropped_compressed.jpg`;
    const filePath = path.join(baseDir, filename);

    // Procesar la imagen con sharp
    try {
      await sharp(file.buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filePath);
    } catch (err) {
      console.error('Sharp error:', err);
      throw new Error('No se pudo procesar la imagen');
    }

    // Devolver la URL pública (el frontend accederá a través del proxy o ruta estática)
    const url = `/uploads/activity-images/${userId}/${udCode}/${stepId}/${filename}`;
    return url;
  }
}