<script lang="ts" setup>
const { completeCart } = useCart()
const route = useRoute()

watch(route, () => {
  if (route?.query?.cartId)
    completeCart(route?.query?.cartId)
}, {
  deep: true,
  immediate: true,
})
</script>

<template>
  <div>
    okay then
  </div>
</template>

<style lang="scss" scoped>

</style>
