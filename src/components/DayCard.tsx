import { DayData } from '../types/tide';
import { TideReading } from './TideReading';
import { isToday } from '../utils/tideHelpers';

interface DayCardProps {
  day: DayData;
  year: number;
  month: number;
  isHighlighted?: boolean;
  compact?: boolean;
}

export function DayCard({ day, year, month, isHighlighted = false, compact = false }: DayCardProps) {
  const today = isToday(year, month, day.day);
  const highlighted = isHighlighted || today;

  // Compact mode for desktop calendar view only
  if (compact) {
    return (
      <div
        className={`
          relative rounded-lg p-4 min-h-[160px] transition-all duration-200
          ${highlighted
            ? 'bg-white ring-2 ring-tide-500 shadow-lg'
            : 'bg-white shadow-sm hover:shadow-md'
          }
        `}
      >
        {today && (
          <span className="absolute -top-1.5 -right-1.5 bg-tide-500 text-white text-fluid-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            HOJE
          </span>
        )}
        
        <div className="mb-4">
          <span className={`text-fluid-xl font-bold ${highlighted ? 'text-tide-700' : 'text-tide-600'}`}>
            {String(day.day).padStart(2, '0')}
          </span>
        </div>

        <div className="space-y-2">
          {day.tides.map((tide, index) => (
            <TideReading key={`${day.day}-${index}`} tide={tide} compact index={index} />
          ))}
        </div>
      </div>
    );
  }

  // Full card mode - mobile list view and highlighted today card
  return (
    <div
      className={`
        relative rounded-xl p-5 md:p-6 transition-all duration-200
        ${highlighted
          ? 'bg-white ring-2 ring-tide-500 shadow-lg'
          : 'bg-white shadow-sm hover:shadow-md'
        }
      `}
    >
      {today && (
        <span className="absolute -top-2 -right-2 bg-tide-500 text-white text-fluid-sm font-bold px-2 py-1 rounded-full shadow-md">
          HOJE
        </span>
      )}
      
      <div className="mb-3 md:mb-4">
        <div className="flex items-baseline gap-3">
          <span className={`text-fluid-2xl font-bold ${highlighted ? 'text-tide-700' : 'text-tide-600'}`}>
            {String(day.day).padStart(2, '0')}
          </span>
          <span className={`text-fluid-base font-bold ${highlighted ? 'text-tide-700' : 'text-tide-600'}`}>
            {day.weekDay === 'Sábado' || day.weekDay === 'Domingo' ? day.weekDay : `${day.weekDay}-feira`}
          </span>
        </div>
      </div>

      <div className="border-t border-tide-100 pt-4 md:pt-5">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-fluid-xs text-tide-500">
              <th className="text-left font-medium pb-2">Hora</th>
              <th className="text-left font-medium pb-2">Altura</th>
            </tr>
          </thead>
          <tbody>
            {day.tides.map((tide, index) => (
              <TideReading key={`${day.day}-${index}`} tide={tide} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
