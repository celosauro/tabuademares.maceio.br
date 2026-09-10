import { useMemo, useRef, useState } from 'react';
import { ShareNetwork, Waves } from '@phosphor-icons/react';
import { ErrorMessage, LoadingSpinner } from '../components';
import { STORY_HEIGHT, STORY_WIDTH, StoryCard } from '../components/StoryCard';
import { useTideData } from '../hooks/useTideData';
import { MONTHS } from '../types/tide';
import { generateStoryBlob, shareOrDownload } from '../utils/shareImage';

const DATA_YEAR = 2026;
const PREVIEW_WIDTH = 300;
const PREVIEW_SCALE = PREVIEW_WIDTH / STORY_WIDTH;

function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Parse manual para evitar o deslocamento de fuso do Date(string ISO)
function parseDateInputValue(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

export function SharePage() {
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => parseDateInputValue(selectedDate), [selectedDate]);
  const monthKey = parsed ? MONTHS[parsed.month - 1].key : MONTHS[0].key;
  const { data, isLoading, error } = useTideData(monthKey);

  const day = parsed && data ? data.days.find((item) => item.day === parsed.day) : undefined;
  const isSupportedYear = parsed?.year === DATA_YEAR;

  const handleShare = async () => {
    if (!storyRef.current || !parsed) return;

    setIsGenerating(true);
    setShareError(null);

    try {
      const blob = await generateStoryBlob(storyRef.current, STORY_WIDTH, STORY_HEIGHT);
      await shareOrDownload(blob, `mare-${selectedDate}.png`);
    } catch {
      setShareError('Não foi possível gerar a imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-tide-50 to-tide-100">
      <header className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Waves weight="duotone" className="w-8 h-8 text-tide-500" />
          <h1 className="text-fluid-xl font-bold text-tide-800">Compartilhar maré do dia</h1>
        </div>
        <div className="h-px bg-tide-200" />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <label htmlFor="share-date" className="block text-fluid-sm font-medium text-tide-700 mb-2">
            Escolha o dia
          </label>
          <input
            id="share-date"
            type="date"
            value={selectedDate}
            min={`${DATA_YEAR}-01-01`}
            max={`${DATA_YEAR}-12-31`}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-lg border border-tide-200 px-3 py-2 text-tide-800 focus:outline-none focus:ring-2 focus:ring-tide-500"
            style={{ fontSize: 16 }}
          />
        </div>

        {isLoading && <LoadingSpinner />}
        {error && !isLoading && <ErrorMessage message={error} />}

        {!isLoading && !error && !isSupportedYear && (
          <ErrorMessage message={`Só há dados de maré para o ano de ${DATA_YEAR}.`} />
        )}

        {!isLoading && !error && isSupportedYear && !day && (
          <ErrorMessage message="Nenhum dado de maré encontrado para o dia selecionado." />
        )}

        {!isLoading && !error && isSupportedYear && day && data && (
          <div className="flex flex-col items-center gap-6">
            <div
              className="overflow-hidden rounded-xl shadow-md"
              style={{ width: PREVIEW_WIDTH, height: STORY_HEIGHT * PREVIEW_SCALE }}
            >
              <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left' }}>
                <StoryCard ref={storyRef} day={day} monthName={data.monthName} year={data.year} />
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-full bg-tide-500 px-6 py-3 text-fluid-base font-medium text-white transition-colors hover:bg-tide-600 disabled:opacity-60"
            >
              <ShareNetwork weight="bold" className="w-5 h-5" />
              {isGenerating ? 'Gerando imagem...' : 'Compartilhar'}
            </button>

            {shareError && <p className="text-fluid-sm text-red-600">{shareError}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
