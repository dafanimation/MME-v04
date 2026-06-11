// src/components/menus/MenuCajaHerramientas.jsx
// ============================================================
// ARCHIVO: src/components/menus/MenuCajaHerramientas.jsx
// DESCRIPCIÓN: Componente de menú para gestionar la caja de herramientas
// FUNCIONALIDAD: Permite agregar, eliminar y actualizar herramientas en la caja
// RUTAS: N/A (se muestra como overlay en la vista de la sala)
// ============================================================
import React, { useState, useRef, useEffect } from 'react';

export const MenuCajaHerramientas = ({
  herramientas,
  onAgregar,
  onEliminar,
  onActualizarCantidad,
  position = { x: 100, y: 100 },
  onClose,
}) => {
  const [menuPosition, setMenuPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const [nuevaHerramienta, setNuevaHerramienta] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('otro');
  const dragOffset = useRef({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('lista');

  const handleMouseDown = (e) => {
    if (e.target.closest('.menu-header')) {
      setIsDragging(true);
      dragOffset.current = { x: e.clientX - menuPosition.x, y: e.clientY - menuPosition.y };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setMenuPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
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

  const handleAgregar = () => {
    if (!nuevaHerramienta.trim()) return;
    onAgregar(nuevaHerramienta, nuevoTipo, 1);
    setNuevaHerramienta('');
  };

  const tiposHerramientas = [
    { value: 'golpe', label: '🔨 Martillo / Mazo' },
    { value: 'giro', label: '🪛 Destornillador' },
    { value: 'ajuste', label: '🔧 Llave / Alicate' },
    { value: 'medida', label: '📏 Medición' },
    { value: 'motor', label: '🔌 Eléctrica' },
    { value: 'otro', label: '📦 Otra' },
  ];

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        zIndex: 10000,
        background: '#0a0a1a',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid #ffaa44',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        width: '340px',
        maxHeight: '80vh',
        overflowY: 'auto',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Cabecera */}
      <div className="menu-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        borderBottom: '1px solid rgba(255,170,0,0.3)',
        cursor: 'grab',
        background: 'rgba(255,170,0,0.1)',
        borderRadius: '12px 12px 0 0',
      }}>
        <span style={{ color: '#ffaa44', fontSize: '13px', fontWeight: 'bold' }}>🔧 Gestionar caja</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ff6666', cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: '4px', padding: '8px 12px 0', borderBottom: '1px solid rgba(255,170,0,0.2)' }}>
        <button onClick={() => setActiveTab('lista')} style={{ padding: '6px 12px', background: activeTab === 'lista' ? 'rgba(255,170,0,0.15)' : 'transparent', border: 'none', borderBottom: activeTab === 'lista' ? '2px solid #ffaa44' : '2px solid transparent', color: activeTab === 'lista' ? '#ffaa44' : '#aaa', cursor: 'pointer', fontSize: '11px' }}>📋 Herramientas ({herramientas.length})</button>
        <button onClick={() => setActiveTab('agregar')} style={{ padding: '6px 12px', background: activeTab === 'agregar' ? 'rgba(255,170,0,0.15)' : 'transparent', border: 'none', borderBottom: activeTab === 'agregar' ? '2px solid #ffaa44' : '2px solid transparent', color: activeTab === 'agregar' ? '#ffaa44' : '#aaa', cursor: 'pointer', fontSize: '11px' }}>➕ Añadir</button>
      </div>

      <div style={{ padding: '12px' }}>
        {/* Lista de herramientas */}
        {activeTab === 'lista' && (
          <>
            {herramientas.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6fa8c8', fontSize: '11px', padding: '20px' }}>No hay herramientas en la caja</div>
            ) : (
              herramientas.map(herramienta => (
                <div key={herramienta.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', marginBottom: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#ffaa44' }}>{herramienta.nombre}</span>
                    <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '8px' }}>{herramienta.tipo}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => onActualizarCantidad(herramienta.id, -1)} style={quantityBtnStyle}>-</button>
                    <span style={{ fontSize: '12px', minWidth: '30px', textAlign: 'center' }}>{herramienta.cantidad || 1}</span>
                    <button onClick={() => onActualizarCantidad(herramienta.id, 1)} style={quantityBtnStyle}>+</button>
                    <button onClick={() => onEliminar(herramienta.id)} style={deleteBtnStyle}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Formulario para añadir herramienta */}
        {activeTab === 'agregar' && (
          <div>
            <input
              type="text"
              value={nuevaHerramienta}
              onChange={(e) => setNuevaHerramienta(e.target.value)}
              placeholder="Nombre de la herramienta"
              style={inputStyle}
              onKeyPress={(e) => e.key === 'Enter' && handleAgregar()}
            />
            <select value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)} style={{ ...inputStyle, marginTop: '8px' }}>
              {tiposHerramientas.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button onClick={handleAgregar} style={{ width: '100%', marginTop: '12px', padding: '8px', background: 'linear-gradient(135deg, #ffaa44, #cc8800)', border: 'none', borderRadius: '6px', color: '#1a1a2e', cursor: 'pointer', fontWeight: 'bold' }}>➕ Añadir herramienta</button>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  background: '#1a1a2e',
  border: '1px solid #ffaa44',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '11px',
};

const quantityBtnStyle = {
  width: '24px',
  height: '24px',
  background: 'rgba(255,170,0,0.2)',
  border: '1px solid #ffaa44',
  borderRadius: '4px',
  color: '#ffaa44',
  cursor: 'pointer',
};

const deleteBtnStyle = {
  width: '24px',
  height: '24px',
  background: 'rgba(255,68,68,0.15)',
  border: '1px solid #ff4444',
  borderRadius: '4px',
  color: '#ff4444',
  cursor: 'pointer',
  fontSize: '10px',
};