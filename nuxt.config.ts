// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxtjs/i18n',
  ],
  i18n: {
    defaultLocale: 'en',
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
