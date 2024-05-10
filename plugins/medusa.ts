import Medusa from "@medusajs/medusa-js"
import type { Cart, CartsResource } from "@medusajs/medusa-js"

export default defineNuxtPlugin((nuxtApp) => {
  const medusa = new Medusa({
    baseUrl: "http://localhost:9000",
    maxRetries: 3,
  })
  if (!nuxtApp._medusaClient)
    nuxtApp._medusaClient = medusa
  return nuxtApp._medusaClient as Medusa
  return {
    provide: {
      medusa,
    },
  }
})
