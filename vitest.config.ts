import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    environmentMatchGlobs: [
      ['tests/schemas.test.ts', 'node'],
      ['tests/generator.test.ts', 'node'],
      ['tests/export.test.ts', 'node'],
      ['tests/guardrails.test.ts', 'node'],
      ['tests/errors.test.ts', 'node'],
      ['tests/briefTemplates.test.ts', 'node'],
      ['tests/templates.test.ts', 'node'],
    ],
     pool: 'threads',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/', 'tests/', 'dist/', '**/*.test.{ts,tsx}'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
