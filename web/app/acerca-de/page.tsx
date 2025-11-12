// ABOUTME: About page explaining project mission, methodology, and data sources
// ABOUTME: Provides transparency about AI analysis and open source nature

import Link from 'next/link';

export const metadata = {
  title: 'Acerca del Proyecto - Elecciones CR 2026',
  description:
    'Conozca cómo funciona esta plataforma de análisis de propuestas políticas para las elecciones de Costa Rica 2026',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al inicio
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Acerca del Proyecto</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Haciendo la información política más accesible para los votantes costarricenses
        </p>
      </div>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nuestra Misión</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Este proyecto tiene como objetivo hacer la información política más accesible para los
          votantes costarricenses mediante:
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              🤖 Análisis Automatizado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Utilizamos inteligencia artificial para extraer y estructurar información de extensos
              PDFs de planes de gobierno (más de 100 páginas cada uno)
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              ⚖️ Comparación Fácil
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Proporcionamos una comparación clara, lado a lado, de hasta 3 partidos a través de 13
              categorías clave de políticas públicas
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">🔓 Transparencia</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Todos los datos y metodologías son de código abierto, permitiendo que cualquiera pueda
              verificar y construir sobre nuestro trabajo
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">📱 Accesibilidad</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sitio web rápido, optimizado para dispositivos móviles, con soporte para modo oscuro y
              diseño responsivo
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">🎯 Apartidista</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Presentamos información objetiva sin sesgo editorial, permitiendo que los votantes
              formen sus propias opiniones
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
              📊 Datos Estructurados
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Convertimos documentos extensos en resúmenes estructurados, facilitando la comprensión
              de las posiciones de cada partido
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">¿Cómo Funciona?</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                1
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recolección de Documentos
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Descargamos los planes de gobierno oficiales directamente del sitio web del Tribunal
              Supremo de Elecciones (TSE) de Costa Rica. Estos documentos son presentados por cada
              partido político inscrito para las elecciones 2026.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                2
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Extracción de Texto
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Procesamos cada PDF para extraer el texto completo, conservando la estructura y el
              contexto de cada documento. Este proceso nos permite trabajar con el contenido sin
              perder información importante.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                3
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Análisis con IA
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Utilizamos modelos de lenguaje avanzados (LLM) para analizar cada documento a través
              de 13 categorías predefinidas de políticas públicas. Para cada categoría, el sistema
              extrae:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
              <li>Un resumen conciso de la posición del partido</li>
              <li>Propuestas clave específicas y accionables</li>
              <li>Posición ideológica en el espectro político</li>
              <li>Información sobre presupuesto o inversión mencionada</li>
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                4
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Estructuración de Datos
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Almacenamos toda la información analizada en una base de datos estructurada,
              permitiendo búsquedas rápidas, comparaciones eficientes y acceso instantáneo a la
              información.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                5
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Presentación Web
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Generamos un sitio web estático optimizado que presenta la información de manera clara
              y accesible, sin necesidad de consultar los documentos originales de 100+ páginas.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categorías Analizadas</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Analizamos cada plan de gobierno a través de 13 categorías fundamentales:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { key: 'economia', name: 'Economía y Empleo' },
            { key: 'educacion', name: 'Educación' },
            { key: 'salud', name: 'Salud' },
            { key: 'seguridad', name: 'Seguridad' },
            { key: 'medio_ambiente', name: 'Medio Ambiente' },
            { key: 'infraestructura', name: 'Infraestructura' },
            { key: 'justicia', name: 'Justicia y Derechos' },
            { key: 'politica_social', name: 'Política Social' },
            { key: 'corrupcion', name: 'Transparencia y Anticorrupción' },
            { key: 'cultura', name: 'Cultura y Deporte' },
            { key: 'tecnologia', name: 'Tecnología e Innovación' },
            { key: 'relaciones_exteriores', name: 'Relaciones Exteriores' },
            { key: 'reforma_estado', name: 'Reforma del Estado' },
          ].map((category) => (
            <div
              key={category.key}
              className="rounded-lg border border-gray-200 bg-white p-3 text-sm font-medium text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              {category.name}
            </div>
          ))}
        </div>
      </section>

      {/* Data Source */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fuente de Datos</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Todos los datos provienen del{' '}
            <strong>Tribunal Supremo de Elecciones (TSE) de Costa Rica</strong>, la autoridad
            electoral oficial del país.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Fuente oficial:</strong>{' '}
              <a
                href="https://www.tse.go.cr/2026/planesgobierno.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                https://www.tse.go.cr/2026/planesgobierno.html
              </a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Última actualización:</strong> Noviembre 2025
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Partidos analizados:</strong> 20 partidos políticos inscritos
            </p>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Limitaciones y Consideraciones
        </h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">
              ⚠️ Análisis Automatizado
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Los resúmenes y análisis son generados por inteligencia artificial. Aunque nos
              esforzamos por mantener la precisión, recomendamos consultar los documentos originales
              para decisiones importantes.
            </p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">
              📄 Documentos Completos
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Esta plataforma presenta resúmenes y puntos clave. Para obtener el contexto completo y
              detalles específicos, recomendamos leer los planes de gobierno completos disponibles
              en el sitio del TSE.
            </p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-100">
              🔄 Información Estática
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Los análisis se realizaron en un momento específico. Los partidos pueden actualizar
              sus planes o posiciones durante la campaña electoral.
            </p>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Código Abierto y Transparencia
        </h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Este proyecto es completamente de código abierto. Puede revisar nuestro código,
            metodología y datos en GitHub:
          </p>
          <a
            href="https://github.com/PiXeL16/eleccionescostarica2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Ver en GitHub
          </a>
          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Base de datos:</strong> Disponible en formato SQLite para descarga y análisis
            </p>
            <p>
              <strong>Pipeline de análisis:</strong> Código Python documentado para procesamiento de
              documentos
            </p>
            <p>
              <strong>Sitio web:</strong> Aplicación Next.js con generación estática
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contacto y Feedback</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            ¿Encontraste información incorrecta? ¿Tienes sugerencias para mejorar? Nos encantaría
            escucharte:
          </p>
          <div className="space-y-3">
            <a
              href="https://github.com/PiXeL16/eleccionescostarica2026/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-850"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                🐛 Reportar un problema
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Si encuentras datos incorrectos o errores técnicos
              </div>
            </a>
            <a
              href="https://github.com/PiXeL16/eleccionescostarica2026/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-850"
            >
              <div className="font-medium text-gray-900 dark:text-white">💡 Sugerir mejoras</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ideas para nuevas funcionalidades o mejoras
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        <p>
          Este es un proyecto independiente, apartidista y sin fines de lucro. No está afiliado con
          ningún partido político ni institución gubernamental.
        </p>
      </div>
    </div>
  );
}
