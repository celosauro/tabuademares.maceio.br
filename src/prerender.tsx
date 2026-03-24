import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import App from './App';
import { SSRDataProvider } from './contexts/SSRDataContext';
import { TideData, MonthKey, MONTHS } from './types/tide';

// Importação estática dos dados de cada mês para SSR
import januaryData from './data/2026/january_2026.json';
import februaryData from './data/2026/february_2026.json';
import marchData from './data/2026/march_2026.json';
import aprilData from './data/2026/april_2026.json';
import mayData from './data/2026/may_2026.json';
import juneData from './data/2026/june_2026.json';
import julyData from './data/2026/july_2026.json';
import augustData from './data/2026/august_2026.json';
import septemberData from './data/2026/september_2026.json';
import octoberData from './data/2026/october_2026.json';
import novemberData from './data/2026/november_2026.json';
import decemberData from './data/2026/december_2026.json';

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
    days: raw.dias.map((dia) => ({
      day: dia.dia,
      weekDay: dia.diaSemana,
      tides: dia.mares.map((mare) => ({
        time: mare.hora,
        height: mare.altura,
      })),
    })),
  };
}

const rawDataByMonth: Record<MonthKey, RawTideData> = {
  january: januaryData as RawTideData,
  february: februaryData as RawTideData,
  march: marchData as RawTideData,
  april: aprilData as RawTideData,
  may: mayData as RawTideData,
  june: juneData as RawTideData,
  july: julyData as RawTideData,
  august: augustData as RawTideData,
  september: septemberData as RawTideData,
  october: octoberData as RawTideData,
  november: novemberData as RawTideData,
  december: decemberData as RawTideData,
};

function getCurrentMonthKey(): MonthKey {
  const currentMonth = new Date().getMonth();
  return MONTHS[currentMonth].key;
}

interface PrerenderData {
  url: string;
}

interface HeadElement {
  type: string;
  props: Record<string, string>;
}

interface PrerenderResult {
  html: string;
  data?: Record<string, unknown>;
  head?: {
    lang?: string;
    title?: string;
    elements?: Set<HeadElement>;
  };
}

/**
 * Função de pré-renderização executada durante o build.
 * Gera o HTML estático do componente App para ser injetado no index.html.
 * 
 * @param data - Dados da rota sendo pré-renderizada
 * @returns HTML pré-renderizado com meta tags
 */
export async function prerender(data: PrerenderData): Promise<PrerenderResult> {
  console.log(`[Prerender] Gerando HTML para: ${data.url}`);

  // Carrega os dados do mês atual para SSR
  const currentMonth = getCurrentMonthKey();
  const rawData = rawDataByMonth[currentMonth];
  const tideData = transformData(rawData);

  // Cria o mapa de dados iniciais para o SSR
  const initialData = new Map<MonthKey, TideData>();
  initialData.set(currentMonth, tideData);

  console.log(`[Prerender] Mês atual: ${currentMonth}, dados: ${tideData.monthName} ${tideData.year}`);

  // Renderiza o componente App com os dados pré-carregados
  const html = renderToString(
    <StrictMode>
      <SSRDataProvider initialData={initialData}>
        <App />
      </SSRDataProvider>
    </StrictMode>
  );

  console.log(`[Prerender] HTML gerado com ${html.length} caracteres`);

  // Serializa os dados do mês atual para o cliente
  const ssrData = {
    month: currentMonth,
    tideData: tideData,
  };

  // Retorna o HTML pré-renderizado com dados serializados
  // O plugin injeta os dados em <script type="application/json" id="prerender-data">
  return {
    html,
    data: ssrData,
    head: {
      lang: 'pt-BR',
      title: 'Tábua de Marés Maceió 2026 - Horários de Maré Alagoas',
    }
  };
}
