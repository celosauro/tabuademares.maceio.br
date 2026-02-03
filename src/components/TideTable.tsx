import { DayData } from '../types/tide';
import { isToday } from '../utils/tideHelpers';
import { ArrowUp, ArrowDown } from '@phosphor-icons/react';

interface TideTableProps {
  days: DayData[];
  year: number;
  month: number;
}

const HIGH_TIDE_THRESHOLD = 1.2;

// Abreviações para mobile
const WEEKDAY_ABBREV: Record<string, string> = {
  'Segunda': 'Seg',
  'Terça': 'Ter',
  'Quarta': 'Qua',
  'Quinta': 'Qui',
  'Sexta': 'Sex',
  'Sábado': 'Sáb',
  'Domingo': 'Dom',
};

export function TideTable({ days, year, month }: TideTableProps) {
  const formatWeekDay = (weekDay: string) => {
    if (weekDay === 'Sábado' || weekDay === 'Domingo') {
      return weekDay;
    }
    return `${weekDay}-feira`;
  };

  const formatWeekDayShort = (weekDay: string) => {
    return WEEKDAY_ABBREV[weekDay] || weekDay.slice(0, 3);
  };

  return (
    <div className="rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full bg-white border-collapse">
        <thead>
          <tr className="bg-tide-500 text-white">
            <th className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-fluid-sm font-semibold border-r border-tide-400 whitespace-nowrap">Dia</th>
            <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-fluid-sm font-semibold border-r border-tide-400 whitespace-nowrap">Semana</th>
            <th className="px-1 sm:px-3 py-2 sm:py-3 text-center text-xs sm:text-fluid-sm font-semibold" colSpan={4}>Marés</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => {
            const today = isToday(year, month, day.day);
            const isEven = index % 2 === 0;
            const baseBg = isEven ? 'bg-white' : 'bg-tide-50';
            
            return (
              <tr
                key={day.day}
                className={`
                  border-b border-tide-100 transition-colors
                  ${today 
                    ? 'bg-tide-200 ring-2 ring-inset ring-tide-500 hover:bg-tide-300' 
                    : `${baseBg} hover:bg-tide-100`
                  }
                `}
              >
                {/* Dia */}
                <td className="px-2 sm:px-3 py-2 sm:py-3 border-r border-tide-100 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm sm:text-fluid-base font-bold ${today ? 'text-tide-800' : 'text-tide-600'}`}>
                      {String(day.day).padStart(2, '0')}
                    </span>
                    {today && (
                      <span className="bg-tide-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full mt-0.5">
                        HOJE
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Dia da Semana */}
                <td className="px-2 sm:px-3 py-2 sm:py-3 border-r border-tide-100 text-left whitespace-nowrap">
                  {/* Mobile: abreviado */}
                  <span className={`sm:hidden text-xs ${today ? 'text-tide-800 font-semibold' : 'text-tide-600'}`}>
                    {formatWeekDayShort(day.weekDay)}
                  </span>
                  {/* Desktop: completo */}
                  <span className={`hidden sm:inline text-fluid-sm ${today ? 'text-tide-800 font-semibold' : 'text-tide-600'}`}>
                    {formatWeekDay(day.weekDay)}
                  </span>
                </td>
                
                {/* Marés - cada maré em uma célula */}
                {day.tides.map((tide, tideIndex) => {
                  const isHighTide = tide.height >= HIGH_TIDE_THRESHOLD;
                  return (
                    <td 
                      key={tideIndex} 
                      className="px-0.5 sm:px-2 py-1 sm:py-2 text-center border-r border-tide-100 last:border-r-0"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        {/* Hora */}
                        <div className={`
                          flex items-center gap-0.5 font-semibold text-xs sm:text-fluid-sm
                          ${isHighTide ? 'text-tide-700' : 'text-tide-500'}
                        `}>
                          {isHighTide ? (
                            <ArrowUp weight="bold" className="w-3 h-3 sm:w-4 sm:h-4 text-tide-600" />
                          ) : (
                            <ArrowDown weight="bold" className="w-3 h-3 sm:w-4 sm:h-4 text-tide-400" />
                          )}
                          <span className="text-[11px] sm:text-sm">{tide.time}</span>
                        </div>
                        {/* Altura */}
                        <div className={`
                          text-[10px] sm:text-fluid-xs font-medium
                          ${isHighTide ? 'text-tide-600' : 'text-tide-400'}
                        `}>
                          {tide.height.toFixed(2).replace('.', ',')}m
                        </div>
                      </div>
                    </td>
                  );
                })}
                {/* Células vazias para manter alinhamento se houver menos de 4 marés */}
                {Array.from({ length: Math.max(0, 4 - day.tides.length) }).map((_, i) => (
                  <td key={`empty-${i}`} className="px-0.5 sm:px-2 py-1 sm:py-2 border-r border-tide-100 last:border-r-0" />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
