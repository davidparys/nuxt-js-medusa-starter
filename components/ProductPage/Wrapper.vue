<script setup lang="ts">
// Medusa
const router = useRoute()
const productId = router.params.id as string

const $medusa = useMedusaClient()
const { data: product, pending, error } = await useAsyncData(`fetch-product-${productId}`, async () => {
  const data = await $medusa.products.list({ handle: productId, limit: 1 })
  const product = data.products[0]
  return product
})
const selectedProductVariant = ref<string | null>(null)
const selectedVariantDetails = computed(() => product.value?.variants.find(e => e.id === selectedProductVariant.value))

const canBeOrdered = computed(() => {
  return selectedVariantDetails.value?.inventory_quantity > 0 || selectedVariantDetails.value?.allow_backorder
})
const outOfStock = computed(() => selectedProductVariant.value && !canBeOrdered.value)

// Add to bag action
const { addToCart, isAddingToCart, cart } = useCart()
</script>

<template>
  <div class="bg-white">
    <main class="pt-10 sm:pt-16">
      <nav aria-label="Breadcrumb">
        <ol role="list" class="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <li
            v-for="breadcrumb in product?.categories?.map((e) => {
              return {
                id: e.id,
                name: e.name,
                href: `/category/${e.id}`,
              }
            })" :key="breadcrumb.id"
          >
            <div class="flex items-center">
              <a :href="breadcrumb.href" class="mr-2 text-sm font-medium text-gray-900">{{ breadcrumb.name }}</a>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" class="h-5 w-4 text-gray-300">
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </div>
          </li>
          <li class="text-sm">
            <p aria-current="page" class="font-medium text-gray-500 hover:text-gray-600">
              {{ product?.title }}
            </p>
          </li>
        </ol>
      </nav>

      <!-- Image gallery -->
      <div class="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        <div class="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
          <img :src="product?.images?.[0]?.url" :alt="product?.images?.[0]?.metadata" class="h-full w-full object-cover object-center">
        </div>
        <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img :src="product?.images?.[0]?.url" :alt="product?.images?.[0]?.metadata" class="h-full w-full object-cover object-center">
          </div>
          <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img :src="product?.images?.[0]?.url" :alt="product?.images?.[0]?.metadata" class="h-full w-full object-cover object-center">
          </div>
        </div>
        <div class="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
          <img :src="product?.images?.[0]?.url" :alt="product?.images?.[0]?.metadata" class="h-full w-full object-cover object-center">
        </div>
      </div>

      <!-- Product info -->
      <div class="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
        <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {{ product?.title }}
          </h1>
        </div>

        <!-- Options -->
        <div class="mt-4 lg:row-span-3 lg:mt-0">
          <h2 class="sr-only">
            Product information
          </h2>
          <p class="text-3xl tracking-tight text-gray-900">
            {{ product?.variants.find(e => e.id === selectedProductVariant)?.prices[0].amount / 100 || product?.variants[0].prices[0].amount / 100 }} {{ product?.variants[0].prices[0].currency_code.toUpperCase() }}
            <!-- {{ selectedProductVariant?.prices || product?.variants[0].prices[0].amount / 100 }} -->
          </p>

          <div class="mt-10">
            <!-- Sizes -->
            <div class="mt-10 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">
                  Variants
                </h3>
              </div>
              <USelectMenu
                v-model="selectedProductVariant"
                :disabled="isAddingToCart"
                color="white"
                value-attribute="id"
                option-attribute="label"
                :options="product?.variants.map((e) => {
                  return {
                    id: e.id,
                    label: e.title,

                  }
                })"
              />
              <div class="text-sm font-medium text-gray-900">
                <template v-if="selectedVariantDetails?.allow_backorder">
                  Available on backorder
                </template>
                <template v-else-if="canBeOrdered">
                  Limited Stock
                </template>
                <template v-else-if="outOfStock">
                  Out of stock :(
                </template>
              </div>
            </div>
            <UButton :loading="isAddingToCart" :disabled="!selectedProductVariant || !canBeOrdered" size="xl" color="fuchsia" class="mt-10 " block @click=" addToCart(selectedProductVariant?.toString(), 1, cart?.id)">
              Add to bag
            </UButton>
          </div>
        </div>

        <div class="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
          <!-- Description and details -->
          <div>
            <h3 class="sr-only">
              Description
            </h3>

            <div class="space-y-6">
              <p class="text-base text-gray-900">
                {{ product.description }}
              </p>
            </div>
          </div>

          <section aria-labelledby="shipping-heading" class="mt-10">
            <h2 id="shipping-heading" class="text-sm font-medium text-gray-900">
              Details
            </h2>

            <div class="mt-4 space-y-6">
              <p class="text-sm text-gray-600">
                {{ product.details }}
              </p>
            </div>
          </section>
        </div>
      </div>
      <section aria-labelledby="related-products-heading" class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 id="related-products-heading" class="text-xl font-bold tracking-tight text-gray-900">
            Customers also purchased
          </h2>

          <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            <div v-for="product in products" :key="product.id" class="group relative">
              <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center lg:h-full lg:w-full">
              </div>
              <div class="mt-4 flex justify-between">
                <div>
                  <h3 class="text-sm text-gray-700">
                    <a :href="product.href">
                      <span aria-hidden="true" class="absolute inset-0" />
                      {{ product.name }}
                    </a>
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ product.color }}
                  </p>
                </div>
                <p class="text-sm font-medium text-gray-900">
                  {{ product.price }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
