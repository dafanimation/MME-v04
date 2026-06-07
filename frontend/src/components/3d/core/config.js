// ============================================================
// ARCHIVO: src/components/3d/core/config.js
// DESCRIPCIÓN: Configuración global del sistema 3D
// AUTOR: Sistema MME
// VERSIÓN: 3.0
// FECHA: 2026-06-04
// ============================================================
// 
// CONTENIDO:
// 1. ESCALA Y ALTURAS - Constantes base para posicionamiento
// 2. ELEMENTOS PRINCIPALES - Mesa, PC, Usuario
// 3. ALMACENAJE - Estanterías, Armarios
// 4. RECURSOS - Pantalla, HDD, Portátil, Impresora
// 5. ENTIDADES - Actividad (cubo), Proyecto (pirámide)
// 6. POSICIONES - Arrays con posiciones fijas
// 7. ESTADOS Y TIPOS - Constantes para estados y tipos
// 8. COLORES - Paleta general
// 9. GRID - Límites del suelo
// 10. FUNCIONES UTILIDAD - getPositionByIndex, isValidType, etc.
//
// ============================================================

// ============================================
// 1. ESCALA BASE
// ============================================
export const TILE_SIZE = 0.5
export const TILE_HALF = TILE_SIZE / 2

// ============================================
// 2. ALTURAS (relativas al suelo, Y = 0)
// ============================================
export const GROUND_Y = -0.05
export const MESA_HEIGHT = 1.0
export const PC_HEIGHT = 0.1
export const USER_HEIGHT = 0.25
export const ESTANTERIA_HEIGHT = 1.2
export const ARMARIO_HEIGHT = 1.8
export const PANTALLA_HEIGHT = 0.2
export const HDD_HEIGHT = 0.05
export const PORTATIL_HEIGHT = 0.1
export const IMPRESORA_HEIGHT = 0.2

// Posiciones Y (centro geométrico)
export const MESA_Y = MESA_HEIGHT / 2
export const PC_Y = MESA_HEIGHT + PC_HEIGHT / 2
export const USER_Y = MESA_HEIGHT + USER_HEIGHT
export const PANTALLA_Y = PC_Y + PC_HEIGHT / 2 + PANTALLA_HEIGHT / 2

// ============================================
// 3. MESA PRINCIPAL
// ============================================
export const MESA = {
  id: 'mesa_principal',
  nombre: 'Mesa de Trabajo Principal',
  width: 3 * TILE_SIZE,
  depth: 2 * TILE_SIZE,
  height: MESA_HEIGHT,
  x: 0,
  z: 0,
  maxPcs: 6,
  maxUsuarios: 12,
  maxRecursosSobreMesa: 8,
  colorFill: '#ff8a1f',
  colorEdge: '#ffaa44',
  opacity: 0.15,
  wireframe: true,
  tipo: 'trabajo',
  activa: true,
}

// ============================================
// 4. PC (sobre mesa)
// ============================================
export const PC = {
  tipo: 'pc',
  nombre: 'Ordenador Personal',
  width: 0.4,
  depth: 0.3,
  height: PC_HEIGHT,
  maxPorMesa: 6,
  positions: [
    { x: -0.45, z: -0.30, label: 'Posición 1', index: 0 },
    { x: 0,     z: -0.30, label: 'Posición 2', index: 1 },
    { x: 0.45,  z: -0.30, label: 'Posición 3', index: 2 },
    { x: -0.45, z: 0.30,  label: 'Posición 4', index: 3 },
    { x: 0,     z: 0.30,  label: 'Posición 5', index: 4 },
    { x: 0.45,  z: 0.30,  label: 'Posición 6', index: 5 },
  ],
  colors: {
    available: '#00ff88',
    assigned: '#00d4ff',
    occupied: '#ff4444',
    maintenance: '#ffaa00',
    review: '#aa66ff',
  },
  colorFill: '#00ff88',
  colorEdge: '#88ffaa',
  opacity: 0.7,
}

