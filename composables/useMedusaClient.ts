import Medusa from "@medusajs/medusa-js"
import { useNuxtApp, useRuntimeConfig } from "#imports"

export function useMedusaClient(): Medusa {
  const nuxtApp = useNuxtApp()
  const config = {
    baseUrl: "http://localhost:9000",
    maxRetries: 3,
  }

  // If medusa was registered in global plugin, just return reference to it.
  if (config.global)
    return nuxtApp.$medusa as Medusa

  // Create client if it is not there.
  if (!nuxtApp._medusaClient)
    nuxtApp._medusaClient = new Medusa(config)

  return nuxtApp._medusaClient as Medusa
}
