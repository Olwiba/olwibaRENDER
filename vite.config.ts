import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import mdx from 'fumadocs-mdx/vite';
import { resolve } from 'path';
import { createDevBannerPlugin, resolveDevPort } from '@olwiba/dx';
import { projectBanner } from './site/project.config';

export default defineConfig({
  server: {
    port: await resolveDevPort(3003),
  },
  resolve: {
    alias: {
      '@olwiba/render': resolve('./src/index.ts'),
    },
  },
  plugins: [
    createDevBannerPlugin(projectBanner),
    mdx(await import('./source.config')),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'site',
    }),
    react(),
  ],
});
