import { CalendarBlank } from '@phosphor-icons/react';
import { MonthKey, MONTHS } from '../types/tide';

interface MonthSelectorProps {
  selectedMonth: MonthKey;
  onMonthChange: (month: MonthKey) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMonthChange(e.target.value as MonthKey);
  };

  return (
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
            pl-4 pr-10 py-2.5
            text-fluid-base font-medium text-tide-700
            focus:outline-none focus:border-tide-500 focus:ring-2 focus:ring-tide-200
            hover:border-tide-300
            transition-all duration-200
            cursor-pointer
            min-w-[160px]
          "
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
  );
}
