import antfu from "@antfu/eslint-config"

export default antfu({
  vue: true,
  typescript: true,
  jsonc: true,
  yaml: true,
  stylistic: {
    quotes: "double",
  },
  rules: {
    "style/no-mixed-operators": ["error", {
      allowSamePrecedence: true,
    }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  formatters: {
    css: true,
    html: true,
  },
})
