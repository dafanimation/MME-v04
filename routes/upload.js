// routes/upload.js
// Ruta para manejar la subida de imágenes de actividades, incluyendo recorte y compresión.
// Requiere autenticación y validación de archivos.
// El frontend envía la imagen ya recortada y comprimida, pero esta ruta también valida y procesa por seguridad.
// Requiere: npm install express multer sharp
// NOTA: Asegúrate de tener una carpeta 'uploads/activity-images' con permisos de escritura en el servidor.
// POST /api/upload/activity-image
// Body form-data: { image: File, udCode: string, stepId: string }
// Respuesta: { url: string } (URL de la imagen subida)
// REVISAR: Este código asume que el middleware de autenticación decodifica el token y adjunta el usuario a req.user. Ajusta según tu implementación de auth. Además, la ruta devuelve una URL relativa; asegúrate de servir los archivos estáticos correctamente en tu servidor Express para que sean accesibles.
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage(); // Guardamos en memoria para procesar con sharp
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Formato no soportado'), false);
  },
}).single('image');

router.post('/activity-image', authenticate, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });

    const { udCode, stepId } = req.body;
    const userId = req.user.id; // Asumiendo que el token decodificado tiene `id`
    if (!udCode || !stepId) {
      return res.status(400).json({ error: 'Faltan udCode o stepId' });
    }

    // Crear carpeta por usuario/ud/step
    const baseDir = path.join(__dirname, '../../uploads/activity-images', String(userId), udCode, stepId);
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `${timestamp}_cropped_compressed.jpg`;
    const filePath = path.join(baseDir, filename);

    // Procesar la imagen con sharp (redimensionar si es necesario, optimizar)
    await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filePath);

    const fileUrl = `/uploads/activity-images/${userId}/${udCode}/${stepId}/${filename}`;
    res.json({ url: fileUrl });
  });
});

module.exports = router;