// ============================================
// 5. USUARIO (alrededor de la mesa)
// ============================================
export const USUARIO = {
  tipo: 'usuario',
  nombre: 'Usuario',
  radius: 0.18,
  positions: [
    // Lado Norte
    { x: -0.8, z: -1.6, label: 'N1', lado: 'norte', index: 0 },
    { x: 0,    z: -1.6, label: 'N2', lado: 'norte', index: 1 },
    { x: 0.8,  z: -1.6, label: 'N3', lado: 'norte', index: 2 },
    // Lado Sur
    { x: -0.8, z: 1.6,  label: 'S1', lado: 'sur',   index: 3 },
    { x: 0,    z: 1.6,  label: 'S2', lado: 'sur',   index: 4 },
    { x: 0.8,  z: 1.6,  label: 'S3', lado: 'sur',   index: 5 },
    // Lado Este
    { x: 1.6,  z: -0.6, label: 'E1', lado: 'este',  index: 6 },
    { x: 1.6,  z: 0.6,  label: 'E2', lado: 'este',  index: 7 },
    // Lado Oeste
    { x: -1.6, z: -0.6, label: 'W1', lado: 'oeste', index: 8 },
    { x: -1.6, z: 0.6,  label: 'W2', lado: 'oeste', index: 9 },
    // Esquinas
    { x: 1.2,  z: 1.2,  label: 'SE', lado: 'sureste', index: 10 },
    { x: -1.2, z: 1.2,  label: 'SW', lado: 'suroeste', index: 11 },
  ],
  colorFill: '#00d4ff',
  colorEdge: '#88ddff',
  opacity: 0.5,
}

// ============================================
// 6. ESTANTERÍA (almacenaje básico)
// ============================================
export const ESTANTERIA = {
  tipo: 'estanteria',
  nombre: 'Estantería',
  width: 0.8,
  depth: 0.6,
  height: ESTANTERIA_HEIGHT,
  capacidad: {
    pcs: 4,
    portatiles: 2,
    pantallas: 2,
    impresoras: 1,
    otros: 4,
  },
  capacidadTotal: 12,
  colorFill: '#4dabff',
  colorEdge: '#7ac4ff',
  opacity: 0.3,
  wireframe: true,
}

// ============================================
// 7. ARMARIO (almacenaje mejorado)
// ============================================
export const ARMARIO = {
  tipo: 'armario',
  nombre: 'Armario de Almacenaje',
  width: 1.2,
  depth: 0.8,
  height: ARMARIO_HEIGHT,
  capacidad: {
    pcs: 6,
    portatiles: 4,
    pantallas: 3,
    impresoras: 2,
    otros: 8,
  },
  capacidadTotal: 24,
  colorFill: '#3a7abf',
  colorEdge: '#5a9adf',
  opacity: 0.35,
  wireframe: true,
  tienePuertas: true,
  niveles: 3,
}

// ============================================
// 8. PANTALLA (sobre PC)
// ============================================
export const PANTALLA = {
  tipo: 'pantalla',
  nombre: 'Pantalla',
  width: 0.22,
  depth: 0.02,
  height: PANTALLA_HEIGHT,
  yOffset: 0.15,
  maxPorPC: 2,
  colors: {
    available: '#2d8cff',
    assigned: '#00d4ff',
    occupied: '#ff4444',
    maintenance: '#ffaa00',
  },
  colorFill: '#2d8cff',
  colorEdge: '#6ab0ff',
  opacity: 0.8,
  wireframe: false,
}

// ============================================
// 9. DISCO DURO (HDD)
// ============================================
export const HDD = {
  tipo: 'hdd',
  nombre: 'Disco Duro',
  width: 0.1,
  depth: 0.08,
  height: HDD_HEIGHT,
  posicionRelativa: { x: 1, z: 0, y: -0.01 },
  capacidadGB: [256, 512, 1024, 2048],
  maxPorPC: 2,
  colors: {
    available: '#ff4444',
    installed: '#ff6666',
    faulty: '#aa2222',
  },
  colorFill: '#ff4444',
  colorEdge: '#ff8888',
  opacity: 0.85,
  wireframe: false,
}

