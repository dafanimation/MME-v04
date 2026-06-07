// ============================================================
// ARCHIVO: src/components/ui/QREscanner.jsx
// DESCRIPCIÓN: Lector de códigos QR para escanear recursos
// FUNCIÓN: Usa react-qr-scanner para leer QR y buscar recurso
// PROPS:
//   - onRecursoEncontrado: callback cuando se encuentra un recurso
//   - onError: callback opcional para errores
// ============================================================
// ⚠️ NOTA: Este componente requiere instalar react-qr-scanner
// npm install react-qr-scanner
// ============================================================

import React from 'react'
import QrScanner from 'react-qr-scanner'

/**
 * Componente lector de QR
 * @param {Function} onRecursoEncontrado - Callback al encontrar recurso
 * @param {Function} onError - Callback opcional para errores
 */
export const QREscanner = ({ onRecursoEncontrado, onError }) => {
  
  const handleScan = async (data) => {
    if (data && data.text) {
      // Aquí se debería llamar a la API para buscar el recurso por QR
      // const recurso = await api.getResourceByQR(data.text)
      if (onRecursoEncontrado) {
        onRecursoEncontrado(data.text)
      }
    }
  }

  const handleError = (err) => {
    console.error('Error escaneando QR:', err)
    if (onError) onError(err)
  }

  const previewStyle = {
    height: 240,
    width: 320,
  }

  return (
    <div>
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '8px' }}>
        📷 Enfoca el código QR del recurso
      </p>
    </div>
  )
}