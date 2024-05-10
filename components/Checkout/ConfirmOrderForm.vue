<script lang="ts" setup>
import { type InferType, array, mixed, object, string } from "yup"
import type { FormSubmitEvent } from "#ui/types"

// We just prepare the field for using i18n in the future
const t = (key: string) => key

const baseFields = [

  {
    id: "firstName",
    label: t("prenom"),
    inputType: "input",
    required: true,
    autoComplete: "given-name",
  },
  {
    id: "lastName",
    label: t("nom"),
    inputType: "input",
    required: true,
    autoComplete: "given-name",
  },
  {
    id: "phone",
    label: t("telephone"),
    inputType: "input",
    required: true,
    autoComplete: "on",
    placeholder: "+33 6 12 34 56 78",

  },
  {
    id: "email",
    label: t("email"),
    inputType: "input",
    required: true,
    autoComplete: "email",
  },

  {
    id: "address_1",
    label: t("addresse_1"),
    inputType: "input",
    required: false,

  },
  {
    id: "address_2",
    label: t("addresse_2"),
    inputType: "input",
    required: false,

  },
  {
    id: "province",
    label: t("province"),
    inputType: "input",
    required: false,

  },
  {
    id: "zip",
    label: t("code-postal"),
    inputType: "input",
    required: false,
  },
  {
    id: "city",
    label: t("city"),
    inputType: "input",
    required: false,
  },

]

const schema = object({
  firstName: string().required(t("ce-champ-est-requis")),
  lastName: string().required(t("ce-champ-est-requis")),
  phone: string().required(t("ce-champ-est-requis")).matches(phoneNumberRegex, t("le-numero-de-telephone-doit-etre-valide")),
  email: string().email(t("ceci-nest-pas-une-adresse-email-valide")).required(t("ce-champ-est-requis")),
  address_1: string().required(t("ce-champ-est-requis")),
  address_2: string().notRequired(),
  province: string().required(t("ce-champ-est-requis")),
  zip: string().required(t("ce-champ-est-requis")),
  city: string().required(t("ce-champ-est-requis")),

})
// Filled for debugging purposes
const state = ref({

  firstName: "John",
  lastName: "Doe",
  phone: "+1234596789",
  email: "hello@mountain-web-studio.io",
  address_1: "Donald Str",
  province: "Lower Silesia",
  zip: "55-080",
  city: "Wroclaw",
  country: "pl",

})
const form = ref()
const isSubmitting = ref(false)

function handleStateUpdate(newState, itemID) {
  state.value[itemID] = newState
}
type Schema = InferType<typeof schema>

const { updateCart } = useCart()

const router = useRouter()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  await updateCart({
    email: event.data.email,
    shipping_address: {
      first_name: event.data.lastName,
      last_name: event.data.lastName,
      address_1: event.data.address_1,
      address_2: event.data.address_2,
      city: event.data.city,
      country_code: state.value.country,
      province: event.data.province,
      postal_code: event.data.zip,
      phone: event.data.phone,
    },
    billing_address: {
      first_name: event.data.lastName,
      last_name: event.data.lastName,
      address_1: event.data.address_1,
      address_2: event.data.address_2,
      city: event.data.city,
      country_code: state.value.country,
      province: event.data.province,
      postal_code: event.data.zip,
      phone: event.data.phone,
    },
  }).then((e) => {
    isSubmitting.value = false
    router.replace({ query: { step: "2" } })
  })
}
</script>

<template>
  <UForm ref="form" :schema="schema" class="space-y-5" :state="state" @submit="onSubmit">
    <h3 class="text-2xl">
      Enter your details
    </h3>
    <p class="text-sm text-black/70">
      Shipping & Payment in the next step
    </p>

    <FormLooper
      locale="fr" :translations="{
        'selected': t('forms.selected'),
        'select-a-value': t('forms.selectAValue'),
        'select-multiple': t('forms.selectMultiple'),
      }" :fields="baseFields" :state="state" :is-submitting="isSubmitting"
      @update-form-state="(newState, itemID) => handleStateUpdate(newState, itemID)"
    />
    <UButton type="submit" size="xl">
      Confirm Order
    </UButton>
  </UForm>
</template>

<style lang="postcss" scoped>

</style>
