// src/services/actividadesService.js
// ============================================================
// ARCHIVO: src/services/actividadesService.js
// DESCRIPCIÓN: Servicio para gestión de actividades (CRUD + progreso)
// RUTAS: N/A (servicio interno para manejo de datos de actividades)
// VERSION: 1.0 - Implementación inicial con almacenamiento en localStorage
// ============================================================
// REVISIONES:
// 1.0 - Implementación inicial con funciones para crear, leer, actualizar, eliminar actividades, y gestionar progreso de usuario.
// ============================================================

const STORAGE_KEY = 'mme_actividades_custom';
const PROGRESS_KEY = 'mme_actividades_progress';

// Actividades de ejemplo iniciales
const DEFAULT_ACTIVIDADES = [
  {
    id: 'act1',
    udCode: 'UD01',
    codigoCorto: 'UD01-A01',
    title: 'Caja de herramientas',
    descripcion: 'Identificar y usar herramientas básicas',
    pasos: [],
    evaluationMethods: [],
    requiredResources: [],
    timeline: { startDate: '2026-06-01', dueDate: '2026-06-15' },
    version: 1,
  },
  {
    id: 'act2',
    udCode: 'UD01',
    codigoCorto: 'UD01-A02',
    title: 'Montaje PC',
    descripcion: 'Ensamblar componentes de un ordenador',
    pasos: [],
    evaluationMethods: [],
    requiredResources: [],
    timeline: { startDate: '2026-06-10', dueDate: '2026-06-25' },
    version: 1,
  },
  {
    id: 'act3',
    udCode: 'UD02',
    codigoCorto: 'UD02-A01',
    title: 'Soldadura básica',
    descripcion: 'Aprender técnicas de soldadura',
    pasos: [],
    evaluationMethods: [],
    requiredResources: [],
    timeline: { startDate: '2026-06-05', dueDate: '2026-06-20' },
    version: 1,
  },
];

// Cargar actividades desde localStorage
export const getActividades = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVIDADES));
  return [...DEFAULT_ACTIVIDADES];
};

// Guardar todas las actividades
export const saveActividades = (actividades) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actividades));
};

// Obtener una actividad por ID
export const getActividadById = (id) => {
  const actividades = getActividades();
  return actividades.find((a) => a.id === id);
};

// Crear nueva actividad
export const createActividad = (actividad) => {
  const actividades = getActividades();
  const newId = Date.now().toString();
  const nueva = { ...actividad, id: newId, version: 1 };
  actividades.push(nueva);
  saveActividades(actividades);
  return nueva;
};

// Actualizar actividad existente
export const updateActividad = (id, data) => {
  const actividades = getActividades();
  const index = actividades.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Actividad no encontrada');
  actividades[index] = { ...actividades[index], ...data, version: (actividades[index].version || 0) + 1 };
  saveActividades(actividades);
  return actividades[index];
};

// Eliminar actividad
export const deleteActividad = (id) => {
  let actividades = getActividades();
  actividades = actividades.filter((a) => a.id !== id);
  saveActividades(actividades);
};

// Progreso de usuario (simulado, integrable con API)
export const getProgresoUsuario = (userId, actividadId) => {
  const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  return allProgress[`${userId}_${actividadId}`] || { estado: 'pendiente', progreso: 0 };
};

export const setProgresoUsuario = (userId, actividadId, data) => {
  const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  allProgress[`${userId}_${actividadId}`] = { ...allProgress[`${userId}_${actividadId}`], ...data };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
};