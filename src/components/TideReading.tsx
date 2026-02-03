import { ArrowUp, ArrowDown } from '@phosphor-icons/react';
import { TideReading as TideReadingType } from '../types/tide';
import { getTideType, formatHeight } from '../utils/tideHelpers';

interface TideReadingProps {
  tide: TideReadingType;
}

export function TideReading({ tide }: TideReadingProps) {
  const tideType = getTideType(tide.height);
  const isHighTide = tideType === 'high';

  return (
    <div className="flex items-center gap-2 py-1">
      {isHighTide ? (
        <ArrowUp 
          weight="bold" 
          className="w-5 h-5 text-tide-700" 
          aria-label="Maré alta"
        />
      ) : (
        <ArrowDown 
          weight="light" 
          className="w-5 h-5 text-tide-400" 
          aria-label="Maré baixa"
        />
      )}
      <span className={`font-mono text-sm ${isHighTide ? 'text-tide-800 font-semibold' : 'text-tide-600'}`}>
        {tide.time}
      </span>
      <span className={`text-sm ${isHighTide ? 'text-tide-700 font-medium' : 'text-tide-500'}`}>
        {formatHeight(tide.height)}
      </span>
    </div>
  );
}
