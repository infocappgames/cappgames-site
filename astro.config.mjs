// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import auth from 'auth-astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://capp-games.com',
  output: 'server',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    auth(),
    sitemap({
      customPages: [
        'https://capp-games.com/',
        'https://capp-games.com/about',
        'https://capp-games.com/board-games',
        'https://capp-games.com/board-games/ransack',
        'https://capp-games.com/board-games/new-game',
        'https://capp-games.com/video-games',
        'https://capp-games.com/video-games/fantasy-arena',
        'https://capp-games.com/es/',
        'https://capp-games.com/es/about',
        'https://capp-games.com/es/board-games',
        'https://capp-games.com/es/board-games/ransack',
        'https://capp-games.com/es/board-games/new-game',
        'https://capp-games.com/es/video-games',
        'https://capp-games.com/es/video-games/fantasy-arena',
        'https://capp-games.com/fr/',
        'https://capp-games.com/fr/about',
        'https://capp-games.com/fr/board-games',
        'https://capp-games.com/fr/board-games/ransack',
        'https://capp-games.com/fr/board-games/new-game',
        'https://capp-games.com/fr/video-games',
        'https://capp-games.com/fr/video-games/fantasy-arena',
      ],
    }),
  ],
});
