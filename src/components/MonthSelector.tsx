import { CalendarBlank, ListBullets } from '@phosphor-icons/react';
import { MonthKey, MONTHS } from '../types/tide';

interface MonthSelectorProps {
  selectedMonth: MonthKey;
  onMonthChange: (month: MonthKey) => void;
  filterLowTide?: boolean;
  onFilterChange?: (value: boolean) => void;
  viewMode?: 'cards' | 'table';
  onViewModeChange?: (mode: 'cards' | 'table') => void;
}

export function MonthSelector({ 
  selectedMonth, 
  onMonthChange,
  filterLowTide = false,
  onFilterChange,
  viewMode = 'cards',
  onViewModeChange
}: MonthSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthChange(e.target.value as MonthKey);
  };

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {/* Month Select */}
      <div className="flex items-center gap-3">
        <label htmlFor="month-selector" className="text-fluid-sm font-medium text-tide-600 flex items-center gap-2">
          <CalendarBlank weight="duotone" className="w-5 h-5 text-tide-500" />
          Mês
        </label>
        <div className="relative">
          <select
            id="month-selector"
            value={selectedMonth}
            onChange={handleChange}
            className="
              appearance-none
              bg-white border-2 border-tide-200 rounded-xl
              pl-4 pr-10 py-3
              text-base font-medium text-tide-700
              focus:outline-none focus:border-tide-500 focus:ring-2 focus:ring-tide-200
              hover:border-tide-300
              transition-all duration-200
              cursor-pointer
              min-w-[180px]
              [&>option]:text-base [&>option]:py-2 [&>option]:text-gray-900
            "
            style={{ fontSize: '16px' }}
          >
            {MONTHS.map((month) => (
              <option key={month.key} value={month.key}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg 
              className="w-4 h-4 text-tide-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Low Tide Filter */}
      {onFilterChange && (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={filterLowTide}
            onClick={() => onFilterChange(!filterLowTide)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-tide-200 focus:ring-offset-2
              ${filterLowTide ? 'bg-tide-500' : 'bg-tide-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
                transition-transform duration-200 ease-in-out
                ${filterLowTide ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
          <span className="text-fluid-sm font-medium text-tide-600">
            Maré baixa
          </span>
        </label>
      )}

      {/* View Mode Toggle */}
      {onViewModeChange && (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={viewMode === 'table'}
            onClick={() => onViewModeChange(viewMode === 'cards' ? 'table' : 'cards')}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-tide-200 focus:ring-offset-2
              ${viewMode === 'table' ? 'bg-tide-500' : 'bg-tide-200'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
                transition-transform duration-200 ease-in-out
                ${viewMode === 'table' ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
          <span className="text-fluid-sm font-medium text-tide-600 flex items-center gap-1">
            <ListBullets weight={viewMode === 'table' ? 'fill' : 'regular'} className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </span>
        </label>
      )}
    </div>
  );
}
