import { forwardRef } from 'react';
import { ArrowDown, ArrowUp, Waves } from '@phosphor-icons/react';
import { DayData } from '../types/tide';
import { formatHeight, getTideType, getWeekDayFull } from '../utils/tideHelpers';

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;

interface StoryCardProps {
  day: DayData;
  monthName: string;
  year: number;
}

// Dimensões e tipografia em px fixos: a captura acontece fora do viewport, onde clamp()/rem responsivos não valem
export const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  ({ day, monthName, year }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: STORY_WIDTH,
          height: STORY_HEIGHT,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        className="flex flex-col justify-between bg-gradient-to-b from-tide-50 to-tide-100 px-[72px] py-[110px]"
      >
        <div className="flex items-center justify-center gap-5">
          <Waves weight="duotone" className="text-tide-500" style={{ width: 84, height: 84 }} />
          <span className="font-bold text-tide-800" style={{ fontSize: 54 }}>
            Tábua de Marés
          </span>
        </div>

        <div className="rounded-[48px] bg-white px-[64px] py-[72px] shadow-lg">
          <div className="text-center">
            <div className="font-bold leading-none text-tide-700" style={{ fontSize: 200 }}>
              {String(day.day).padStart(2, '0')}
            </div>
            <div className="mt-6 font-bold text-tide-600" style={{ fontSize: 52 }}>
              {getWeekDayFull(day.weekDay)}
            </div>
            <div className="mt-2 text-tide-500" style={{ fontSize: 40 }}>
              {monthName} de {year}
            </div>
          </div>

          <div className="mt-[64px] space-y-[28px] border-t border-tide-100 pt-[56px]">
            {day.tides.map((tide, index) => {
              const isHigh = getTideType(tide.height) === 'high';
              const Arrow = isHigh ? ArrowUp : ArrowDown;

              return (
                <div
                  key={`${day.day}-${index}`}
                  className={`flex items-center justify-between rounded-[28px] px-[40px] py-[28px] ${
                    isHigh ? 'bg-tide-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <Arrow
                      weight={isHigh ? 'bold' : 'light'}
                      className={isHigh ? 'text-tide-800' : 'text-tide-500'}
                      style={{ width: 56, height: 56 }}
                    />
                    <span
                      className={`font-mono ${isHigh ? 'font-semibold text-tide-800' : 'text-tide-500'}`}
                      style={{ fontSize: 60 }}
                    >
                      {tide.time}
                    </span>
                  </div>
                  <span
                    className={isHigh ? 'font-semibold text-tide-800' : 'text-tide-500'}
                    style={{ fontSize: 60 }}
                  >
                    {formatHeight(tide.height)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-tide-600" style={{ fontSize: 40 }}>
          tabuademares.maceio.br
        </div>
      </div>
    );
  }
);

StoryCard.displayName = 'StoryCard';
