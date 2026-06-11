// src/pages/CaptureView.jsx
// src/pages/CaptureView.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CaptureView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Error accediendo a la cámara:', err);
        setError('No se pudo acceder a la cámara. Verifica permisos.');
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const savePhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `captura_${Date.now()}.jpg`;
      link.click();
    }
  };

  const close = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate(-1); // volver atrás
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <span>📷 Cámara Web</span>
          <button onClick={close} style={styles.closeBtn}>✕</button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.preview}>
          {!capturedImage ? (
            <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
          ) : (
            <img src={capturedImage} alt="Captura" style={styles.image} />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div style={styles.buttons}>
          {!capturedImage ? (
            <button onClick={capturePhoto} style={styles.captureBtn}>📸 Tomar foto</button>
          ) : (
            <>
              <button onClick={retakePhoto} style={styles.retakeBtn}>⟳ Volver a tomar</button>
              <button onClick={savePhoto} style={styles.saveBtn}>💾 Guardar foto</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(4px)',
  },
  panel: {
    background: '#0a0a1a',
    border: '2px solid #00d4ff',
    borderRadius: '16px',
    padding: '20px',
    minWidth: '480px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    color: '#00d4ff',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#ff6666',
    fontSize: '20px',
    cursor: 'pointer',
  },
  error: {
    color: '#ff8888',
    background: 'rgba(255,0,0,0.1)',
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '12px',
    textAlign: 'center',
  },
  preview: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  video: {
    width: '480px',
    borderRadius: '8px',
    border: '1px solid #00d4ff',
  },
  image: {
    width: '480px',
    borderRadius: '8px',
    border: '2px solid #00ff88',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  captureBtn: {
    padding: '8px 20px',
    background: 'rgba(0,212,255,0.2)',
    border: '1px solid #00d4ff',
    borderRadius: '8px',
    color: '#00d4ff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  retakeBtn: {
    padding: '8px 20px',
    background: 'rgba(255,170,0,0.2)',
    border: '1px solid #ffaa44',
    borderRadius: '8px',
    color: '#ffaa44',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '8px 20px',
    background: 'rgba(0,255,136,0.2)',
    border: '1px solid #00ff88',
    borderRadius: '8px',
    color: '#00ff88',
    cursor: 'pointer',
  },
};

export default CaptureView;