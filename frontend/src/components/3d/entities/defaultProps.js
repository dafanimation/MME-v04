// Props de ejemplo para componentes 3D
// Sirve para que la vista catálogo muestre entidades sin depender de datos externos
const defaultProps = {
  Armario3D: {
    armario: { id: 1, num: 1, label: 'Armario Demo', tipo: 'principal', niveles: 6, capacidadTotal: 24 },
    baldas: [
      { recursos: [ { id: 1, tipo: 'pc', nombre: 'PC-01', code: 'PC-01' }, { id: 2, tipo: 'portatil', nombre: 'LAP-01', code: 'LAP-01' } ] },
      { recursos: [] },
      { recursos: [] },
      { recursos: [] },
      { recursos: [] },
      { recursos: [] },
    ],
    consumibles: [ { id: 1, nombre: 'Tornillos', cantidad: 10, balda: 0 } ],
  },

  ArmarioPortatiles3D: {
    armario: { id: 1, label: 'Armario Portátiles Demo' },
    portatiles: [
      { id: 1, estado: 'cargado', bateria: 95 },
      { id: 2, estado: 'cargando', bateria: 45 },
      { id: 3, estado: 'cargado', bateria: 100 },
      { id: 4, estado: 'cargando', bateria: 20 },
      { id: 5, estado: 'cargado', bateria: 80 },
      { id: 6, estado: 'cargando', bateria: 60 },
      { id: 7, estado: 'cargado', bateria: 90 },
      { id: 8, estado: 'cargando', bateria: 30 },
      { id: 9, estado: 'cargado', bateria: 70 },
      { id: 10, estado: 'cargando', bateria: 10 },
    ],
  },

  AulaTaller3D: {
    // Usa su configuración interna si no se proporcionan mesas
  },

  CajaHerramientas3D: {
    id: 1,
    isAbierta: false,
    herramientas: [
      { id: 1, nombre: 'Destornillador Plano', tipo: 'herramienta' },
      { id: 2, nombre: 'Alicates', tipo: 'herramienta' },
      { id: 3, nombre: 'Tijeras', tipo: 'herramienta' },
    ],
  },

  CuboActividad3D: {
    actividad: { id: 1, udCode: 'UD01', title: 'Actividad de ejemplo', progreso: 75 }
  },

  Estanteria3D: {
    estanteria: { id: 1, label: 'Estantería Demo', capacidadTotal: 12 }
  },

  Hdd3D: {
    hdd: { id: 1, capacidadGB: 512, tipo: 'SSD', status: 'available' }
  },

  Impresora3D: {
    impresora: { id: 1, code: 'PRN-01', status: 'available' }
  },

  Mesa3D: {
    pcsCount: 2,
    usuariosCount: 1,
  },

  Pantalla3D: {
    pantalla: { id: 1, status: 'available' }
  },

  Pc3D: {
    pc: { id: 1, code: 'PC-01', status: 'available', assignedUser: { email: 'alumno@test.com' } }
  },

  PcVertical3D: {
    pc: { id: 1, code: 'PC-01', status: 'available' },
    index: 0
  },

  Portatil3D: {
    portatil: { id: 1, code: 'LAP-01', status: 'available' }
  },

  PiramideProyecto3D: {
    proyecto: { id: 1, name: 'Proyecto IA', status: 'active', participants: [] }
  },

  Usuario3D: {
    user: { id: 1, name: 'Alumno', email: 'test@test.com', group: 'MME' }
  },

  Webcam3D: {
    isActive: false,
    currentUser: null,
  }
};

export default defaultProps;
