// src/components/activities/ActividadModal.jsx
// ============================================================
// ARCHIVO: src/components/activities/ActividadModal.jsx
// DESCRIPCIÓN: Modal para mostrar detalles de una actividad y permitir su edición (solo admin)
// RUTAS: Se utiliza en la vista de actividades para mostrar información detallada al hacer click en un cubo de actividad
// VERSION: 1.0 - Implementación inicial
// ============================================================
// REVISIONES:
// 1.0 - Implementación inicial con visualización de detalles, edición para admins, y gestión de progreso de pasos.

// ============================================================
// src/components/activities/ActividadModal.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ActividadModal = ({ actividad, onClose, currentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedAct, setEditedAct] = useState({ ...actividad });
  const [pasosCompletados, setPasosCompletados] = useState({});
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = currentUser?.role === 'admin_master' || currentUser?.role === 'admin';

  // Cargar el progreso actual desde la API
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await api.getMyActivityProgress(actividad.id);
        setProgressData(progress);
        // Inicializar pasos completados según los datos de progreso
        if (progress.steps) {
          const completed = {};
          progress.steps.forEach(step => {
            if (step.completed) completed[step.stepId] = true;
          });
          setPasosCompletados(completed);
        }
      } catch (error) {
        console.error('Error cargando progreso:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [actividad.id]);

  const handleCheck = (stepId) => {
    setPasosCompletados(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const calcularProgreso = () => {
    const total = actividad.steps?.length || 0;
    const completados = Object.values(pasosCompletados).filter(v => v).length;
    return total ? Math.round((completados / total) * 100) : 0;
  };

  const guardarProgreso = async () => {
    const progreso = calcularProgreso();
    const stepsData = actividad.steps?.map(step => ({
      stepId: step.id,
      completed: !!pasosCompletados[step.id],
      evidence: '',
      value: null,
    })) || [];
    try {
      await api.updateMyActivityProgress(actividad.id, {
        progress: progreso,
        steps: stepsData,
      });
      alert('Progreso guardado correctamente');
      onClose();
    } catch (error) {
      alert('Error al guardar el progreso: ' + error.message);
    }
  };

  const enviarActividad = async () => {
    try {
      await api.submitActivityProgress(actividad.id);
      alert('Actividad enviada para revisión');
      onClose();
    } catch (error) {
      alert('Error al enviar: ' + error.message);
    }
  };

  const guardarEdicion = async () => {
    // Solo administrador puede editar la actividad (requiere endpoint de actualización de actividad)
    // Aquí simulamos, pero idealmente sería api.updateUdActivity(actividad.id, editedAct)
    alert('Función de edición de actividad aún no implementada en el backend');
    setEditMode(false);
  };

  if (loading) return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>Cargando...</div>
    </div>
  );

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#00d4ff', margin: 0 }}>
            {editMode ? '✏️ Editar Actividad' : `📘 ${actividad.codigoCorto || actividad.udCode} - ${actividad.title}`}
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        {editMode ? (
          <div>
            <label>UD: <input value={editedAct.udCode} onChange={(e) => setEditedAct({...editedAct, udCode: e.target.value})} style={inputStyle} /></label>
            <label>Código corto: <input value={editedAct.codigoCorto || ''} onChange={(e) => setEditedAct({...editedAct, codigoCorto: e.target.value})} style={inputStyle} /></label>
            <label>Título: <input value={editedAct.title} onChange={(e) => setEditedAct({...editedAct, title: e.target.value})} style={inputStyle} /></label>
            <label>Descripción: <textarea value={editedAct.descripcion || ''} onChange={(e) => setEditedAct({...editedAct, descripcion: e.target.value})} rows="3" style={inputStyle} /></label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setEditMode(false)} style={modalButtonStyle('#aaa', 'transparent')}>Cancelar</button>
              <button onClick={guardarEdicion} style={modalButtonStyle('#00d4ff', 'rgba(0,212,255,0.2)')}>Guardar cambios</button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Descripción:</strong> {actividad.descripcion || 'Sin descripción'}</p>
            <p><strong>Fechas:</strong> {actividad.timeline?.startDate || '-'} → {actividad.timeline?.dueDate || '-'}</p>
            <p><strong>Recursos:</strong> {actividad.requiredResources?.join(', ') || '-'}</p>
            <p><strong>Evaluación:</strong> {actividad.evaluationMethods?.join(', ') || '-'}</p>
            <p><strong>Tu progreso:</strong> {progressData?.progress || 0}%</p>

            {actividad.steps && actividad.steps.length > 0 && (
              <div>
                <strong>Pasos:</strong>
                {actividad.steps.map((paso) => (
                  <div key={paso.id} style={{ marginLeft: '16px', marginTop: '8px' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!pasosCompletados[paso.id]}
                        onChange={() => handleCheck(paso.id)}
                      />
                      {paso.title}
                    </label>
                  </div>
                ))}
                <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                  <button onClick={guardarProgreso} style={modalButtonStyle('#4caf50', 'rgba(76,175,80,0.2)')}>Guardar progreso</button>
                  <button onClick={enviarActividad} style={modalButtonStyle('#ffaa44', 'rgba(255,170,0,0.2)')}>Enviar para revisión</button>
                </div>
              </div>
            )}

            {isAdmin && (
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={() => setEditMode(true)} style={modalButtonStyle('#ffaa44', 'rgba(255,170,0,0.2)')}>Editar actividad</button>
              </div>
            )}
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
  zIndex: 10000,
};

const modalContentStyle = {
  background: '#0a0a1a',
  padding: '20px',
  borderRadius: '16px',
  width: '500px',
  maxHeight: '80vh',
  overflowY: 'auto',
  border: '1px solid #00d4ff',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#ff6666',
  fontSize: '20px',
  cursor: 'pointer',
};

const inputStyle = {
  width: '100%',
  padding: '6px',
  marginTop: '4px',
  marginBottom: '12px',
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

export default ActividadModal;