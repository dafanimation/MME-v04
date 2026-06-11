// ============================================================
// ARCHIVO: src/pages/Dashboard.jsx
// DESCRIPCIÓN: Panel principal que integra el mapa 3D
// FUNCIÓN: Muestra estadísticas y el mapa interactivo
// RUTAS: /dashboard
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getUser, isAdmin, logout } from '../services/auth';
import { api } from '../services/api';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import MenuAdmin from '../components/menus/MenuAdmin'
import { Mapa3D } from '../components/3d/core/Mapa3D';
import { AlumnoWorkflowPanel } from '../components/panels/AlumnoWorkflowPanel';
import ElementoPreviewPanel from '../components/menus/ElementoPreviewPanel';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = getUser();
  const userIsAdmin = isAdmin();
  const timeLeft = useSessionTimeout(userIsAdmin);
  
  const room = searchParams.get('room') || 'AULA';
  const activity = searchParams.get('activity') || '';
  const view = searchParams.get('view') || (searchParams.get('compact') === '1' ? 'compact' : (room === 'SALATEST' && activity === 'UD01' ? 'compact' : 'joint'));
  const section = searchParams.get('section') || 'map';
  
  const [stats, setStats] = useState({ total_resources: 0, available_resources: 0, assigned_resources: 0 });
  const [myResources, setMyResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [mode, setMode] = useState('all');
  
  useEffect(() => {
    loadStats();
    loadMyResources();
    loadAvailableResources();
  }, []);
  
  const loadStats = async () => {
    const data = await api.getStats();
    if (data) setStats(data);
  };
  
  const loadMyResources = async () => {
    if (!user?.id) return;
    const data = await api.getUserResources(user.id);
    if (data) setMyResources(Array.isArray(data) ? data : data.data || []);
  };
  
  const loadAvailableResources = async () => {
    const data = await api.getResources({ status: 'available', limit: 50 });
    if (data) setAvailableResources(Array.isArray(data) ? data : data.data || []);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewChange = (newView) => {
    const params = new URLSearchParams(searchParams);
    params.delete('compact');
    params.set('view', newView);
    navigate(`/dashboard?${params.toString()}`);
  };
  
  const handleLocateResource = (code, location) => {
    if (location?.x && location?.z) {
      // Centrar cámara en la posición del recurso
      setSelectedResource({ code, location });
    }
  };
  
  const userGroup = String(user?.group || user?.grup || '').toUpperCase();
  const userRole = String(user?.role || user?.rol || '').toLowerCase();
  const isBiP = userGroup === 'BIP' || userRole === 'bip';
  const myMesa = myResources.find(r => r.type === 'PC')?.location?.mesaId || 'No asignada';
  
  return (
    <div className="dashboard">
      <MenuAdmin />
      
      <div className="dashboard-container">
        {/* Panel izquierdo - información y controles */}
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">{userIsAdmin ? '👑' : (isBiP ? '🤖' : '👤')}</div>
            <div className="user-details">
              <h3>{user?.name || user?.nombre || user?.email?.split('@')[0]}</h3>
              <p>{user?.email}</p>
              <span className={`user-badge ${userIsAdmin ? 'admin' : (isBiP ? 'bip' : 'user')}`}>
                {userIsAdmin ? 'Admin Master' : (isBiP ? 'Usuari BIP' : 'Usuari MME')}
              </span>
            </div>
          </div>
          
          <div className="stats-panel">
            <div className="stat-item">
              <span className="stat-icon">📦</span>
              <span className="stat-value">{stats.total_resources}</span>
              <span className="stat-label">Total recursos</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">✅</span>
              <span className="stat-value">{stats.available_resources}</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔴</span>
              <span className="stat-value">{stats.assigned_resources}</span>
              <span className="stat-label">Assignats</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">👤</span>
              <span className="stat-value">{myResources.length}</span>
              <span className="stat-label">Els meus</span>
            </div>
          </div>
          
          {/* Workflow para alumnos */}
          {!userIsAdmin && (
            <AlumnoWorkflowPanel
              user={user}
              mode={mode}
              onSelectMode={setMode}
              onSelectAvailable={() => {}}
              onClearStatusFilter={() => {}}
              onLocateResource={handleLocateResource}
              myResourcesCount={myResources.length}
              myAssignedResources={myResources}
              driveResourcesCount={0}
              availableResourcesCount={availableResources.length}
              myMesa={myMesa}
            />
          )}
          
          <div className="session-info">
            <div className={`timer ${timeLeft <= 15 ? 'warn' : ''}`}>
              ⏱️ {timeLeft}s
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Sortir
            </button>
          </div>
        </div>
        
        {/* Panel derecho - mapa 3D */}
        <div className="dashboard-map" style={{ display: 'flex', flexDirection: (room === 'SALATEST' && activity === 'UD01' && view === 'compact') ? 'row' : 'column', gap: (room === 'SALATEST' && activity === 'UD01' && view === 'compact') ? '16px' : '0', minHeight: '0', width: '100%', height: '100%' }}>
          <div style={{ minWidth: 0, minHeight: 0, height: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="map-header">
              <h2>🗺️ {room === 'SALATEST' ? 'Sala Test (Editor)' : (room === 'SALAPRU' ? 'Sala PRU' : 'Aula Taller')}</h2>
              <div className="view-controls">
                <button className={`view-btn ${view === 'joint' ? 'active' : ''}`} onClick={() => handleViewChange('joint')}>Vista conjunta</button>
                <button className={`view-btn ${view === 'compact' ? 'active' : ''}`} onClick={() => handleViewChange('compact')}>Compacte</button>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
              <Mapa3D
                room={room}
                recursos={mode === 'mine' ? myResources : (mode === 'available' ? availableResources : [])}
                usuarios={[]}
                selectedResource={selectedResource}
                currentUser={user}
              />
            </div>
          </div>

          {(room === 'SALATEST' && activity === 'UD01' && view === 'compact') && (
            <div style={{ minWidth: 0, minHeight: 0, height: '100%', width: '320px', display: 'flex', flexDirection: 'column' }}>
              <ElementoPreviewPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
