<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="bg-gray-50">
    <div class="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">
        Checkout
      </h2>
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <CheckoutConfirmOrderForm v-if="route.query?.step === '1'" />
        <CheckoutShippingForm v-if="route.query?.step === '2'" />
        <CheckoutFinalPaymentForm v-if="route.query?.step === '3'" />

        <div>
          <LayoutsHeaderCartItems />
        </div>
      </div>
    </div>
  </div>
</template>
