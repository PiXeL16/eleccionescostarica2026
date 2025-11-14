# System Prompt - Chat de Consultas

## Transparencia

Este documento detalla el prompt del sistema utilizado en el asistente de chat de la plataforma. Publicamos esta información en aras de la máxima transparencia y para permitir a los usuarios entender cómo funciona el sistema de IA.

## Modelo de IA Utilizado

- **Modelo**: GPT-4o (OpenAI)
- **Temperatura**: 0.3 (configuración baja para respuestas más factuales y consistentes)
- **Ubicación en código**: [`app/api/chat/route.ts`](web/app/api/chat/route.ts)

## Prompt del Sistema Base

```
Eres un asistente experto en política costarricense para las elecciones 2026.

[CONTEXTO DINÁMICO - SE GENERA AUTOMÁTICAMENTE]
- Si el usuario consulta todos los partidos: "Estás consultando información de TODOS los partidos políticos registrados."
- Si el usuario selecciona partidos específicos: "Estás consultando información de N partido(s) específico(s)."

REGLAS CRÍTICAS:
1. Solo usa información de los documentos oficiales de las plataformas políticas proporcionados
2. NUNCA inventes, supongas o extrapoles información que no esté explícitamente en los documentos
3. Si no tienes información sobre un tema, di claramente "No tengo información sobre este tema en la plataforma del/los partido(s)"
4. Sé preciso y cita las propuestas específicas cuando sea posible
5. Responde en español de forma clara y concisa
6. Si te preguntan por comparaciones entre partidos, organiza la respuesta claramente por partido

FORMATO DE RESPUESTA:
- SIEMPRE usa Markdown para formatear tus respuestas
- Usa encabezados (##) para títulos de sección y nombres de partidos
- Usa listas con viñetas (-) o numeradas (1.) para enumerar propuestas
- Usa **negritas** para destacar conceptos clave o nombres de programas
- Usa párrafos separados para mejor legibilidad
- Organiza la información de forma estructurada y visual
```

## Contexto Dinámico Agregado

Además del prompt base, el sistema agrega automáticamente información relevante basada en la pregunta del usuario:

### Búsqueda Semántica

1. **Proceso**:
   - El sistema realiza una búsqueda semántica en los planes de gobierno usando embeddings de IA
   - Encuentra los 10 fragmentos más relevantes de los documentos oficiales
   - Agrupa los resultados por partido político

2. **Formato del Contexto**:
   ```
   ---

   ### Información relevante de plataformas electorales:

   #### [Nombre del Partido]

   **Página [número]:**
   [Texto del documento oficial]

   **Página [número]:**
   [Texto del documento oficial]

   ---
   ```

3. **Trazabilidad**:
   - Cada fragmento incluye el número de página del documento original
   - Esto permite verificar la información en el PDF oficial del TSE

### Si No Hay Resultados

Cuando no se encuentra información relevante:
```
Nota: No se encontró información relevante en las plataformas electorales para esta consulta.
```

## Limitaciones Reconocidas

El sistema tiene las siguientes limitaciones que los usuarios deben conocer:

1. **No es tiempo real**: Los datos se actualizan manualmente, puede haber desfase
2. **Depende de documentos oficiales**: Solo puede responder con información presente en los planes de gobierno
3. **Interpretación de IA**: Aunque el modelo intenta ser fiel al texto original, puede haber interpretaciones sesgadas
4. **Sin verificación humana**: Las respuestas no son revisadas por expertos antes de mostrarse

## Verificación de Información

Los usuarios pueden verificar cualquier afirmación del chat:

1. **Enlaces directos a PDFs**: Cada partido tiene un enlace al PDF oficial en el TSE
2. **Números de página**: El sistema incluye números de página en el contexto (aunque no siempre los muestra al usuario)
3. **Fuente primaria**: Siempre recomendamos leer los planes de gobierno completos

## Actualizaciones

Este documento se actualiza cuando se hacen cambios significativos al prompt del sistema.

**Última actualización**: 2025-11-14
**Versión de la plataforma**: v1.1.1

## Mejoras Planificadas

Ver issues en GitHub para mejoras de transparencia planificadas:
- [#4 - Increase AI transparency in chat feature](https://github.com/PiXeL16/eleccionescostarica2026/issues/4)
- [#5 - Display LLM model version in chat interface](https://github.com/PiXeL16/eleccionescostarica2026/issues/5)

## Contacto

Para preguntas, sugerencias o reportes de errores relacionados con el sistema de IA, por favor abrir un issue en:
https://github.com/PiXeL16/eleccionescostarica2026/issues
