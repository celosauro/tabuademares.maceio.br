export interface TideReading {
  time: string;
  height: number;
}

export interface DayData {
  day: number;
  weekDay: string;
  tides: TideReading[];
}

export interface TideData {
  year: number;
  month: number;
  monthName: string;
  source: string;
  extractionDate: string;
  days: DayData[];
}

export type TideType = 'high' | 'low';

export type MonthKey =
  | 'january'
  | 'february'
  | 'march'
  | 'april'
  | 'may'
  | 'june'
  | 'july'
  | 'august'
  | 'september'
  | 'october'
  | 'november'
  | 'december';

export const MONTHS: { key: MonthKey; label: string; number: number }[] = [
  { key: 'january', label: 'Janeiro', number: 1 },
  { key: 'february', label: 'Fevereiro', number: 2 },
  { key: 'march', label: 'Março', number: 3 },
  { key: 'april', label: 'Abril', number: 4 },
  { key: 'may', label: 'Maio', number: 5 },
  { key: 'june', label: 'Junho', number: 6 },
  { key: 'july', label: 'Julho', number: 7 },
  { key: 'august', label: 'Agosto', number: 8 },
  { key: 'september', label: 'Setembro', number: 9 },
  { key: 'october', label: 'Outubro', number: 10 },
  { key: 'november', label: 'Novembro', number: 11 },
  { key: 'december', label: 'Dezembro', number: 12 },
];
