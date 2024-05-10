<script lang="ts" setup>
const { cart, isAddingToCart } = useCart()
console.log("cart", cart)
const { setPaymentSession, createCheckoutSession } = useCheckoutSession()

async function setSession(providerId: string, cartId: string) {
  await setPaymentSession(providerId, cartId).then((e) => {
    console.log("set session", e)
  }).catch(async (err) => {
    console.log("regenerating", err)
    // regenerate the session,
    await createCheckoutSession(cart.value)
    // or show an error message
    console.error(err)
  })
}

const includedType = ["stripe", "stripe-przelewy24", "stripe-blik"]
const prettyProviderNames = {
  "stripe": "Karta",
  "stripe-przelewy24": "Przelewy 24",
  "stripe-blik": "Blik",
}
</script>

<template>
  <div class="space-y-5">
    <template v-if="cart?.payment_sessions && cart.payment_sessions.length > 0">
      <div
        v-for="option in cart.payment_sessions.filter((e) => includedType.includes(e.provider_id)).sort((a, b) => a.provider_id.localeCompare(b.provider_id))" :key="option.id" class="relative rounded-md bg-neutral-100/80 px-3 py-3 ring-1 hover:cursor-pointer"
        :class=" {
          'ring-2  ring-violet-600 border border-neutral-300 pointer-events-none': cart?.payment_session && cart?.payment_session.id === option.id,
          'ring-neutral-200': cart?.payment_session && cart?.payment_session.id !== option.id,
          'pointer-events-none': isAddingToCart,
        }"
        @click="setSession(option?.provider_id, cart?.id)"
      >
        <div v-if="isAddingToCart" class="absolute rounded-full bg-violet-500 h-5 w-5 top-5 right-3 flex items-center text-white p-1">
          <UIcon name="i-svg-spinners-90-ring-with-bg" />
        </div>
        <div class="text-xl">
          <p>
            {{ prettyProviderNames[option.provider_id] }}
          </p>
        </div>

        <div class="font-extrabold">
          {{ option.amount / 100 }} PLN
        </div>
      </div>
    </template>
    <template v-if="cart?.payment_session && cart?.payment_session?.data?.client_secret">
      <LazyCheckoutStripePaymentElement />
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>
