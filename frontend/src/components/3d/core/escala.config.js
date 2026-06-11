// ============================================================
// ARCHIVO: src/components/3d/core/escala.config.js
// DESCRIPCIÓN: Configuración de escala unificada (referencia: 40cm por celda)
// ============================================================

export const ESCALA = {
  // Base: 1 unidad = 40cm (para que 1 celda = 40cm)
  UNIDAD_METROS: 0.4,
  
  // Tamaño de celda del grid (baldosa de 40x40cm)
  CELL_SIZE: 0.4,
  
  // Alturas estándar (en unidades 3D, 1 unidad = 40cm)
  ALTURAS: {
    SUELO: 0,
    MESA: 0.75 / 0.4,      // 75cm reales ≈ 1.875 unidades
    SILLA: 0.45 / 0.4,     // 45cm reales ≈ 1.125 unidades
    PERSONA_SENTADA: 1.2 / 0.4, // 120cm ≈ 3 unidades
    PERSONA_PIE: 1.7 / 0.4,     // 170cm ≈ 4.25 unidades
    ESTANTERIA: 1.8 / 0.4,      // 180cm ≈ 4.5 unidades
    ARMARIO: 2.0 / 0.4,         // 200cm ≈ 5 unidades
    PC_TORRE: 0.45 / 0.4,       // 45cm ≈ 1.125 unidades
    MONITOR: 0.35 / 0.4,        // 35cm ≈ 0.875 unidades
  },
  
  // Tamaños de objetos (en unidades 3D)
  OBJETOS: {
    MESA_PRINCIPAL: { ancho: 3.0, fondo: 2.0, alto: 1.875 },  // 120x80x75cm
    PC_SOBREMESA: { ancho: 0.4, fondo: 0.3, alto: 0.2 },       // 16x12x8cm
    PC_TORRE: { ancho: 0.3, fondo: 0.3, alto: 1.125 },         // 12x12x45cm
    PANTALLA: { ancho: 0.5, fondo: 0.05, alto: 0.875 },        // 20x2x35cm
    TECLADO: { ancho: 0.45, fondo: 0.15, alto: 0.075 },        // 18x6x3cm
    CAJA_HERRAMIENTAS: { ancho: 0.9, fondo: 0.4, alto: 0.4 },  // 36x16x16cm
  }
};

// Función para convertir cm a unidades 3D
export const cmToUnits = (cm) => cm / 40;  // 40cm = 1 unidad

// Función para convertir unidades 3D a cm
export const unitsToCm = (units) => units * 40;

// Dimensiones de grid por defecto
export const GRID_DEFAULT = {
  width: 40,   // 20 celdas = 8 metros
  depth: 20,   // 20 celdas = 8 metros
};

export default ESCALA;