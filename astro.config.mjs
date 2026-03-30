// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import auth from 'auth-astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://capp-games.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    auth(),
    sitemap({
      customPages: [
        'https://capp-games.com/',
        'https://capp-games.com/about',
        'https://capp-games.com/board-games',
        'https://capp-games.com/board-games/ransack',
        'https://capp-games.com/board-games/jelly-fuse',
        'https://capp-games.com/video-games',
        'https://capp-games.com/video-games/fantasy-arena',
      ],
    }),
  ],
});
