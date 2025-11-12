// ABOUTME: Error page (500) for the Elecciones 2026 website
// ABOUTME: Displays when an unexpected error occurs

'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-600 mb-8">
          Ocurrió un error inesperado. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  )
}
