// ============================================================
// ARCHIVO: src/components/menus/MenuFlotante.jsx
// DESCRIPCIÓN: Menú flotante arrastrable para insertar elementos
// FUNCIÓN: Proporciona botones para añadir elementos al mapa 3D
// ============================================================
// IMPORTACIONES
// React y hooks
// Componente de menú flotante
// ============================================================
// Pages y servicios
// ============================================================

import React, { useState, useRef, useEffect } from 'react';

export const MenuFlotante = ({
  onClose,
  onInsertarPC,
  onInsertarUsuario,
  onInsertarEstanteria,
  onInsertarArmario,
  onInsertarPantalla,
  onInsertarHDD,
  onInsertarPortatil,
  onInsertarImpresora,
  onInsertarCuboActividad,
  onInsertarPiramideProyecto,
  usuariosCount = 0,
  maxUsuarios = 12,
  pcsCount = 0,
  maxPcs = 6,
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Configuración de botones
  const buttons = [
    { label: `🖥️ PC (${pcsCount}/${maxPcs})`, onClick: onInsertarPC, color: '#00ff88' },
    { label: `👤 Usuario (${usuariosCount}/${maxUsuarios})`, onClick: onInsertarUsuario, color: '#00d4ff' },
    { label: '🖵 Pantalla', onClick: onInsertarPantalla, color: '#2d8cff' },
    { label: '💾 Disco Duro', onClick: onInsertarHDD, color: '#ff4444' },
    { label: '💻 Portátil', onClick: onInsertarPortatil, color: '#a855f7' },
    { label: '🖨️ Impresora', onClick: onInsertarImpresora, color: '#9ba3ad' },
    { label: '📚 Estantería', onClick: onInsertarEstanteria, color: '#4dabff' },
    { label: '🗄️ Armario', onClick: onInsertarArmario, color: '#3a7abf' },
    { label: '📘 Actividad UD', onClick: onInsertarCuboActividad, color: '#ffaa44' },
    { label: '🏗️ Proyecto', onClick: onInsertarPiramideProyecto, color: '#00d4ff' },
  ];

  // Manejo de arrastre
  const handleMouseDown = (e) => {
    if (e.target.closest('.menu-header')) {
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!onClose) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10000,
        background: '#0a0a1a',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid #00d4ff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        width: '220px',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Cabecera arrastrable */}
      <div
        className="menu-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 12px',
          borderBottom: '1px solid rgba(0,212,255,0.3)',
          cursor: 'grab',
          userSelect: 'none',
          background: 'rgba(0,212,255,0.1)',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <span style={{ color: '#00d4ff', fontSize: '13px', fontWeight: 'bold' }}>
          📋 Insertar elemento
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff6666',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 4px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Cuerpo con botones */}
      <div style={{ padding: '8px', maxHeight: '400px', overflowY: 'auto' }}>
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            style={{
              width: '100%',
              padding: '8px 12px',
              margin: '4px 0',
              background: 'transparent',
              border: `1px solid ${btn.color}`,
              borderRadius: '6px',
              color: btn.color,
              cursor: 'pointer',
              fontSize: '12px',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${btn.color}20`;
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuFlotante;