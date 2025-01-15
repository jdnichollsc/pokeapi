/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/state',
  plugins: [angular(), nxViteTsPaths()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/state',
      provider: 'v8'
    },
    server: {
      deps: {
        inline: [
          '@angular/platform-browser-dynamic',
          '@angular/platform-browser',
          '@angular/core',
          '@angular/common',
          'zone.js',
          'zone.js/testing',
          '@analogjs/vite-plugin-angular'
        ]
      }
    }
  }
});
