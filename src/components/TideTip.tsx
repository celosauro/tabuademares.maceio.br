import { TideReading } from '../types/tide';
import { formatHeight } from '../utils/tideHelpers';

interface TideTipProps {
  todayTides: TideReading[];
}

export const TideTip = ({ todayTides }: TideTipProps) => {
  if (todayTides.length === 0) return null;

  const lowestTide = todayTides.reduce((min, tide) => (tide.height < min.height ? tide : min));

  let tip: string;
  let link: { href: string; label: string };

  if (lowestTide.height < 0.2) {
    tip = `Hoje a maré mais baixa é às ${lowestTide.time} (${formatHeight(lowestTide.height)}) — condição ideal para visitar as piscinas naturais de Maceió.`;
    link = { href: '/piscinas-naturais-maceio.html', label: 'Ver guia de piscinas naturais' };
  } else if (lowestTide.height < 1.2) {
    tip = `Hoje a maré mais baixa é às ${lowestTide.time} (${formatHeight(lowestTide.height)}) — bom momento para pescar próximo aos bancos de areia.`;
    link = { href: '/pesca-mares-alagoas.html', label: 'Dicas de pesca por maré' };
  } else {
    tip = `Hoje a maré mais baixa do dia é às ${lowestTide.time} (${formatHeight(lowestTide.height)}) — as praias devem manter boa faixa de areia ao longo do dia.`;
    link = { href: '/guia-praias-maceio.html', label: 'Guia das praias de Maceió' };
  }

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-6 text-center max-w-2xl mx-auto">
      <p className="text-fluid-sm text-tide-700">🌊 {tip}</p>
      <a
        href={link.href}
        className="inline-block mt-2 text-fluid-sm font-medium text-sky-600 hover:text-sky-700 underline"
      >
        {link.label} →
      </a>
    </div>
  );
};
