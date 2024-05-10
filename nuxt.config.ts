// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt"],
  ui: {
    icons: ["heroicons", "mdi", "svg-spinners"],
  },
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  medusa: {
    server: true,
  },
  typescript: {
    typeCheck: false,
  },
  extends: [
    ["github:davidparys/ixion/mws-form-looper"],
  ],
})
