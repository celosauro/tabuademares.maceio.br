/**
 * Tipos para Google AdSense
 */

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export {};
