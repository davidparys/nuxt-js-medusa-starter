<script setup>
import { onMounted, ref } from "vue"
import { loadStripe } from "@stripe/stripe-js"

const { cart, completeCart } = useCart()

const pk = "pk_test_51OVyNmLncb1cbHugUthXrz6PWa0OKDIJlBBI1turzUqAwSFr39HJewbg4Dilw4SoGtRR308NLb5QhaIk6iadK7lu00MYPZBxl4"

const isLoading = ref(false)
const messages = ref([])

let stripe
let elements
let paymentElement

async function mounStripe() {
  stripe = await loadStripe(pk)

  const appearance = {
    theme: "flat",
  }

  // elements = stripe.elements({ clientSecret: props?.clientSecret })
  elements = stripe.elements({ appearance, clientSecret: cart?.value.payment_session?.data?.client_secret })
  paymentElement = elements.create("payment")
  paymentElement.mount("#payment-element")
  const linkAuthenticationElement = elements.create("linkAuthentication")
  linkAuthenticationElement.mount("#link-authentication-element")

  const expressCheckoutElement = elements.create("expressCheckout")
  expressCheckoutElement.mount("#express-checkout-element")
  isLoading.value = false
}

onMounted(async () => {
  await mounStripe()
})
watch(() => cart?.value.payment_session?.data?.client_secret, async (newVal, oldVal) => {
  if (newVal !== oldVal && oldVal) {
    console.log("remounting stripe", newVal, oldVal)
    // const paymentElement = document.getElementById("payment-element")
    // if (paymentElement) {
    //   const linkAuthenticationElementInDOM = document.querySelector("#link-authentication-element")

    //   paymentElement.unmount()
    //   linkAuthenticationElementInDOM.unmount()
    // }

    await mounStripe()
  }
}, { immediate: true, deep: true })

async function handleSubmit() {
  if (isLoading.value)
    return

  isLoading.value = true

  if (!cart?.value?.payment_session?.data?.client_secret) {
    console.error("Client secret not found")
    isLoading.value = false
    return
  }

  const billingDetails = {
    name: `${cart.value?.billing_address?.first_name} ${cart.value?.billing_address?.last_name}`,
    email: cart.value?.email,
    phone: cart.value?.billing_address?.phone,
    address: {
      city: cart.value?.billing_address?.city,
      country: cart.value?.billing_address?.country,
      line1: cart.value?.billing_address?.address_1,
    },
  }
  try {
    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:8000/checkout/success?${cart?.value?.id}`,
      },
    })
  }
  catch (error) {
    console.error(error)

    isLoading.value = false
  }
}
</script>

<template>
  <main>
    <form
      id="payment-form"
      @submit.prevent="handleSubmit"
    >
      <div id="link-authentication-element" />
      <div id="payment-element" />
      <div id="express-checkout-element" />
      <button
        id="submit"
        :disabled="isLoading"
      >
        Pay now
      </button>
    </form>
  </main>
</template>
