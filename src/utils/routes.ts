const SHARE_ROUTE = '/share';

export function isShareRoute(url: string): boolean {
  // O prerender pode entregar uma URL completa; o navegador entrega apenas o pathname
  const path = url.startsWith('http') ? new URL(url).pathname : url;
  return path.replace(/\/+$/, '').toLowerCase() === SHARE_ROUTE;
}
