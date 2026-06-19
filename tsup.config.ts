import { defineConfig } from 'tsup';
import { createTsupBannerHook } from '@olwiba/dx';
import { projectBanner } from './site/project.config';

export default defineConfig({
  entry: ['src/index.ts', 'src/pro.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@olwiba/cn', '@olwiba/ui', '@olwiba/ui-pro', '@json-render/core', '@json-render/react', 'zod'],
  sourcemap: true,
  treeshake: true,
  onSuccess: createTsupBannerHook(projectBanner),
});
