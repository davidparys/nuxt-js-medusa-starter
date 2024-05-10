import type { Cart, StoreCartsRes } from "@medusajs/medusa"

export function useCheckoutSession() {
  const $medusa = useMedusaClient()
  const isMutatingTheCart = useState("isAddingToCart")

  const appCart = useState<StoreCartsRes["cart"]>("cart")

  // check if the cart is not empty and there is no checkout session

  async function createCheckoutSession(cart: Cart) {
    // check if the current cart has payment sessions already created
    if (!cart)
      return
    console.log("the cart", cart)
    isMutatingTheCart.value = true
    return await $medusa.carts.createPaymentSessions(cart.id).then((res) => {
      if (res.response.status === 200) {
        isMutatingTheCart.value = false
        appCart.value = res.cart
      }
    }).catch((err) => {
      isMutatingTheCart.value = false
      console.log(err)
    })
  }
  async function setPaymentSession(providerId: string, cartId: string) {
    isMutatingTheCart.value = true
    return $medusa.carts.setPaymentSession(cartId, {
      provider_id: providerId,
    }).then((res) => {
      if (res.response.status === 200) {
        appCart.value = res.cart
        isMutatingTheCart.value = false
      }
    }).catch((err) => {
      isMutatingTheCart.value = false
      console.log(err)
    })
  }

  return {
    createCheckoutSession,
    setPaymentSession,
  }
}
