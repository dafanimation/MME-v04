// ============================================================
// ARCHIVO: src/components/3d/index.js
// DESCRIPCIÓN: Punto de entrada centralizado para todos los componentes 3D
// AUTOR: Sistema MME
// VERSIÓN: 2.1
// FECHA: 2026-06-06
// ============================================================
// 
// FUNCIÓN: Este archivo actúa como "barrel export" (exportación de barril)
// que centraliza todas las exportaciones del módulo 3D, permitiendo:
//
// 1. Importar múltiples componentes con una sola línea:
//    import { Mapa3D, Mesa3D, Pc3D, Armario3D, COLORS } from '../components/3d'
//
// 2. Mantener limpios los imports en otros archivos
// 3. Gestionar fácilmente las rutas internas del módulo 3D
// 4. Ocultar la estructura interna (core/entities) a los consumidores
//
// ESTRUCTURA DEL MÓDULO 3D:
// ├── core/          → Elementos fundamentales (GridSuelo, config, Mapa3D)
// ├── entities/      → Elementos 3D renderizables (Mesa, PC, Usuario, etc.)
// └── index.js       → Este archivo (exportaciones centralizadas)
//
// ============================================================

// ──────────────────────────────────────────────────────────
// 1. EXPORTACIONES DEL CORE (elementos fundamentales)
// ──────────────────────────────────────────────────────────

// GridSuelo: Renderiza el suelo cuadriculado (grid) de referencia
export { GridSuelo } from './core/GridSuelo';

// Mapa3D: Componente principal que orquesta toda la escena 3D
export { default as Mapa3D } from './core/Mapa3D';

// Configuración central del sistema 3D
export { 
  default as config, 
  COLORS, 
  ESTADOS, 
  MESA, 
  PC, 
  USUARIO 
} from './core/config';

// ──────────────────────────────────────────────────────────
// 2. EXPORTACIONES DE ENTITIES (elementos 3D renderizables)
// ──────────────────────────────────────────────────────────

// Mesa3D: Mesa de trabajo principal
export { Mesa3D } from './entities/Mesa3D';

// Pc3D: Ordenador personal sobre la mesa
export { Pc3D } from './entities/Pc3D';

// Usuario3D: Representación de persona alrededor de la mesa
export { Usuario3D } from './entities/Usuario3D';

// Estanteria3D: Almacenamiento básico (estantería)
export { Estanteria3D } from './entities/Estanteria3D';

// Armario3D: Almacenamiento mejorado con puertas
export { Armario3D } from './entities/Armario3D';

// ✅ NUEVO: ArmarioPortatiles3D - Armario para portátiles con carga
export { ArmarioPortatiles3D } from './entities/ArmarioPortatiles3D';

// Pantalla3D: Monitor sobre PC
export { Pantalla3D } from './entities/Pantalla3D';

// Hdd3D: Disco duro dentro del PC
export { Hdd3D } from './entities/Hdd3D';

// Portatil3D: Ordenador portátil
export { Portatil3D } from './entities/Portatil3D';

// Impresora3D: Impresora de red
export { Impresora3D } from './entities/Impresora3D';

// CuboActividad3D: Actividad educativa (Unidad Didáctica)
export { CuboActividad3D } from './entities/CuboActividad3D';

// PiramideProyecto3D: Proyecto colaborativo
export { PiramideProyecto3D } from './entities/PiramideProyecto3D';

// Puerta3D: Elemento decorativo - puerta
export { Puerta3D } from './Puerta3D';

// Ventana3D: Elemento decorativo - ventana
export { Ventana3D } from './Ventana3D';

// ============================================================
// NOTAS DE USO:
// ============================================================
//
// EJEMPLO DE IMPORTACIÓN EN OTROS ARCHIVOS:
//
// // Importar todo el módulo 3D
// import { 
//   Mapa3D,           // Componente principal
//   Mesa3D,           // Mesa individual
//   Pc3D,             // PC individual  
//   Armario3D,        // Armario principal
//   ArmarioPortatiles3D, // Armario de portátiles
//   COLORS,           // Constantes de color
//   ESTADOS           // Estados predefinidos
// } from '../components/3d'
//
// // O importar todo como un namespace
// import * as MME3D from '../components/3d'
//
// // Uso del Mapa3D
// <MME3D.Mapa3D 
//   room="AULA"
//   recursos={recursos}
//   onRecursoClick={handleClick}
// />
//
// ============================================================
// HISTORIAL DE CAMBIOS:
// ============================================================
// v1.0 (2026-06-01) - Exportaciones básicas
// v2.0 (2026-06-05) - Reorganización en core/entities
// v2.1 (2026-06-06) - Añadido ArmarioPortatiles3D
// ============================================================