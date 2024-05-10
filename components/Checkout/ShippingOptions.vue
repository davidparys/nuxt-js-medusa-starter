<script lang="ts" setup>
import type { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"

const { cart, listCartOptions, chooseShippingMethod, isAddingToCart } = useCart()
const { createCheckoutSession } = useCheckoutSession()
const router = useRouter()
const isLoaded = ref(false)
const isEmpty = ref(false)

const shippingMethods = ref<void | PricedShippingOption[]>()
console.log("cart", cart)
watch(cart, async () => {
  if (cart.value.id && !shippingMethods.value && !isLoaded.value) {
    await listCartOptions(cart.value.id).then((res) => {
      console.log("res", res)
      shippingMethods.value = res

      isLoaded.value = true
    }).catch((err) => {
      console.error(err)
      isLoaded.value = false
    })
  }
}, {
  immediate: false,
  deep: true,
})

const isDisabled = ref(false)
async function nextStep() {
  isDisabled.value = true
  await createCheckoutSession(cart.value).then((e) => {
    isDisabled.value = false
    router.replace({ query: { step: "3" } })
  }).catch((err) => {
    isDisabled.value = false
    console.error(err)
  })
}
</script>

<template>
  <div class="my-4 space-y-4">
    <template v-if="shippingMethods && isLoaded">
      <div
        v-for="option in shippingMethods" :key="option.id" v class="rounded-md  bg-neutral- 00/80   px-3 py-3 ring-1 hover:cursor-pointer"
        :class=" {
          'ring-2  ring-violet-600 border border-neutral-300 pointer-events-none': option.id === cart?.shipping_methods[0]?.shipping_option_id,

          'cursor-wait pointer-events-none': isAddingToCart || isDisabled,
        }"
        @click="chooseShippingMethod(option?.id, cart?.id)"
      >
        <p class="font-semibold text-sm">
          {{ option.name }}
          {{ option.id }}
        </p>
        <p class="font-medium  text-xs mt-2 opacity-70">
          {{ option?.metadata?.shipping_time }} business days
        </p>
        <p class="font-semibold text-sm mt-4">
          {{ option?.price_incl_tax / 100 }} PLN
        </p>
      </div>
    </template>

    <template v-else>
      <USkeleton class="w-full rounded-md h-[300px]" />
    </template>
    <template v-if="isEmpty">
      Your cart is empty.
    </template>
  </div>
  <UButton v-if="!isEmpty" :disabled="isDisabled || cart?.shipping_methods.length === 0" @click=" nextStep()">
    Next Step
  </UButton>
</template>

<style lang="scss" scoped>

</style>
