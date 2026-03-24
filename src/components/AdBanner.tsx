import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  /** ID do slot de anúncio do AdSense */
  slot: string;
  /** Formato do anúncio */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  /** Responsivo - permite ao Google otimizar o tamanho */
  responsive?: boolean;
  /** Lazy loading - carrega apenas quando visível */
  lazy?: boolean;
  /** Classes CSS adicionais para o container */
  className?: string;
  /** Indica se há conteúdo carregado na página (evita anúncios em telas vazias) */
  hasContent?: boolean;
}

// Publisher ID do AdSense - substituir pelo ID real após aprovação
const ADSENSE_CLIENT = 'ca-pub-3884485145925759';

/**
 * Componente de banner de anúncio do Google AdSense
 * 
 * Em ambiente de desenvolvimento, exibe um placeholder visual.
 * Em produção, carrega o anúncio real do AdSense.
 * Não ocupa espaço até que o anúncio seja carregado.
 * 
 * IMPORTANTE: Para conformidade com políticas do Google AdSense,
 * este componente só renderiza anúncios quando há conteúdo real na página.
 */
export function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  lazy = false,
  className = '',
  hasContent = true,
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [adStatus, setAdStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Lazy loading com IntersectionObserver
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible]);

  // Inicializar anúncio quando visível
  useEffect(() => {
    if (!isVisible || adStatus !== 'idle') return;

    // Em desenvolvimento, não carrega o SDK real
    if (import.meta.env.DEV) {
      setAdStatus('loaded');
      return;
    }

    setAdStatus('loading');

    // Aguarda layout estar completo antes de inicializar
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryInit = () => {
      attempts++;
      
      if (!adRef.current) return;
      
      const { offsetWidth } = adRef.current;
      
      if (offsetWidth > 0 && window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
          setAdStatus('loaded');
        } catch (error) {
          console.warn('AdSense: erro ao carregar anúncio', error);
          setAdStatus('error');
        }
      } else if (attempts < maxAttempts) {
        requestAnimationFrame(tryInit);
      } else {
        setAdStatus('error');
      }
    };

    requestAnimationFrame(tryInit);
  }, [isVisible, adStatus]);

  // Em desenvolvimento, não renderiza nada
  if (import.meta.env.DEV) {
    return null;
  }

  // Não renderiza anúncios se não houver conteúdo na página (política AdSense)
  if (!hasContent) {
    return null;
  }

  // Não renderiza nada se houver erro
  if (adStatus === 'error') {
    return null;
  }

  // Container do anúncio - sem altura mínima, deixa AdSense definir
  return (
    <div
      ref={adRef}
      className={`w-full ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
