// ============================================================
// ARCHIVO: src/services/api.js
// DESCRIPCIÓN: Cliente API para comunicarse con el backend NestJS
// ============================================================

import { getToken, logout } from './auth'

const request = async (path, options = {}) => {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    logout()
    window.location.href = '/login'
    return null
  }

  let payload = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (!res.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `HTTP ${res.status} ${res.statusText}`
    const err = new Error(String(message))
    err.status = res.status
    err.payload = payload
    throw err
  }

  return payload
}

export const api = {
  // Recursos (NestJS)
  getResources: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/resources${q ? '?' + q : ''}`)
  },
  getResource: (id) => request(`/resources/${id}`),
  getStats: () => request('/resources/stats/all'),
  createResource: (data) => request('/resources', { method: 'POST', body: JSON.stringify(data) }),
  deleteResource: (id) => request(`/resources/${id}`, { method: 'DELETE' }),
  updateResource: (id, data) => request(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  assignResource: (code, userEmail, location) =>
    request('/resources/assign', {
      method: 'POST',
      body: JSON.stringify({ resource_code: code, user_email: userEmail, location }),
    }),
  releaseResource: (code) =>
    request('/resources/release', { method: 'POST', body: JSON.stringify({ resource_code: code }) }),
  getMyResources: () => request('/resources/my'),
  selfAssignResource: (code, location) =>
    request('/resources/self-assign', {
      method: 'POST',
      body: JSON.stringify({ resource_code: code, location }),
    }),

  // Usuarios (NestJS)
  getUsers: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/users${q ? '?' + q : ''}`)
  },
  getUser: (id) => request(`/users/${id}`),
  getUserResources: (userId) => request(`/users/${userId}/resources`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Asignaciones
  getAssignments: () => request('/resources/assignments/current'),

  // Admin - lista blanca
  getWhitelist: () => request('/admin/whitelist'),
  addToWhitelist: (email) => request('/admin/whitelist', { method: 'POST', body: JSON.stringify({ email }) }),
  removeFromWhitelist: (email) => request(`/admin/whitelist/${encodeURIComponent(email)}`, { method: 'DELETE' }),
  getHelpDocs: () => request('/admin/help-docs'),
  saveHelpDocs: (docs) => request('/admin/help-docs', { method: 'POST', body: JSON.stringify(docs) }),
  getHelpDocsHistory: () => request('/admin/help-docs/history'),
  exportHelpDocsMarkdown: () => request('/admin/help-docs/export'),

  // Elementos 3D por sala
  getSpaceElements: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/space-elements${q ? '?' + q : ''}`)
  },
  upsertSpaceElement: (data) => request('/space-elements', { method: 'POST', body: JSON.stringify(data) }),
  deleteSpaceElement: (id) => request(`/space-elements/${id}`, { method: 'DELETE' }),

  // Proyectos + tareas
  getProjects: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/projects${q ? '?' + q : ''}`)
  },
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  getProjectTasks: (projectId) => request(`/projects/${projectId}/tasks`),
  createProjectTask: (projectId, data) => request(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateProjectTask: (taskId, data) => request(`/projects/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProjectTask: (taskId) => request(`/projects/tasks/${taskId}`, { method: 'DELETE' }),
  exportProjectPdf: async (projectId, filename = `project-${projectId}.pdf`) => {
    const token = getToken()
    const res = await fetch(`/api/projects/${projectId}/export/pdf`, {
      method: 'GET',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })
    if (res.status === 401) {
      logout()
      window.location.href = '/login'
      return
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  },

  // Libro actividad UD
  getUdActivities: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/ud-activities${q ? '?' + q : ''}`)
  },
  getUdActivity: (id) => request(`/ud-activities/${id}`),
  createUdActivity: (data) => request('/ud-activities', { method: 'POST', body: JSON.stringify(data) }),
  updateUdActivity: (id, data) => request(`/ud-activities/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUdActivity: (id) => request(`/ud-activities/${id}`, { method: 'DELETE' }),
  linkUdActivityTask: (udActivityId, taskId) => request(`/ud-activities/${udActivityId}/link-task/${taskId}`, { method: 'POST' }),
  unlinkUdActivityTask: (taskId) => request(`/ud-activities/unlink-task/${taskId}`, { method: 'POST' }),

  // Ubicaciones dinámicas de almacenamiento
  getStorageLocations: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/storage-locations${q ? '?' + q : ''}`)
  },
  getStorageLocation: (id) => request(`/storage-locations/${id}`),
  createStorageLocation: (data) => request('/storage-locations', { method: 'POST', body: JSON.stringify(data) }),
  updateStorageLocation: (id, data) => request(`/storage-locations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteStorageLocation: (id) => request(`/storage-locations/${id}`, { method: 'DELETE' }),

  // Import Excel
  importExcel: (formData) =>
    fetch('/api/import-export/import', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData
    }).then(res => res.json()),

  // Activity progress (G5)
  getMyActivityProgress: (activityId) => request(`/ud-activities/${activityId}/progress/me`),
  updateMyActivityProgress: (activityId, data) => request(`/ud-activities/${activityId}/progress/me`, { method: 'POST', body: JSON.stringify(data) }),
  submitActivityProgress: (activityId) => request(`/ud-activities/${activityId}/progress/me/submit`, { method: 'POST', body: JSON.stringify({}) }),
  getAllActivityProgress: (activityId) => request(`/ud-activities/${activityId}/progress`),
  validateStudentProgress: (activityId, userId, data) => request(`/ud-activities/${activityId}/progress/${userId}/validate`, { method: 'POST', body: JSON.stringify(data) }),
  returnStudentProgress: (activityId, userId, data) => request(`/ud-activities/${activityId}/progress/${userId}/return`, { method: 'POST', body: JSON.stringify(data) }),
  getActivityReports: (params = {}) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))).toString()
    return request(`/admin/reports/activities${q ? '?' + q : ''}`)
  },
  getStudentReport: (userId) => request(`/admin/reports/student/${userId}`),

  // ============================================
  // SUBIDA DE IMÁGENES (EVIDENCIAS DE ACTIVIDAD)
  // ============================================
  uploadActivityImage: async (formData) => {
    const token = getToken()
    const response = await fetch('/api/upload/activity-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    if (!response.ok) {
      let errorMsg = 'Error subiendo imagen'
      try {
        const errData = await response.json()
        errorMsg = errData.error || errData.message || errorMsg
      } catch {}
      throw new Error(errorMsg)
    }
    return response.json()
  },
}

export default api