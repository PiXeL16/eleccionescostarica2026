// ABOUTME: Demonstration page for all visual enhancements
// ABOUTME: Showcases word clouds, charts, animations, and color-coded categories

import AnimatedList, { AnimatedListItem } from '@/components/AnimatedList';
import AnimatedSection from '@/components/AnimatedSection';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import CategoryBadge from '@/components/CategoryBadge';
import CategoryCoverageChart from '@/components/CategoryCoverageChart';
import PartyWordCloud from '@/components/PartyWordCloud';
import ProposalCountChart from '@/components/ProposalCountChart';
import { compareParties, getAllCategories, getAllParties, getPartyPositions } from '@/lib/database';

export const metadata = {
  title: 'Visualizaciones | Elecciones 2026',
  description: 'Visualizaciones interactivas de las propuestas de los partidos políticos',
};

export default async function VisualizacionesPage() {
  const parties = getAllParties();
  const categories = getAllCategories();

  // Get first 3 parties for comparison demos
  const demoParties = parties.slice(0, 3);
  const comparisonData = compareParties(demoParties.map((p) => p.abbreviation));

  // Get positions for first party for individual visualizations
  const firstParty = parties[0];
  const firstPartyPositions = getPartyPositions(firstParty.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Visualizaciones Interactivas
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explora las propuestas de los partidos a través de gráficos y análisis visuales
            </p>
          </div>
        </AnimatedSection>

        {/* Category Color Scheme */}
        <AnimatedSection delay={0.1}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Categorías con Código de Color
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cada categoría tiene un color único para facilitar la identificación visual
            </p>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <CategoryBadge
                  key={category.id}
                  categoryKey={category.category_key}
                  categoryName={category.name}
                  variant="solid"
                  size="md"
                  animated
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {categories.slice(0, 5).map((category) => (
                <CategoryBadge
                  key={`light-${category.id}`}
                  categoryKey={category.category_key}
                  categoryName={category.name}
                  variant="light"
                  size="md"
                />
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* Word Cloud */}
        <AnimatedSection delay={0.2}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Nube de Palabras - {firstParty.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Los términos más frecuentes en las propuestas del partido
            </p>
            <div className="flex justify-center">
              <PartyWordCloud
                positions={firstPartyPositions}
                maxWords={60}
                width={800}
                height={500}
              />
            </div>
          </section>
        </AnimatedSection>

        {/* Proposal Count Chart */}
        <AnimatedSection delay={0.3}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Propuestas por Categoría - {firstParty.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Número de propuestas específicas en cada área temática
            </p>
            <ProposalCountChart positions={firstPartyPositions} />
          </section>
        </AnimatedSection>

        {/* Category Coverage Radar */}
        <AnimatedSection delay={0.4}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cobertura de Propuestas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comparación de qué tan completas son las propuestas de cada partido por categoría
            </p>
            <CategoryCoverageChart
              parties={comparisonData.parties}
              categories={comparisonData.categories}
              positions={comparisonData.positions}
            />
          </section>
        </AnimatedSection>

        {/* Budget Comparison */}
        <AnimatedSection delay={0.5}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Comparación de Presupuestos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Presupuestos propuestos por cada partido en categorías seleccionadas
            </p>
            <BudgetComparisonChart
              parties={comparisonData.parties}
              positions={comparisonData.positions}
              categoryKey="salud"
            />
          </section>
        </AnimatedSection>

        {/* Party List with Animation */}
        <AnimatedSection delay={0.6}>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Lista Animada de Partidos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Transiciones suaves al cargar contenido
            </p>
            <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parties.slice(0, 6).map((party) => (
                <AnimatedListItem key={party.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {party.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{party.abbreviation}</p>
                  </div>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </section>
        </AnimatedSection>

        {/* Usage Instructions */}
        <AnimatedSection delay={0.7}>
          <section className="mb-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cómo Usar Estas Visualizaciones
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold mb-2">🎨 Categorías con Código de Color</h3>
                <p>
                  Cada categoría tiene un color único. Usa estos colores en toda la aplicación para
                  identificar rápidamente el área temática de las propuestas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">☁️ Nubes de Palabras</h3>
                <p>
                  Las palabras más grandes aparecen con mayor frecuencia en las propuestas. Pasa el
                  cursor sobre las palabras para ver su frecuencia exacta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📊 Gráficos Interactivos</h3>
                <p>
                  Todos los gráficos son interactivos. Pasa el cursor sobre barras, líneas o puntos
                  para ver detalles adicionales.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✨ Animaciones</h3>
                <p>
                  Las transiciones suaves mejoran la experiencia de usuario al cambiar entre vistas
                  o cargar nuevo contenido.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}
