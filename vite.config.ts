import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { VitePWA } from 'vite-plugin-pwa';
import { apiDevServer } from './api/dev-server-plugin.ts';

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [
      apiDevServer(),
      react(),
      VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo-bna.png',
        'bg-home.png',
        'bg-game.png',
        'fonts/Kievit-Bold.ttf',
        'fonts/Kievit-Medium.ttf',
        'fonts/Kievit-Black.ttf',
      ],
      manifest: {
        name: 'BNA — Turismo Argentino con IA',
        short_name: 'Turismo AR',
        description: 'Generador de postales turísticas argentinas con IA de Banco Nación',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'fullscreen',
        display_override: ['fullscreen'],
        orientation: 'portrait',
        background_color: '#003b70',
        theme_color: '#003b70',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff,woff2,ttf}'],
        maximumFileSizeToCacheInBytes: 40 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/descargar/],
      },
      devOptions: {
        enabled: false,
        type: 'module',
      },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  };
});
