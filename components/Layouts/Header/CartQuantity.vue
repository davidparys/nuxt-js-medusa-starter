<script lang="ts" setup>
defineProps(["quantity", "id"])
const { modifyCartQuantity, removeFromCart, isAddingToCart, cart } = useCart()
const addingToCartId = ref(null)

async function modifyQuantity(newQuantity, id, cartId) {
  addingToCartId.value = id
  await modifyCartQuantity(newQuantity, id, cartId)
  addingToCartId.value = null
}

async function removeItem(id, cartId) {
  addingToCartId.value = id
  await removeFromCart(id, cartId)
  addingToCartId.value = null
}
</script>

<template>
  <div class="flex justify-between items-center gap-x-2">
    <UButton variant="ghost" :disabled="isAddingToCart" @click="modifyQuantity(quantity - 1, id, cart?.id)">
      -
    </UButton>
    <UIcon v-if="isAddingToCart && addingToCartId === id" class="text-violet-500" name="i-svg-spinners-90-ring-with-bg" />
    <p v-else class="text-gray-500">
      Qty {{ quantity }}
    </p>
    <UButton variant="ghost" :disabled="isAddingToCart" @click="modifyQuantity(quantity + 1, id, cart?.id)">
      +
    </UButton>
  </div>
  <UButton :disabled="isAddingToCart" icon="i-mdi-trash" size="xs" variant="ghost" @click="removeItem(id, cart?.id)" />
</template>

<style lang="scss" scoped>

</style>