// ============================================
// 10. PORTÁTIL
// ============================================
export const PORTATIL = {
  tipo: 'portatil',
  nombre: 'Portátil',
  width: 0.35,
  depth: 0.35,
  height: PORTATIL_HEIGHT,
  maxPorMesa: 4,
  maxPorArmario: 6,
  colors: {
    available: '#a855f7',
    assigned: '#c084fc',
    occupied: '#ff4444',
  },
  colorFill: '#a855f7',
  colorEdge: '#c084fc',
  opacity: 0.7,
}

// ============================================
// 11. IMPRESORA
// ============================================
export const IMPRESORA = {
  tipo: 'impresora',
  nombre: 'Impresora',
  width: 0.45,
  depth: 0.45,
  height: IMPRESORA_HEIGHT,
  maxPorMesa: 2,
  maxPorArmario: 2,
  colors: {
    available: '#9ba3ad',
    assigned: '#00d4ff',
    occupied: '#ff4444',
  },
  colorFill: '#9ba3ad',
  colorEdge: '#bcc4cd',
  opacity: 0.7,
}

// ============================================
// 12. ACTIVIDAD (CUBO)
// ============================================
export const ACTIVIDAD = {
  tipo: 'actividad',
  nombre: 'Actividad UD',
  size: 0.25,
  colorFill: '#ffaa44',
  colorEdge: '#ffcc66',
  opacity: 0.7,
}

// ============================================
// 13. PROYECTO (PIRÁMIDE)
// ============================================
export const PROYECTO = {
  tipo: 'proyecto',
  nombre: 'Proyecto',
  radius: 0.35,
  height: 0.5,
  colorFill: '#00d4ff',
  colorEdge: '#88ddff',
  opacity: 0.7,
}

// ============================================
// 14. POSICIONES FIJAS (para renderizado)
// ============================================

// Posiciones de PCs (alias para conveniencia)
export const PC_POSITIONS = PC.positions

// Posiciones de Usuarios (alias para conveniencia)
export const USER_POSITIONS = USUARIO.positions

// Posiciones de Estanterías
export const ESTANTERIA_POSITIONS = [
  { x: -2.2, z: -2.0, label: 'Estantería NO', zona: 'noroeste' },
  { x: 2.2,  z: -2.0, label: 'Estantería NE', zona: 'noreste' },
  { x: -2.2, z: 2.0,  label: 'Estantería SO', zona: 'suroeste' },
  { x: 2.2,  z: 2.0,  label: 'Estantería SE', zona: 'sureste' },
]

// Posiciones de Armarios
export const ARMARIO_POSITIONS = [
  { x: -2.5, z: -2.8, label: 'Armario N1', zona: 'norte', num: 1 },
  { x: 0,    z: -2.8, label: 'Armario N2', zona: 'norte', num: 2 },
  { x: 2.5,  z: -2.8, label: 'Armario N3', zona: 'norte', num: 3 },
  { x: -2.5, z: 2.8,  label: 'Armario S1', zona: 'sur',   num: 4 },
  { x: 0,    z: 2.8,  label: 'Armario S2', zona: 'sur',   num: 5 },
  { x: 2.5,  z: 2.8,  label: 'Armario S3', zona: 'sur',   num: 6 },
]

// Posiciones dinámicas para nuevos elementos
export const DEFAULT_NEW_ELEMENT_POSITIONS = [
  { x: -3.0, z: -2.5, zona: 'esquina_noroeste' },
  { x: 0,    z: -2.5, zona: 'centro_norte' },
  { x: 3.0,  z: -2.5, zona: 'esquina_noreste' },
  { x: -3.0, z: 2.5,  zona: 'esquina_suroeste' },
  { x: 0,    z: 2.5,  zona: 'centro_sur' },
  { x: 3.0,  z: 2.5,  zona: 'esquina_sureste' },
  { x: -1.5, z: -4.0, zona: 'norte_extra_izquierda' },
  { x: 1.5,  z: -4.0, zona: 'norte_extra_derecha' },
  { x: -1.5, z: 4.0,  zona: 'sur_extra_izquierda' },
  { x: 1.5,  z: 4.0,  zona: 'sur_extra_derecha' },
]

