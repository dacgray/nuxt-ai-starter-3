import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['**/*.unit.test.ts'],
          exclude: ['node_modules/**'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['**/*.cest.test.ts'],
          exclude: ['node_modules/**'],
          environment: 'nuxt',
          setupFiles: ['test/nuxt/setup.ts'],
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
      {
        test: {
          name: 'e2e',
          include: ['**/*.e2e.test.ts'],
          exclude: ['node_modules/**'],
          environment: 'node',
        },
      },
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
    },
  },
})
