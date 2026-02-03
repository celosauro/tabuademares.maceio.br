import { MonthKey, MONTHS } from '../types/tide';

interface MonthSelectorProps {
  selectedMonth: MonthKey;
  onMonthChange: (month: MonthKey) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-2 min-w-max px-1">
        {MONTHS.map((month) => {
          const isSelected = month.key === selectedMonth;
          return (
            <button
              key={month.key}
              onClick={() => onMonthChange(month.key)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${isSelected
                  ? 'bg-tide-500 text-white shadow-md'
                  : 'bg-tide-100 text-tide-700 hover:bg-tide-200'
                }
              `}
            >
              {month.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
