import { useStorage } from "@vueuse/core"
import type { StoreCartsRes } from "@medusajs/medusa"

interface Product {
  variant_id: string
  quantity: number
}

/**
 * Custom composable function for managing the cart state.
 * This function provides methods for fetching, adding, and removing items from the cart.
 *
 * @returns An object containing the cart state and methods for interacting with the cart.
 *
 */

export function useCart() {
  const cart = useState<StoreCartsRes["cart"]>("cart")
  const cartId = useStorage("cartId", null)
  const isAddingToCart = useState("isAddingToCart", () => false)
  const medusa = useMedusaClient()

  async function createCart() {
    return await medusa.carts.create({
      country_code: "pl",
      region_id: "reg_01HTQACBCXDQ1QFSPY6ASP65S9",
    }).then((res) => {
      if (res.response.status === 200) {
        console.log("cart created", res.cart)
        cartId.value = res.cart.id
        cart.value = res.cart
        return res.cart
      }
    }).catch((err) => {
      console.error("Error creating cart", err)
    },
    )
  }

  async function getCart() {
    return await medusa.carts.retrieve(cartId?.value)
      .then((res) => {
        if (res.response.status === 200)
          return cart.value = res.cart

        // cart does not exist, create a new one
        else
          return createCart()
      })
  }

  async function addToCart(product_variant_id: Product["variant_id"], quantity: Product["quantity"], cartId: string) {
    isAddingToCart.value = true
    async function addLineItem(cartId, product_variant_id, quantity) {
      const data = await medusa.carts.lineItems.create(cartId, {
        variant_id: product_variant_id,
        quantity: quantity || 1,
      })
      return cart.value = data.cart
    }

    if (!cartId) {
      console.log("Cart does not exist, creating a new cart")
      await createCart().then(async (res) => {
        if (res && res.id)
          await addLineItem(res?.id, product_variant_id, quantity)
      })
    }
    else {
      await addLineItem(cartId, product_variant_id, quantity)
    }
    isAddingToCart.value = false
  }

  async function removeFromCart(lineID: string, cartId: string) {
    isAddingToCart.value = true
    await medusa.carts.lineItems.delete(cartId, lineID).then((res) => {
      if (res.response.status === 200) {
        isAddingToCart.value = false
        return cart.value = res.cart
      }
    }).catch((err) => {
      console.error("Error removing from cart", err)
      isAddingToCart.value = false
    })
  }

  async function modifyCartQuantity(quantity, lineID, cartId) {
    isAddingToCart.value = true

    await medusa.carts.lineItems.update(cartId, lineID, {
      quantity,
    }).then((res) => {
      if (res.response.status === 200) {
        isAddingToCart.value = false
        return cart.value = res.cart
      }
    }).catch((err) => {
      console.error("Error updating cart", err)
      isAddingToCart.value = false
    })
  }

  async function updateCart(cartData: object) {
    isAddingToCart.value = true
    if (!cart?.value?.id)
      throw new Error("Cart does not exist, this should not happen.")

    const updatedCart = await medusa.carts.update(cart?.value.id, cartData)
    isAddingToCart.value = false
    return cart.value = updatedCart.cart
  }

  // This function will list the available shipping options for the cart
  async function listCartOptions(cartId: string) {
    if (!cartId) {
      console.error("Cart ID is missing")
      return
    }

    return await medusa.shippingOptions.listCartOptions(cartId).then((res) => {
      console.log("listing", res)
      if (res.response.status === 200)
        return res.shipping_options
    }).catch((err) => {
      console.error("Error listing cart options", err)
    })
  }

  // the customer chooses the shipping method
  async function chooseShippingMethod(shippingMethodId: string, cartId: string) {
    if (!cartId) {
      console.error("Cart ID is missing")
      return
    }
    isAddingToCart.value = true
    return await medusa.carts.addShippingMethod(cartId, {
      option_id: shippingMethodId,
    }).then((res) => {
      if (res.response.status === 200) {
        isAddingToCart.value = false
        return cart.value = res.cart
      }
    }).catch((err) => {
      console.error("Error choosing shipping method", err)
      isAddingToCart.value = false
    })
  }
  function resetCart() {
    cart.value = null
    cartId.value = null
  }

  async function completeCart(cartId) {
    if (!cartId)
      throw new Error("[completeCart] Cart does not exist, this should not happen.")

    return await medusa.carts.complete(cartId).then((res) => {
      resetCart()
      console.log("completed", res)
    }).catch((err) => {
      console.error("error", err)
    })
  }

  // watch if the cart storage exists (let's say we just loaded the page and the cart is not in the storage yet)
  watch(cartId, (newVal) => {
    if (typeof newVal === "string" && newVal.length > 0)
      getCart()
  }, {
    deep: true,
    immediate: true,
  })
  return {
    /**
     * The cart fetched from Medusa, it's stored in a global state and can be reused throughout the whole Nuxt App.
     */
    cart,
    /**
     * Global state to indicate if something is being added to the cart.
     * Useful when Medusa is slow.
     * @returns A boolean indicating if something is being mutated on the cart.
     */
    isAddingToCart,
    /**
     * Fetches the content of the cart from Medusa.
     * @returns A promise that resolves to the fetched cart.
     */
    getCart,
    /**
     * Adds a product variant with a specified quantity to the cart.
     * @param product - The product variant to add to the cart.
     * @returns A promise that resolves to the updated cart.
     */
    addToCart,
    /**
     * Removes a product variant from the cart.
     * @param lineID - The ID of the line item to remove from the cart.
     * @returns A promise that resolves to the updated cart.
     */
    removeFromCart,
    /**
     * Updates the cart with the provided data.
     * @param cartData - The data to update the cart with.
     * @returns A promise that resolves to the updated cart.
     */
    updateCart,
    /**
     * Lists the available shipping options for the cart.
     * @returns A promise that resolves to the available shipping options.
     */
    listCartOptions,
    /**
     * Chooses a shipping method for the cart.
     * @param shippingMethodId - The ID of the shipping method to choose.
     * @returns A promise that resolves to the chosen shipping method.
     */
    chooseShippingMethod,
    /**
     * Completes the cart.
     * @returns A promise that resolves when the cart is completed.
     */
    completeCart,
    /**
     * Modifies the quantity of a product variant in the cart.
     * @param quantity - The new quantity of the product variant.
     * @param lineID - The ID of the line item to modify.
     * @param cartId - The ID of the cart to modify.
     */
    modifyCartQuantity,
  }
}
