// src/data/udActivityTemplates.js
// Plantillas de actividades para Unidades Didácticas (UD)
// Cada plantilla define la estructura de una actividad, incluyendo pasos, recursos y métodos de evaluación.
// Ejemplo de plantilla para la UD01: Actividad Pasta Termica 
// La función getUdTemplate permite obtener la plantilla de actividad correspondiente a un código de UD específico.
// Nota: Las fechas, recursos y pasos son ejemplos y pueden ser ajustados según las necesidades del curso o taller.
// Estructura de cada plantilla:
// - code: Código identificador de la UD (e.g., 'UD01')
// - title: Título de la actividad
// - statement: Descripción general de la actividad 
// - timeline: Fechas de inicio y entrega
// - evaluationMethods: Métodos de evaluación utilizados para validar el proceso
// - requiredResources: Recursos necesarios para completar la actividad
// - steps: Lista de pasos detallados con instrucciones y tipos de evidencia requeridos
// Ejemplo de uso:
// const ud01Template = getUdTemplate('UD01')
// console.log(ud01Template.title) // Output: 'Actividad Pasta Termica'
// Exportamos las plantillas de actividades para su uso en otras partes de la aplicación
// Nota: Se pueden agregar más plantillas para otras UDs siguiendo la misma estructura.
// REVISAR: Asegurarse de que las fechas y recursos sean realistas y estén alineados con el contexto del curso o taller.
// REVISAR: Validar que los tipos de evidencia y métodos de evaluación sean adecuados para cada paso y actividad.
// REVISAR: Considerar agregar campos adicionales como 'description' para cada paso o 'tips' para guiar a los estudiantes durante la actividad.
// REVISAR: Evaluar la posibilidad de incluir un campo 'difficultyLevel' para cada actividad o paso, para ayudar a los estudiantes a prepararse mejor para los desafíos que enfrentarán.
// REVISAR: Asegurarse de que la función getUdTemplate maneje correctamente casos donde el código de UD no exista o sea inválido, retornando null o un mensaje de error adecuado.
// REVISAR: Considerar la posibilidad de agregar un campo 'estimatedTime' para cada paso, para ayudar a los estudiantes a gestionar su tiempo durante la actividad.
// REVISAR: Evaluar la posibilidad de incluir un campo 'resourcesLinks' para cada paso, proporcionando enlaces a recursos adicionales o tutoriales relacionados con la actividad.
// REVISAR: Asegurarse de que la estructura de cada plantilla sea consistente y fácil de entender para los estudiantes, facilitando su seguimiento durante la actividad.
// REVISAR: Validar que los campos 'requiredResources' y 'evaluationMethods' sean claros y específicos, evitando ambigüedades que puedan generar confusión entre los estudiantes.
// REVISAR: Considerar la posibilidad de agregar un campo 'groupActivity' para indicar si la actividad es individual o grupal, y proporcionar instrucciones específicas para actividades grupales.
// REVISAR: Evaluar la posibilidad de incluir un campo 'feedback' para cada paso, permitiendo a los estudiantes recibir retroalimentación específica sobre su desempeño en cada etapa de la actividad.
// REVISAR: Asegurarse de que la función getUdTemplate sea eficiente y maneje correctamente casos donde el código de UD no exista o sea inválido, retornando null o un mensaje de error adecuado.

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
