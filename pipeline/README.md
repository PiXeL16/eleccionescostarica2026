# Elecciones Costa Rica 2026 - Análisis de Planes de Gobierno

Sistema integral para extraer, analizar y comparar plataformas políticas de los partidos participantes en las elecciones presidenciales de Costa Rica 2026.

## 🎯 Características

- **Extracción automática de PDFs**: Maneja documentos basados en texto y escaneados (OCR)
- **Análisis con IA (GPT-4o)**: Categorización y resumen automático de posiciones políticas
- **11 categorías políticas**: Economía, Impuestos, Salud, Educación, Seguridad, Medio Ambiente, Política Social, Infraestructura, Política Exterior, Reforma Institucional, Cultura y Deporte
- **Sistema extensible**: Agrega nuevas categorías y procesa automáticamente todos los documentos existentes
- **Base de datos SQLite**: Almacenamiento estructurado con búsqueda de texto completo
- **Pipeline modular**: Caché inteligente para evitar reprocesamiento innecesario

## 📦 Estructura del Proyecto

```
Elecciones2026/
├── src/
│   ├── extraction/          # Extracción de PDF y OCR
│   ├── analysis/            # Integración con GPT-4o
│   ├── storage/             # Base de datos SQLite
│   └── pipeline/            # Orquestación del pipeline
├── config/
│   └── categories.json      # Definiciones de categorías
├── data/
│   ├── partidos/           # PDFs de los partidos (20 documentos)
│   ├── cache/              # Texto extraído (caché)
│   └── database.db         # Base de datos SQLite
├── scripts/
│   └── download_pdfs.py    # Script de descarga de PDFs
├── requirements.txt
├── main.py                 # CLI principal
└── README.md
```

## 🚀 Instalación

### 1. Requisitos

- Python 3.9+
- Cuenta de OpenAI con acceso a GPT-4o

### 2. Instalar dependencias

```bash
# Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configurar API Key

```bash
# Copiar ejemplo de configuración
cp .env.example .env

# Editar .env y agregar tu API key de OpenAI
# OPENAI_API_KEY=sk-...
```

### 4. Inicializar base de datos

```bash
python main.py init
```

Esto creará la base de datos SQLite y cargará:
- Las 11 categorías políticas desde `config/categories.json`
- Los 20 partidos políticos desde `data/partidos/`
- Metadata de los PDFs ya descargados

## 📖 Uso

### Ver estado del sistema

```bash
python main.py status
```

Muestra:
- Número de partidos y documentos
- Estado de procesamiento por categoría
- Costo total acumulado

### Listar categorías disponibles

```bash
python main.py list-categories
```

### Procesar documentos (POC con 3 partidos)

```bash
# Procesar los primeros 3 documentos (prueba de concepto)
python main.py process --limit 3

# Procesar un partido específico
python main.py process --party PLN

# Procesar solo una categoría específica
python main.py process --category economia

# Procesar todos los documentos
python main.py process
```

### Ver resultados de análisis

```bash
# Ver análisis completo de un partido
python main.py show PLN

# Ver solo una categoría específica
python main.py show PLN --category economia
```

### Agregar nueva categoría (extensibilidad)

1. Editar `config/categories.json` y agregar la nueva categoría
2. Reinicializar la base de datos para cargar la nueva categoría:
   ```bash
   python main.py init
   ```
3. Procesar todos los documentos para la nueva categoría:
   ```bash
   python main.py backfill nueva_categoria
   ```

El sistema automáticamente procesará todos los documentos existentes para la nueva categoría sin necesidad de reextraer el texto de los PDFs.

## 💰 Costos

### Estimaciones con GPT-4o

- **POC (3 partidos, 11 categorías)**: ~$12-15
- **Todos los partidos (20, 11 categorías)**: ~$80-100
- **Agregar nueva categoría (20 partidos)**: ~$4-5

Los costos varían según:
- Longitud de los documentos
- Complejidad del contenido
- Número de propuestas específicas por categoría

## 🔄 Pipeline de Procesamiento

```
┌─────────────────────┐
│ 1. Extracción PDF   │
│  - PyMuPDF          │
│  - Detección OCR    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 2. OCR (si es       │
│    necesario)       │
│  - EasyOCR (ES/EN)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 3. Caché de texto   │
│  - SQLite           │
│  - Reutilizable     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 4. Análisis LLM     │
│  - GPT-4o           │
│  - Por categoría    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 5. Almacenamiento   │
│  - party_positions  │
│  - Búsqueda FTS5    │
└─────────────────────┘
```

## 🗄️ Esquema de Base de Datos

### Tablas principales

- **parties**: Información de partidos políticos
- **documents**: Metadata de PDFs
- **document_text**: Texto extraído (caché reutilizable)
- **categories**: Definiciones de categorías (extensible)
- **party_positions**: Análisis de posiciones por categoría
- **category_processing_status**: Seguimiento de procesamiento
- **processing_log**: Registro de costos y tokens

### Consultas útiles

```sql
-- Ver resúmenes de todas las categorías para un partido
SELECT c.name, pp.summary
FROM party_positions pp
JOIN categories c ON pp.category_id = c.id
JOIN parties p ON pp.party_id = p.id
WHERE p.abbreviation = 'PLN';

-- Buscar propuestas que mencionen una palabra clave
SELECT p.name, c.name, pp.summary
FROM party_positions_fts fts
JOIN party_positions pp ON fts.rowid = pp.id
JOIN parties p ON pp.party_id = p.id
JOIN categories c ON pp.category_id = c.id
WHERE party_positions_fts MATCH 'empleo';

-- Costo total por partido
SELECT p.name, SUM(pp.cost_usd) as total_cost
FROM party_positions pp
JOIN parties p ON pp.party_id = p.id
GROUP BY p.id;
```

## 🧪 Desarrollo y Testing

### Probar extracción de PDF

```bash
python src/extraction/pdf_extractor.py data/partidos/PLN-Liberacion-Nacional/PLN.pdf
```

### Probar OCR

```bash
python src/extraction/ocr_processor.py data/partidos/SOME-SCANNED/SOME.pdf
```

### Probar análisis LLM

```bash
python src/analysis/llm_analyzer.py sample_text.txt
```

## 📊 Próximos Pasos

1. ✅ Procesamiento POC (3 partidos)
2. ⏳ Validar calidad de análisis
3. ⏳ Iterar en prompts si es necesario
4. ⏳ Procesar los 20 partidos completos
5. ⏳ Desarrollar sitio web Next.js con comparaciones

## 🤝 Contribuir

Este es un proyecto de análisis político para las elecciones de Costa Rica 2026. Para agregar mejoras:

1. Agregar nuevas categorías en `config/categories.json`
2. Mejorar prompts en `src/analysis/llm_analyzer.py`
3. Optimizar extracción de PDFs en `src/extraction/`

## 📝 Licencia

Proyecto de análisis político para uso educativo y de investigación.

## 📧 Contacto

Para preguntas o sugerencias sobre este proyecto de análisis político.
