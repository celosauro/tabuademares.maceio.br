import { useState } from 'react';
import { Waves } from '@phosphor-icons/react';
import { MonthKey, MONTHS } from './types/tide';
import { useTideData } from './hooks/useTideData';
import { isToday } from './utils/tideHelpers';
import {
  MonthSelector,
  DayCard,
  LoadingSpinner,
  ErrorMessage,
} from './components';

function getCurrentMonthKey(): MonthKey {
  const currentMonth = new Date().getMonth();
  return MONTHS[currentMonth].key;
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(getCurrentMonthKey());
  const { data, isLoading, error } = useTideData(selectedMonth);

  const todayCard = data?.days.find((day) =>
    isToday(data.year, data.month, day.day)
  );

  const otherDays = data?.days.filter((day) =>
    !isToday(data.year, data.month, day.day)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-tide-50 to-tide-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Waves weight="duotone" className="w-8 h-8 text-tide-500" />
            <div>
              <h1 className="text-xl font-bold text-tide-800">
                Tábua de Marés
              </h1>
              <p className="text-sm text-tide-500">Maceió, AL — 2026</p>
            </div>
          </div>
          
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {isLoading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}

        {data && !isLoading && !error && (
          <>
            {/* Today's Card - Highlighted at Top */}
            {todayCard && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-tide-700 mb-3 text-center">
                  Marés de Hoje
                </h2>
                <div className="max-w-md mx-auto">
                  <DayCard
                    day={todayCard}
                    year={data.year}
                    month={data.month}
                    isHighlighted
                  />
                </div>
              </section>
            )}

            {/* Month Grid */}
            <section>
              <h2 className="text-lg font-semibold text-tide-700 mb-3">
                {data.monthName} {data.year}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherDays?.map((day) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    year={data.year}
                    month={data.month}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-tide-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-tide-500">
          <p>© 2026 Tábua de Marés Maceió</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
