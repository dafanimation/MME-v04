// ============================================================
// ARCHIVO: src/components/menus/MenuElemento.jsx
// DESCRIPCIÓN: Menú contextual para editar/eliminar elementos
// FUNCIÓN: Muestra formulario de edición según el tipo de elemento
// ============================================================

import React from 'react';

export const MenuElemento = ({
  elemento,
  tipo,
  onUpdate,
  onDelete,
  position = { x: 100, y: 100 },
}) => {
  if (!elemento) return null;

  const getFields = () => {
    switch (tipo) {
      case 'pc':
        return (
          <>
            <label style={labelStyle}>Código:</label>
            <input
              type="text"
              value={elemento.code || ''}
              onChange={(e) => onUpdate?.({ code: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>Estado:</label>
            <select
              value={elemento.status || 'available'}
              onChange={(e) => onUpdate?.({ status: e.target.value })}
              style={inputStyle}
            >
              <option value="available">🟢 Disponible</option>
              <option value="assigned">🔵 Asignado</option>
              <option value="occupied">🔴 Ocupado</option>
              <option value="maintenance">🟡 Mantenimiento</option>
            </select>
          </>
        );
      case 'usuario':
        return (
          <>
            <label style={labelStyle}>Nombre:</label>
            <input
              type="text"
              value={elemento.name || ''}
              onChange={(e) => onUpdate?.({ name: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              value={elemento.email || ''}
              onChange={(e) => onUpdate?.({ email: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>
              <input
                type="checkbox"
                checked={elemento.isActive !== false}
                onChange={(e) => onUpdate?.({ isActive: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Activo
            </label>
          </>
        );
      case 'actividad':
        return (
          <>
            <label style={labelStyle}>Título:</label>
            <input
              type="text"
              value={elemento.title || ''}
              onChange={(e) => onUpdate?.({ title: e.target.value })}
              style={inputStyle}
            />
            <label style={labelStyle}>Progreso (%):</label>
            <input
              type="range"
              min="0"
              max="100"
              value={elemento.progreso || 0}
              onChange={(e) => onUpdate?.({ progreso: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <span style={{ color: '#ffaa44', fontSize: '11px', textAlign: 'center' }}>
              {elemento.progreso || 0}%
            </span>
          </>
        );
      default:
        return (
          <>
            <label style={labelStyle}>Nombre:</label>
            <input
              type="text"
              value={elemento.label || elemento.name || ''}
              onChange={(e) => onUpdate?.({ label: e.target.value, name: e.target.value })}
              style={inputStyle}
            />
          </>
        );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10000,
        background: '#0a0a1a',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: `1px solid #00d4ff`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        width: '240px',
        padding: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(0,212,255,0.3)',
          paddingBottom: '8px',
        }}
      >
        <span style={{ color: '#00d4ff', fontSize: '13px', fontWeight: 'bold' }}>
          ✏️ Editar {tipo}
        </span>
        <button
          onClick={onDelete}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff6666',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0 4px',
          }}
        >
          🗑️
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {getFields()}
      </div>
    </div>
  );
};

const labelStyle = {
  color: '#aaa',
  fontSize: '10px',
  marginTop: '4px',
};

const inputStyle = {
  background: '#1a1a2e',
  border: '1px solid #00d4ff',
  borderRadius: '4px',
  color: 'white',
  padding: '6px 8px',
  fontSize: '11px',
  width: '100%',
};

export default MenuElemento;