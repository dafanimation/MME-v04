// src/pages/AdminActividades.jsx
// ============================================================
// ARCHIVO: src/pages/AdminActividades.jsx
// DESCRIPCIÓN: Página de administración de actividades
// VERSIÓN: 1.0 - Implementación inicial
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuAdmin from '../components/menus/MenuAdmin';
import { getActividades, saveActividades, createActividad, updateActividad, deleteActividad } from '../services/actividadesService';

const AdminActividades = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    udCode: 'UD01',
    codigoCorto: '',
    title: '',
    descripcion: '',
    timeline: { startDate: '', dueDate: '' },
    requiredResources: [],
    evaluationMethods: [],
  });
  const [mensaje, setMensaje] = useState('');

  const cargarActividades = () => {
    setActividades(getActividades());
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  const abrirModal = (actividad = null) => {
    if (actividad) {
      setEditando(actividad.id);
      setFormData({
        udCode: actividad.udCode,
        codigoCorto: actividad.codigoCorto,
        title: actividad.title,
        descripcion: actividad.descripcion,
        timeline: actividad.timeline || { startDate: '', dueDate: '' },
        requiredResources: actividad.requiredResources || [],
        evaluationMethods: actividad.evaluationMethods || [],
      });
    } else {
      setEditando(null);
      setFormData({
        udCode: 'UD01',
        codigoCorto: '',
        title: '',
        descripcion: '',
        timeline: { startDate: '', dueDate: '' },
        requiredResources: [],
        evaluationMethods: [],
      });
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate' || name === 'dueDate') {
      setFormData({
        ...formData,
        timeline: { ...formData.timeline, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData({ ...formData, [field]: value.split(',').map((s) => s.trim()) });
  };

  const guardarActividad = () => {
    if (!formData.codigoCorto || !formData.title) {
      setMensaje('❌ Código y título son obligatorios');
      return;
    }
    if (editando) {
      updateActividad(editando, formData);
      setMensaje('✅ Actividad actualizada');
    } else {
      createActividad(formData);
      setMensaje('✅ Actividad creada');
    }
    cerrarModal();
    cargarActividades();
    setTimeout(() => setMensaje(''), 3000);
  };

  const eliminarActividad = (id) => {
    if (window.confirm('¿Eliminar esta actividad?')) {
      deleteActividad(id);
      cargarActividades();
      setMensaje('🗑️ Actividad eliminada');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div>
      <MenuAdmin />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#00d4ff' }}>📋 Gestión de Actividades</h2>
          <button
            onClick={() => abrirModal()}
            style={{ padding: '8px 16px', background: '#00d4ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Nueva Actividad
          </button>
        </div>

        {mensaje && (
          <div style={{ marginBottom: '12px', padding: '8px', background: '#1e2a2a', color: '#7fd4ff', borderRadius: '6px' }}>
            {mensaje}
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #00d4ff' }}>UD</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #00d4ff' }}>Código</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #00d4ff' }}>Título</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #00d4ff' }}>Descripción</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #00d4ff' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((act) => (
              <tr key={act.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{act.udCode}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{act.codigoCorto}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{act.title}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{act.descripcion}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>
                  <button onClick={() => abrirModal(act)} style={{ marginRight: '8px', background: '#2c3e50', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>✏️</button>
                  <button onClick={() => eliminarActividad(act.id)} style={{ background: '#7f2a2a', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', color: '#fff' }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal flotante */}
        {modalOpen && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h3 style={{ color: '#00d4ff', marginTop: 0 }}>{editando ? 'Editar Actividad' : 'Nueva Actividad'}</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <label>UD: 
                  <select name="udCode" value={formData.udCode} onChange={handleChange} style={inputStyle}>
                    <option>UD01</option><option>UD02</option><option>UD03</option>
                    <option>UD04</option><option>UD05</option><option>UD06</option>
                  </select>
                </label>
                <label>Código corto (ej. UD01-A01): 
                  <input type="text" name="codigoCorto" value={formData.codigoCorto} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Título: 
                  <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Descripción: 
                  <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Fecha inicio: 
                  <input type="date" name="startDate" value={formData.timeline.startDate} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Fecha fin: 
                  <input type="date" name="dueDate" value={formData.timeline.dueDate} onChange={handleChange} style={inputStyle} />
                </label>
                <label>Recursos requeridos (separados por coma): 
                  <input type="text" value={formData.requiredResources.join(', ')} onChange={(e) => handleArrayChange('requiredResources', e.target.value)} style={inputStyle} />
                </label>
                <label>Métodos evaluación (separados por coma): 
                  <input type="text" value={formData.evaluationMethods.join(', ')} onChange={(e) => handleArrayChange('evaluationMethods', e.target.value)} style={inputStyle} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={cerrarModal} style={modalButtonStyle('#aaa', 'transparent')}>Cancelar</button>
                <button onClick={guardarActividad} style={modalButtonStyle('#00d4ff', 'rgba(0,212,255,0.2)')}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
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
  maxHeight: '80vh',
  overflowY: 'auto',
};

const inputStyle = {
  width: '100%',
  padding: '6px',
  marginTop: '4px',
  background: '#1a1a2e',
  border: '1px solid #00d4ff',
  borderRadius: '6px',
  color: '#fff',
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

export default AdminActividades;