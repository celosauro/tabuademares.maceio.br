import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      // Seletor do elemento onde o React renderiza
      renderTarget: '#root',
      // Caminho absoluto para o script de prerender
      prerenderScript: path.resolve(__dirname, 'src/prerender.tsx'),
      // Rotas adicionais para pré-renderizar
      additionalPrerenderRoutes: ['/'],
    }),
  ],
  base: '/',
})
