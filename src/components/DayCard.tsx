import { DayData } from '../types/tide';
import { TideReading } from './TideReading';
import { isToday, getWeekDayFull } from '../utils/tideHelpers';

interface DayCardProps {
  day: DayData;
  year: number;
  month: number;
  isHighlighted?: boolean;
}

export function DayCard({ day, year, month, isHighlighted = false }: DayCardProps) {
  const today = isToday(year, month, day.day);
  const highlighted = isHighlighted || today;

  return (
    <div
      className={`
        relative rounded-xl p-4 transition-all duration-200
        ${highlighted
          ? 'bg-white ring-2 ring-tide-500 shadow-lg'
          : 'bg-white shadow-sm hover:shadow-md'
        }
      `}
    >
      {today && (
        <span className="absolute -top-2 -right-2 bg-tide-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          HOJE
        </span>
      )}
      
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${highlighted ? 'text-tide-700' : 'text-tide-600'}`}>
            {day.day}
          </span>
          <span className="text-sm text-tide-500">
            {getWeekDayFull(day.weekDay)}
          </span>
        </div>
      </div>

      <div className="space-y-1 border-t border-tide-100 pt-3">
        {day.tides.map((tide, index) => (
          <TideReading key={`${day.day}-${index}`} tide={tide} />
        ))}
      </div>
    </div>
  );
}
