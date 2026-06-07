export const UD_ACTIVITY_TEMPLATES = {
  UD01: {
    code: 'UD01',
    title: 'Actividad Pasta Termica',
    statement: 'Sigue los pasos de la practica y registra evidencias para validar el proceso.',
    timeline: {
      startDate: '2026-06-01',
      dueDate: '2026-06-10',
    },
    evaluationMethods: [
      'registro de pasos completados',
      'evidencias de imagen/texto',
      'autoevaluacion por progreso',
      'revision manual Admin Master',
    ],
    requiredResources: ['PC', 'PANTALLA', 'DISIPADOR', 'PASTA_TERMICA'],
    steps: [
      {
        id: 'ud01-step-01',
        title: 'Seleccionar materiales',
        instruction: 'Selecciona los materiales necesarios del inventario antes de iniciar.',
        evidenceType: 'text',
      },
      {
        id: 'ud01-step-02',
        title: 'Localizar material en aula taller',
        instruction: 'Localiza el material en el aula taller y confirma que funciona.',
        evidenceType: 'text',
      },
      {
        id: 'ud01-step-03',
        title: 'Subir imagen del PC en marcha',
        instruction: 'Toma una imagen del PC asignado en funcionamiento.',
        evidenceType: 'image',
      },
      {
        id: 'ud01-step-04',
        title: 'Registrar temperatura inicial',
        instruction: 'Anota la temperatura inicial mostrada en el monitor de recursos.',
        evidenceType: 'number',
        unit: 'C',
      },
      {
        id: 'ud01-step-05',
        title: 'Subir imagen CPU con pasta antigua',
        instruction: 'Retira el disipador y sube imagen de la CPU con pasta termica antigua.',
        evidenceType: 'image',
      },
      {
        id: 'ud01-step-06',
        title: 'Subir imagen CPU limpia',
        instruction: 'Retira la pasta termica antigua y sube imagen de la CPU limpia.',
        evidenceType: 'image',
      },
      {
        id: 'ud01-step-07',
        title: 'Registrar temperatura sin pasta',
        instruction: 'Anota la temperatura sin pasta termica.',
        evidenceType: 'number',
        unit: 'C',
      },
      {
        id: 'ud01-step-08',
        title: 'Subir imagen con pasta nueva',
        instruction: 'Aplica pasta termica nueva y sube imagen de la CPU.',
        evidenceType: 'image',
      },
      {
        id: 'ud01-step-09',
        title: 'Subir imagen con disipador montado',
        instruction: 'Monta el disipador y sube imagen del equipo funcionando.',
        evidenceType: 'image',
      },
      {
        id: 'ud01-step-10',
        title: 'Registrar temperatura final',
        instruction: 'Anota la temperatura final tras aplicar la pasta termica.',
        evidenceType: 'number',
        unit: 'C',
      },
    ],
  },
}

export const getUdTemplate = (udCode) => {
  const key = String(udCode || '').toUpperCase()
  return UD_ACTIVITY_TEMPLATES[key] || null
}
