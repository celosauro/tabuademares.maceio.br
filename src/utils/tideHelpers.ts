import { TideType } from '../types/tide';

const HIGH_TIDE_THRESHOLD = 1.2;

export function getTideType(height: number): TideType {
  return height >= HIGH_TIDE_THRESHOLD ? 'high' : 'low';
}

export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}

export function formatHeight(height: number): string {
  return `${height.toFixed(2)}m`;
}

export function getWeekDayShort(weekDay: string): string {
  const weekDayMap: Record<string, string> = {
    'Domingo': 'Dom',
    'Segunda': 'Seg',
    'Terça': 'Ter',
    'Quarta': 'Qua',
    'Quinta': 'Qui',
    'Sexta': 'Sex',
    'Sábado': 'Sáb',
  };
  return weekDayMap[weekDay] || weekDay;
}

export function getWeekDayFull(weekDay: string): string {
  const weekDayMap: Record<string, string> = {
    'Domingo': 'Domingo',
    'Segunda': 'Segunda-feira',
    'Terça': 'Terça-feira',
    'Quarta': 'Quarta-feira',
    'Quinta': 'Quinta-feira',
    'Sexta': 'Sexta-feira',
    'Sábado': 'Sábado',
  };
  return weekDayMap[weekDay] || weekDay;
}
