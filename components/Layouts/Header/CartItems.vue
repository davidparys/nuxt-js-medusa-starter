<script setup lang="ts">
const { cart } = useCart()
const products = computed(() => {
  const sortedProducts = cart?.value?.items?.map((e) => {
    return {
      id: e.id,
      name: e.title,
      description: e.description,
      imageSrc: e.thumbnail,
      href: "#",
      quantity: e.quantity,
      price: `${e.unit_price / 100}`,
      variant_id: e.variand_id,
    }
  })

  return sortedProducts?.sort((a, b) => {
    if (a.name === b.name)
      return a.description.localeCompare(b.description)

    return a.name.localeCompare(b.name)
  })
})

const isCartEmpty = computed(() => !products?.value || products?.value?.length === 0)
const open = ref(true)
</script>

<template>
  <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
    <div class="flex items-start justify-between">
      Shopping cart

      <div class="ml-3 flex h-7 items-center">
        <button type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500" @click="open = false">
          <span class="absolute -inset-0.5" />
          <span class="sr-only">Close panel</span>
        </button>
      </div>
    </div>

    <div class="mt-8">
      <div class="flow-root">
        <ul role="list" class="-my-6 divide-y divide-gray-200">
          <template v-if="products && products.length > 0">
            <li v-for="product in products" :key="product.id" class="flex py-6">
              <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center">
              </div>

              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <a :href="product.href">{{ product.name }}</a>
                    </h3>
                    <p class="ml-4">
                      {{ product.price }}
                    </p>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ product.description }}
                  </p>
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <LayoutsHeaderCartQuantity :id="product?.id" :quantity="product?.quantity" />
                </div>
              </div>
            </li>
          </template>

          <template v-else>
            <li class="py-6 flex justify-center">
              <p class="text-sm text-gray-500">
                No items in your cart
              </p>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>

  <div v-if="!isCartEmpty" class="border-t border-gray-200 px-4 py-6 sm:px-6">
    <div class="flex justify-between text-base font-medium text-gray-900">
      <p>Subtotal</p>
      <p>{{ cart.region.currency_code }} {{ cart.subtotal / 100 }}</p>
    </div>
    <p class="mt-0.5 text-sm text-gray-500">
      Shipping and taxes calculated at checkout.
    </p>
    <div class="mt-6">
      <NuxtLink href="/checkout?step=1" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
        Checkout
      </NuxtLink>
    </div>
    <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
      <p>
        or{{ ' ' }}
        <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500">
          Continue Shopping
          <span aria-hidden="true"> &rarr;</span>
        </button>
      </p>
    </div>
  </div>
</template>
