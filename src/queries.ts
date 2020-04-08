export const QUERY_SUBSCRIBE_TO_PRODUCT_UPDATES = `
mutation subscribeToProductUpdates ($email: String!) {
  subscribeToProductUpdates(input: { email: $email })
}`
