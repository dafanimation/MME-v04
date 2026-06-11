// /frontendsrc/components/activities/ImageCropUploader.jsx
// Componente para subir imágenes con recorte integrado usando react-easy-crop
// Permite al usuario seleccionar una imagen, recortarla en un área cuadrada (4:3) y luego subirla al backend.
// El componente maneja validación de tipo y tamaño de archivo, muestra una vista previa y gestiona el estado de carga y errores.
// Requiere: npm install react-easy-crop browser-image-compression
// El backend debe tener una ruta para recibir la imagen (ver routes/upload.js) que valide, procese y almacene la imagen, devolviendo su URL.
import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropUtils'; // (ver más abajo)
import imageCompression from 'browser-image-compression';
import  api  from '../../services/api';

const MAX_WIDTH = 1024;
const JPEG_QUALITY = 0.85;

export const ImageCropUploader = ({ value, onChange, disabled = false, udCode, stepId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validar tipo y tamaño (máx 5 MB antes de recortar)
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Formato no soportado. Usa JPEG, PNG, GIF o WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado grande (máx 5 MB).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      // 1. Recortar la imagen
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      // 2. Comprimir y redimensionar
      const compressedFile = await imageCompression(croppedImageBlob, {
        maxWidthOrHeight: MAX_WIDTH,
        initialQuality: JPEG_QUALITY,
        fileType: 'image/jpeg',
      });
      // 3. Subir al backend
      const formData = new FormData();
      formData.append('image', compressedFile, `evidence_${Date.now()}.jpg`);
      formData.append('udCode', udCode);
      formData.append('stepId', stepId);
      const { url } = await api.uploadActivityImage(formData);
      setModalOpen(false);
      onChange(url);
    } catch (err) {
      setError('Error al procesar/subir la imagen: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        disabled={disabled}
        ref={fileInputRef}
        style={{ fontSize: '11px' }}
      />
      {error && <div style={{ color: '#ff9a9a', fontSize: '10px', marginTop: '4px' }}>{error}</div>}
      {value && (
        <div style={{ marginTop: '6px' }}>
          <img src={value} alt="Evidencia" style={{ maxWidth: '200px', maxHeight: '120px', borderRadius: '6px', border: '1px solid #4a6a8a' }} />
        </div>
      )}

      {modalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h4 style={{ margin: '0 0 12px', color: '#00d4ff' }}>Recorta la imagen</h4>
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)} style={modalButtonStyle('#ffaa44', 'transparent')}>Cancelar</button>
              <button onClick={handleCropSave} disabled={uploading} style={modalButtonStyle('#00d4ff', 'rgba(0,212,255,0.2)')}>
                {uploading ? 'Subiendo...' : 'Aceptar y subir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const modalContentStyle = {
  background: '#0a0a1a',
  padding: '20px',
  borderRadius: '16px',
  width: '500px',
  border: '1px solid #00d4ff',
};

const modalButtonStyle = (color, bg) => ({
  padding: '6px 16px',
  borderRadius: '6px',
  border: `1px solid ${color}`,
  background: bg,
  color: color,
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
});
console.log('ImageCropUploader loaded');


export default ImageCropUploader;