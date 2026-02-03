import { useState, useEffect } from 'react';
import { Waves, CaretDown } from '@phosphor-icons/react';
import { MonthKey, MONTHS } from './types/tide';
import { useTideData } from './hooks/useTideData';
import { isToday } from './utils/tideHelpers';
import {
  MonthSelector,
  DayCard,
  LoadingSpinner,
  ErrorMessage,
  TideTable,
} from './components';

function getCurrentMonthKey(): MonthKey {
  const currentMonth = new Date().getMonth();
  return MONTHS[currentMonth].key;
}

function getStoredViewMode(): 'cards' | 'table' {
  const stored = localStorage.getItem('viewMode');
  return stored === 'table' ? 'table' : 'cards';
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(getCurrentMonthKey());
  const [filterLowTide, setFilterLowTide] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(getStoredViewMode);
  const { data, isLoading, error } = useTideData(selectedMonth);

  // Salva o modo de visualização no localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Filtra dias que contêm maré muito baixa (< 0.2m)
  const hasVeryLowTide = (tides: { height: number }[]) => 
    tides.some(tide => tide.height < 0.2);

  const filteredDays = data?.days.filter(day => 
    !filterLowTide || hasVeryLowTide(day.tides)
  );

  const todayCard = data?.days.find((day) =>
    isToday(data.year, data.month, day.day)
  );

  const handleMonthChange = (month: MonthKey) => {
    setSelectedMonth(month);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tide-50 to-tide-100 flex flex-col">
      {/* Header + Menu Selector - Combined sticky container */}
      <div className="sticky top-0 z-10">
        {/* Header */}
        <header className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
            <div className="flex items-center gap-3">
              <Waves weight="duotone" className="w-8 h-8 md:w-10 md:h-10 text-tide-500" />
              <h1 className="text-fluid-xl font-bold text-tide-800">
                Tábua de Marés - Maceió
              </h1>
            </div>
          </div>
          {/* Separator */}
          <div className="h-px bg-tide-200" />
        </header>

        {/* Month Selector */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-grow w-full">

        {isLoading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}

        {data && !isLoading && !error && (
          <>
            {/* Today's Card - Highlighted at Top (only in cards view) */}
            {todayCard && viewMode === 'cards' && (
              <section className="mb-6 sm:mb-8">
                <h2 className="text-fluid-lg font-semibold text-tide-700 mb-4 text-center">
                  Hoje
                </h2>
                <div className="max-w-md sm:max-w-sm mx-auto">
                  <DayCard
                    day={todayCard}
                    year={data.year}
                    month={data.month}
                    isHighlighted
                  />
                </div>
                {/* Scroll indicator - mobile only */}
                <div className="sm:hidden flex flex-col items-center mt-6 text-tide-400">
                  <span className="text-fluid-sm">Deslize para ver mais</span>
                  <CaretDown weight="bold" className="w-5 h-5 mt-1 animate-bounce" />
                </div>
              </section>
            )}

            {/* Month Title (only in table view) */}
            {viewMode === 'table' && (
              <h2 className="text-fluid-lg font-semibold text-tide-700 mb-4 text-center">
                {data.monthName} {data.year}
              </h2>
            )}

            {/* Month Days List */}
            <section>
              {viewMode === 'cards' && (
                <h2 className="text-fluid-lg font-semibold text-tide-700 mb-4 text-center">
                  {data.monthName} {data.year}
                </h2>
              )}
              
              {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredDays?.map((day) => (
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
                <TideTable
                  days={filteredDays || []}
                  year={data.year}
                  month={data.month}
                />
              )}
              
              {filterLowTide && filteredDays?.length === 0 && (
                <p className="text-center text-tide-500 py-8">
                  Nenhum dia com maré muito baixa neste mês.
                </p>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-tide-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-fluid-sm text-tide-500">
          <p>© 2026 Tábua de Marés Maceió</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