// ============================================
// 15. ESTADOS Y TIPOS (para Mapa3D)
// ============================================

// Estados posibles para elementos
export const ESTADOS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  REVIEW: 'review',
  RECYCLE: 'recycle',
  INSTALLED: 'installed',
  FAULTY: 'faulty',
  PENDING: 'pending',
  ACTIVE: 'active',
}

// Tipos de elementos (para categorización en menú)
export const TIPOS_ELEMENTOS = {
  PC: 'pc',
  PORTATIL: 'portatil',
  PANTALLA: 'pantalla',
  IMPRESORA: 'impresora',
  HDD: 'hdd',
  USUARIO: 'usuario',
  ESTANTERIA: 'estanteria',
  ARMARIO: 'armario',
  ACTIVIDAD: 'actividad',
  PROYECTO: 'proyecto',
}

// Lista de tipos de recursos asignables
export const TIPOS_RECURSOS = {
  PC: { label: '🖥️ PC', color: '#00ff88', maxPorMesa: 6 },
  PORTATIL: { label: '💻 Portátil', color: '#a855f7', maxPorMesa: 4 },
  PANTALLA: { label: '🖵 Pantalla', color: '#2d8cff', maxPorPC: 2 },
  IMPRESORA: { label: '🖨️ Impresora', color: '#9ba3ad', maxPorMesa: 2 },
  HDD: { label: '💾 Disco Duro', color: '#ff4444', maxPorPC: 2 },
}

// Lista de tipos de almacenaje
export const TIPOS_ALMACENAJE = {
  ESTANTERIA: { label: '📚 Estantería', color: '#4dabff', capacidad: 12, maxTotal: 8 },
  ARMARIO: { label: '🗄️ Armario', color: '#3a7abf', capacidad: 24, maxTotal: 6 },
}

// Colores por estado (para asignables)
export const COLORES_ESTADO = {
  [ESTADOS.AVAILABLE]: '#00ff88',
  [ESTADOS.ASSIGNED]: '#00d4ff',
  [ESTADOS.OCCUPIED]: '#ff4444',
  [ESTADOS.MAINTENANCE]: '#ffaa00',
  [ESTADOS.REVIEW]: '#aa66ff',
  [ESTADOS.RECYCLE]: '#888888',
}

// ============================================
// 16. COLORES GENERALES
// ============================================
export const COLORS = {
  gridLine: '#2a3a5a',
  background: '#050510',
  hover: '#ffffff',
  selected: '#ffaa44',
  error: '#ff4444',
  success: '#00ff88',
  warning: '#ffaa44',
}

// ============================================
// 17. GRID
// ============================================
export const GRID = {
  width: 7,
  depth: 6,
}

// Límites automáticos
export const GRID_X_MIN = -(GRID.width - 1) * TILE_HALF
export const GRID_X_MAX = (GRID.width - 1) * TILE_HALF
export const GRID_Z_MIN = -(GRID.depth - 1) * TILE_HALF
export const GRID_Z_MAX = (GRID.depth - 1) * TILE_HALF

// ============================================
// 18. FUNCIONES DE UTILIDAD (para Mapa3D)
// ============================================

/**
 * Obtiene la posición de un elemento por índice (para arrays de posiciones)
 * @param {Array} positions - Array de posiciones
 * @param {number} index - Índice del elemento
 * @returns {Object} Posición { x, z } o posición por defecto
 */
