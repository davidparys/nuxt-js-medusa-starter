<script setup>
const $medusa = useMedusaClient()
const { data: products, pending, error } = await useAsyncData("fetch-products", async () => {
  try {
    const data = await $medusa.products.list()
    return data.products.map(({ id, title, variants, images, handle }) => {
      return {
        id,
        name: title,
        href: `/product/${handle}`,
        price: `From ${variants[0].prices[0].amount.toString() / 100} ${variants[0].prices[0].currency_code}`,
        description: `${variants.length} variants available`,
        imageSrc: images[0].url,
        imageAlt: images[0].id,
      }
    })
  }
  catch (e) {
    console.error(e)
    return []
  }
})
</script>

<template>
  <div class="bg-white">
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 id="products-heading" class="sr-only">
        Products
      </h2>

      <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        <a v-for="product in products" :key="product.id" :href="product.href" class="group">
          <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
            <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center group-hover:opacity-75">
          </div>
          <div class="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }}</p>
          </div>
          <p class="mt-1 text-sm italic text-gray-500">{{ product.description }}</p>
        </a>
      </div>
    </div>
  </div>
</template>
