import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SSRDataProvider } from './contexts/SSRDataContext'
import { TideData, MonthKey } from './types/tide'

// Lê os dados SSR serializados no HTML pelo vite-prerender-plugin
function getSSRData(): Map<MonthKey, TideData> {
  const initialData = new Map<MonthKey, TideData>();
  
  try {
    const prerenderDataEl = document.getElementById('prerender-data');
    if (prerenderDataEl) {
      const data = JSON.parse(prerenderDataEl.textContent || '{}');
      if (data.month && data.tideData) {
        initialData.set(data.month as MonthKey, data.tideData as TideData);
        console.log('[Hydrate] Dados SSR carregados para:', data.month);
      }
    }
  } catch (e) {
    console.warn('[Hydrate] Erro ao ler dados SSR:', e);
  }
  
  return initialData;
}

const container = document.getElementById('root')!;
const ssrData = getSSRData();

// Verifica se há conteúdo pré-renderizado para hidratar
if (container.hasChildNodes() && ssrData.size > 0) {
  hydrateRoot(
    container,
    <StrictMode>
      <SSRDataProvider initialData={ssrData}>
        <App />
      </SSRDataProvider>
    </StrictMode>
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <SSRDataProvider>
        <App />
      </SSRDataProvider>
    </StrictMode>
  );
}
