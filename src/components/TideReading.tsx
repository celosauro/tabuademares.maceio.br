import { ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { TideReading as TideReadingType } from '../types/tide';
import { getTideType, formatHeight } from '../utils/tideHelpers';

interface TideReadingProps {
  tide: TideReadingType;
  compact?: boolean;
  index?: number;
}

export function TideReading({ tide, compact = false, index = 0 }: TideReadingProps) {
  const tideType = getTideType(tide.height);
  const isHighTide = tideType === 'high';
  const isEven = index % 2 === 0;

  if (compact) {
    return (
      <div className={`
        flex items-center gap-2 px-2 py-1.5 rounded-md
        ${isEven ? 'bg-tide-50' : 'bg-gray-50'}
      `}>
        {isHighTide ? (
          <ArrowUp 
            weight="bold" 
            className="w-[0.85em] h-[0.85em] text-tide-700" 
            aria-label="Maré alta"
          />
        ) : (
          <ArrowDown 
            weight="light" 
            className="w-[0.85em] h-[0.85em] text-tide-400" 
            aria-label="Maré baixa"
          />
        )}
        <span className={`font-mono text-fluid-sm ${isHighTide ? 'text-tide-800 font-semibold' : 'text-tide-500'}`}>
          {tide.time}
        </span>
        <span className={`text-fluid-sm ${isHighTide ? 'text-tide-700 font-medium' : 'text-tide-400'}`}>
          {formatHeight(tide.height)}
        </span>
      </div>
    );
  }

  // Table row format for full card mode
  return (
    <tr className={`${isEven ? 'bg-tide-50' : 'bg-gray-50'}`}>
      <td className={`py-3 pl-4 rounded-l-lg font-mono text-fluid-base ${isHighTide ? 'text-tide-800 font-semibold' : 'text-tide-600'}`}>
        {tide.time}
      </td>
      <td className={`py-3 pr-4 rounded-r-lg text-fluid-base ${isHighTide ? 'text-tide-700 font-medium' : 'text-tide-500'}`}>
        <span className="inline-flex items-center gap-2">
          {isHighTide ? (
            <ArrowUp 
              weight="bold" 
              className="w-[1em] h-[1em] text-tide-600" 
              aria-label="Maré alta"
            />
          ) : (
            <ArrowDown 
              weight="light" 
              className="w-[1em] h-[1em] text-tide-400" 
              aria-label="Maré baixa"
            />
          )}
          {formatHeight(tide.height)}
        </span>
      </td>
    </tr>
  );
}
