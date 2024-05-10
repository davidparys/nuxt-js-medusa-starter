<script lang="ts" setup>
const { cart } = useCart()
const isOpen = ref(false)
function totalCartQuantity() {
  return cart?.value?.items?.reduce((acc, item) => acc + item.quantity, 0)
}
</script>

<template>
  <div class="h-full flex items-center">
    <UChip size="2xl" :text="totalCartQuantity()" :show="cart?.items?.length > 0">
      <UButton variant="ghost" color="black" icon="i-mdi-basket" class="text-xl" @click="isOpen = true" />
      <span class="sr-only">items in cart, view bag</span>
    </UChip>
  </div>
  <USlideover v-model="isOpen">
    <div class="p-4 flex-1">
      <LayoutsHeaderCartItems />
    </div>
  </USlideover>
</template>

<style lang="scss" scoped>

</style>
