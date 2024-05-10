/**
 * Regular expression for validating phone numbers.
 */
export const phoneNumberRegex = /^(?:\+\d{1,3}\d{7,15}|0\d{7,15})$/

/**
 * Formats a label with a key-value pair from a form input.
 * This function takes the translated label based on the key.
 * ex: Can be used let's say to format the labels in a pretty way when sending an email.
 *
 * @param data - The data we want to transform.
 * @param keys - All the data with labels from the form
 * @returns The formatted labels in an object.
 */
export function formatLabelsWithKeys(data: object, keys: any[]) {
  const updatedData = {}
  for (const key in data) {
    if (keys.some(field => field.id === key)) {
      const field = keys.find(field => field.id === key)
      updatedData[field.label] = data[key]
    }
    else {
      updatedData[key] = data[key]
    }
  }
  return updatedData
}
