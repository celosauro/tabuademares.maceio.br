import { useState, useEffect } from 'react';
import { Waves } from '@phosphor-icons/react';
import { MonthKey, MONTHS } from './types/tide';
import { useTideData } from './hooks/useTideData';
import { isToday } from './utils/tideHelpers';
import {
  MonthSelector,
  DayCard,
  LoadingSpinner,
  ErrorMessage,
  TideTable,
  AdBanner,
} from './components';

const TODAY_SCROLL_GAP = 16;

function getElementDocumentTop(element: HTMLElement): number {
  let top = 0;
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return top;
}

function getCurrentMonthKey(): MonthKey {
  const currentMonth = new Date().getMonth();
  return MONTHS[currentMonth].key;
}

function getStoredViewMode(): 'cards' | 'table' {
  if (typeof window === 'undefined') return 'cards';
  const stored = localStorage.getItem('tideViewMode');
  return stored === 'table' ? 'table' : 'cards';
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(getCurrentMonthKey());
  const [filterLowTide, setFilterLowTide] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(getStoredViewMode);
  const { data, isLoading, error } = useTideData(selectedMonth);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tideViewMode', viewMode);
    }
  }, [viewMode]);

  const hasVeryLowTide = (tides: { height: number }[]) =>
    tides.some((tide) => tide.height < 0.2);

  const filteredDays = data?.days.filter(
    (day) => !filterLowTide || hasVeryLowTide(day.tides)
  );
  const displayedDays = filteredDays ?? [];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isLoading || error || !data) return;
    if (selectedMonth !== MONTHS[data.month - 1]?.key) return;

    const now = new Date();
    const isCurrentMonth =
      now.getFullYear() === data.year && now.getMonth() + 1 === data.month;

    if (!isCurrentMonth) return;

    const frameId = window.requestAnimationFrame(() => {
      const todayElement = document.querySelector('[data-today="true"]') as HTMLElement | null;
      if (!todayElement) return;

      const stickyHeader = document.querySelector('[data-sticky-header]') as HTMLElement | null;
      const stickyHeight = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;
      const targetScrollY = Math.max(
        0,
        getElementDocumentTop(todayElement) - stickyHeight - TODAY_SCROLL_GAP
      );
      const maxScrollY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const clampedScrollY = Math.min(Math.max(targetScrollY, 0), maxScrollY);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: clampedScrollY,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [data, error, isLoading, selectedMonth]);

  const handleMonthChange = (month: MonthKey) => {
    setSelectedMonth(month);

    if (typeof window !== 'undefined' && month !== getCurrentMonthKey()) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tide-50 to-tide-100 flex flex-col">
      <div className="sticky top-0 z-10" data-sticky-header>
        <header className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
            <div className="flex items-center gap-3">
              <Waves weight="duotone" className="w-8 h-8 md:w-10 md:h-10 text-tide-500" />
              <h1 className="text-fluid-xl font-bold text-tide-800">
                Tábua de Marés - Maceió
              </h1>
            </div>
          </div>
          <div className="h-px bg-tide-200" />
        </header>

        <div className="bg-white shadow-sm border-b border-tide-100">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              filterLowTide={filterLowTide}
              onFilterChange={setFilterLowTide}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 flex-grow w-full">
        <p className="text-fluid-sm text-tide-500 text-center mb-6 max-w-2xl mx-auto">
          Consulte os horários de preamar e baixa-mar para as praias de Maceió, Alagoas.
          Selecione o mês e visualize os dados de maré com base nas informações da Marinha do Brasil.
        </p>

        {isLoading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} />}

        {data && !isLoading && !error && (
          <>
            <AdBanner slot="3402483218" format="auto" className="mb-6" hasContent={!!data} />

            {viewMode === 'table' && (
              <h2 className="text-fluid-lg font-semibold text-tide-700 mb-4 text-center">
                {data.monthName} {data.year}
              </h2>
            )}

            <section>
              {viewMode === 'cards' && (
                <h2 className="text-fluid-lg font-semibold text-tide-700 mb-4 text-center">
                  {data.monthName} {data.year}
                </h2>
              )}

              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {displayedDays.map((day) => (
                    <DayCard
                      key={day.day}
                      day={day}
                      year={data.year}
                      month={data.month}
                      isHighlighted={isToday(data.year, data.month, day.day)}
                    />
                  ))}
                </div>
              ) : (
                <TideTable days={displayedDays} year={data.year} month={data.month} />
              )}

              {filterLowTide && displayedDays.length === 0 && (
                <p className="text-center text-tide-500 py-8">
                  Nenhum dia com maré muito baixa foi encontrado no período filtrado.
                </p>
              )}
            </section>

            <AdBanner slot="5697474060" format="auto" lazy className="mt-6" hasContent={!!data} />
          </>
        )}
      </main>

      <footer className="bg-tide-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 pb-6 border-b border-tide-700">
            <span className="text-fluid-sm text-tide-200">🎤 Consulte por voz:</span>
            <a
              href="https://www.amazon.com.br/marcelodeandrade-T%C3%A1bua-de-Mar%C3%A9s-Macei%C3%B3/dp/B0GLQDL4WY/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-medium px-4 py-2 rounded-full text-fluid-sm transition-colors"
            >
              <span>Skill Alexa</span>
              <span className="text-xs">→</span>
            </a>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
            <a href="/sobre.html" className="text-tide-200 hover:text-white text-fluid-sm transition-colors">
              Sobre
            </a>
            <a href="/faq.html" className="text-tide-200 hover:text-white text-fluid-sm transition-colors">
              FAQ
            </a>
            <a href="/contato.html" className="text-tide-200 hover:text-white text-fluid-sm transition-colors">
              Contato
            </a>
            <a href="/privacidade.html" className="text-tide-200 hover:text-white text-fluid-sm transition-colors">
              Privacidade
            </a>
            <a href="/termos.html" className="text-tide-200 hover:text-white text-fluid-sm transition-colors">
              Termos de Uso
            </a>
          </nav>

          <div className="text-center">
            <p className="text-fluid-xs text-tide-300 mb-1">
              Dados oficiais: Marinha do Brasil - Centro de Hidrografia da Marinha (CHM)
            </p>
            <p className="text-fluid-xs text-tide-400">
              © 2026 Tábua de Marés Maceió
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
