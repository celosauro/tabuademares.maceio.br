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

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getWeekdayIndex(weekDay: string): number {
  const map: Record<string, number> = {
    'Domingo': 0,
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
  };
  return map[weekDay] ?? 0;
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

  // Calculate empty cells before first day (for desktop calendar)
  const firstDayOffset = data?.days[0] ? getWeekdayIndex(data.days[0].weekDay) : 0;
  const emptyCells = Array(firstDayOffset).fill(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-tide-50 to-tide-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 py-3 md:px-4 md:py-4">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Waves weight="duotone" className="w-[1.5em] h-[1.5em] text-tide-500" />
            <div>
              <h1 className="text-fluid-xl font-bold text-tide-800">
                Tábua de Marés
              </h1>
              <p className="text-fluid-sm text-tide-500">Maceió, AL — 2026</p>
            </div>
          </div>
          
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 py-4 md:px-4 md:py-6">
        {isLoading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}

        {data && !isLoading && !error && (
          <>
            {/* Today's Card - Highlighted at Top */}
            {todayCard && (
              <section className="mb-6 md:mb-8">
                <h2 className="text-fluid-lg font-semibold text-tide-700 mb-2 md:mb-3 text-center">
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

            {/* Month Title */}
            <section>
              <h2 className="text-fluid-lg font-semibold text-tide-700 mb-3 md:mb-4 text-center">
                {data.monthName} {data.year}
              </h2>
              
              {/* Mobile: List View */}
              <div className="block md:hidden space-y-4">
                {otherDays?.map((day) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    year={data.year}
                    month={data.month}
                  />
                ))}
              </div>

              {/* Desktop: Calendar Grid */}
              <div className="hidden md:block">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-3 mb-3">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="text-center text-fluid-sm font-semibold text-tide-600 py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-3">
                  {/* Empty cells for offset */}
                  {emptyCells.map((_, index) => (
                    <div key={`empty-${index}`} className="min-h-[120px]" />
                  ))}
                  
                  {/* Day cards */}
                  {data.days.map((day) => (
                    <DayCard
                      key={day.day}
                      day={day}
                      year={data.year}
                      month={data.month}
                      compact
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-tide-100 mt-8 md:mt-12">
        <div className="max-w-6xl mx-auto px-3 py-3 md:px-4 md:py-4 text-center text-fluid-sm text-tide-500">
          <p>© 2026 Tábua de Marés Maceió</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
