import { useState, useEffect } from 'react';
import { TideData, DayData, MonthKey } from '../types/tide';

interface RawTideData {
  ano: number;
  mes: number;
  mesNome: string;
  fonte: string;
  dataExtracao: string;
  dias: {
    dia: number;
    diaSemana: string;
    mares: {
      hora: string;
      altura: number;
    }[];
  }[];
}

function transformData(raw: RawTideData): TideData {
  return {
    year: raw.ano,
    month: raw.mes,
    monthName: raw.mesNome,
    source: raw.fonte,
    extractionDate: raw.dataExtracao,
    days: raw.dias.map((dia): DayData => ({
      day: dia.dia,
      weekDay: dia.diaSemana,
      tides: dia.mares.map((mare) => ({
        time: mare.hora,
        height: mare.altura,
      })),
    })),
  };
}

const dataLoaders: Record<MonthKey, () => Promise<{ default: RawTideData }>> = {
  january: () => import('../data/2026/january_2026.json'),
  february: () => import('../data/2026/february_2026.json'),
  march: () => import('../data/2026/march_2026.json'),
  april: () => import('../data/2026/april_2026.json'),
  may: () => import('../data/2026/may_2026.json'),
  june: () => import('../data/2026/june_2026.json'),
  july: () => import('../data/2026/july_2026.json'),
  august: () => import('../data/2026/august_2026.json'),
  september: () => import('../data/2026/september_2026.json'),
  october: () => import('../data/2026/october_2026.json'),
  november: () => import('../data/2026/november_2026.json'),
  december: () => import('../data/2026/december_2026.json'),
};

interface UseTideDataReturn {
  data: TideData | null;
  isLoading: boolean;
  error: string | null;
}

export function useTideData(month: MonthKey): UseTideDataReturn {
  const [data, setData] = useState<TideData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const loader = dataLoaders[month];
        const module = await loader();
        
        if (!cancelled) {
          const transformed = transformData(module.default);
          setData(transformed);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Falha ao carregar dados da tábua de marés. Tente novamente.');
          console.error('Error loading tide data:', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [month]);

  return { data, isLoading, error };
}