export const getPositionByIndex = (positions, index) => {
  if (!positions || positions.length === 0) {
    return DEFAULT_NEW_ELEMENT_POSITIONS[0] || { x: 0, z: 0 }
  }
  return positions[index % positions.length]
}

/**
 * Verifica si un tipo de elemento es válido
 * @param {string} tipo - Tipo a validar
 * @returns {boolean}
 */
export const isValidType = (tipo) => {
  const tipoStr = String(tipo || '').toLowerCase()
  return Object.values(TIPOS_ELEMENTOS).includes(tipoStr) ||
         Object.keys(TIPOS_RECURSOS).some(k => k.toLowerCase() === tipoStr) ||
         Object.keys(TIPOS_ALMACENAJE).some(k => k.toLowerCase() === tipoStr)
}

/**
 * Obtiene el color por estado para un elemento configurable
 * @param {Object} elementConfig - Configuración del elemento (PC, PANTALLA, etc.)
 * @param {string} status - Estado actual
 * @returns {string} Color hex
 */
export const getColorByStatus = (elementConfig, status) => {
  if (!elementConfig) return '#888888'
  return elementConfig.colors?.[status] || elementConfig.colorFill || '#888888'
}

// ============================================
// EXPORT DEFAULT (para compatibilidad)
// ============================================
const config = {
  // Escala y alturas
  TILE_SIZE, TILE_HALF, GROUND_Y,
  MESA_HEIGHT, PC_HEIGHT, USER_HEIGHT,
  ESTANTERIA_HEIGHT, ARMARIO_HEIGHT,
  PANTALLA_HEIGHT, HDD_HEIGHT, PORTATIL_HEIGHT, IMPRESORA_HEIGHT,
  MESA_Y, PC_Y, USER_Y, PANTALLA_Y,
  
  // Elementos
  MESA, PC, USUARIO, ESTANTERIA, ARMARIO,
  PANTALLA, HDD, PORTATIL, IMPRESORA,
  ACTIVIDAD, PROYECTO,
  
  // Posiciones
  PC_POSITIONS, USER_POSITIONS,
  ESTANTERIA_POSITIONS, ARMARIO_POSITIONS,
  DEFAULT_NEW_ELEMENT_POSITIONS,
  
  // Tipos y estados
  ESTADOS, TIPOS_ELEMENTOS, TIPOS_RECURSOS, TIPOS_ALMACENAJE,
  COLORES_ESTADO, COLORS,
  
  // Grid
  GRID, GRID_X_MIN, GRID_X_MAX, GRID_Z_MIN, GRID_Z_MAX,
  
  // Utilidades
  getPositionByIndex, isValidType, getColorByStatus,
}
// Añadir al final de config.js

// ============================================
// CONFIGURACIÓN AVANZADA DE ARMARIOS
// ============================================

export const ARMARIO_CONFIG = {
  // Niveles de almacenaje (6 niveles total)
  niveles: {
    superior: { nombre: 'Superficie superior', y: 0.95, altura: 0.15, capacidad: 4 },
    balda4: { nombre: 'Balda 4 (superior)', y: 0.65, altura: 0.12, capacidad: 6 },
    balda3: { nombre: 'Balda 3', y: 0.35, altura: 0.12, capacidad: 6 },
    balda2: { nombre: 'Balda 2', y: 0.05, altura: 0.12, capacidad: 6 },
    balda1: { nombre: 'Balda 1', y: -0.25, altura: 0.12, capacidad: 6 },
    inferior: { nombre: 'Fondo inferior', y: -0.55, altura: 0.15, capacidad: 4 },
  },
  
  // Capacidad máxima por defecto
  capacidadPorDefecto: {
    cajasHerramientas: 10,
    pcs: 6,
    portatiles: 8,
    pantallas: 4,
    otros: 12,
  },
  
  // Altura de apilamiento vertical
  apilamientoVertical: {
    alturaPorUnidad: 0.08,  // 8cm por objeto apilado
    maxPorColumna: 4,       // Máximo 4 objetos apilados
  },
}
export default config