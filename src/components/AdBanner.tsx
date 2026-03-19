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
}

// Publisher ID do AdSense - substituir pelo ID real após aprovação
const ADSENSE_CLIENT = 'ca-pub-3884485145925759';

/**
 * Componente de banner de anúncio do Google AdSense
 * 
 * Em ambiente de desenvolvimento, exibe um placeholder visual.
 * Em produção, carrega o anúncio real do AdSense.
 */
export function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  lazy = false,
  className = '',
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isLoaded, setIsLoaded] = useState(false);

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
      { rootMargin: '200px' } // Carrega 200px antes de entrar na viewport
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isVisible]);

  // Inicializar anúncio quando visível
  useEffect(() => {
    if (!isVisible || isLoaded) return;

    // Em desenvolvimento, não carrega o SDK real
    if (import.meta.env.DEV) {
      setIsLoaded(true);
      return;
    }

    // Aguarda layout estar completo antes de inicializar
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryInit = () => {
      attempts++;
      
      if (!adRef.current) return;
      
      // Verifica se o elemento tem dimensões válidas
      const { offsetWidth } = adRef.current;
      
      if (offsetWidth > 0 && window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
          setIsLoaded(true);
        } catch (error) {
          console.warn('AdSense: erro ao carregar anúncio', error);
        }
      } else if (attempts < maxAttempts) {
        // Tenta novamente no próximo frame
        requestAnimationFrame(tryInit);
      }
    };

    // Inicia após o primeiro paint
    requestAnimationFrame(tryInit);
  }, [isVisible, isLoaded]);

  // Classes de altura mínima para evitar layout shift
  const heightClasses = {
    auto: 'min-h-[100px] sm:min-h-[90px]',
    horizontal: 'min-h-[90px]',
    vertical: 'min-h-[250px]',
    rectangle: 'min-h-[250px]',
  };

  // Anúncio real em produção
  return (
    <div
      ref={adRef}
      className={`
        ${heightClasses[format]}
        w-full
        ${className}
      `}
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
