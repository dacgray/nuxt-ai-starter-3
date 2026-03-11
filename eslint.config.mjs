// @ts-check
import { readFileSync } from 'node:fs'
import withNuxt from './.nuxt/eslint.config.mjs'

// Read globally registered component names from Nuxt's generated types
function getNuxtComponentNames() {
  try {
    const content = readFileSync('.nuxt/types/components.d.ts', 'utf8')
    return [...content.matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1])
  } catch {
    return []
  }
}

export default withNuxt({
  rules: {
    'vue/no-undef-components': [
      'error',
      { ignorePatterns: getNuxtComponentNames() },
    ],
  },
})
