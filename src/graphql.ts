import { GraphQLClient } from 'graphql-request'

import { CLOUD_ENDPOINT } from './constants'

const graphQLClient = new GraphQLClient(CLOUD_ENDPOINT, {
  credentials: 'include',
  mode: 'cors',
})

export const QUERY_VIEWER_SUBSCRIPTIONS = `
query viewerSubscriptions {
  viewer {
    id
    email
    subscriptions {
      id
      createdAt
      supermarket {
        id
        chain
        name
      }
    }
  }
}`

export const MUTATION_SUBSCRIBE_TO_PRODUCT_UPDATES = `
mutation($email: String!) {
  subscribeToProductUpdates(input: { email: $email })
}`

export const MUTATION_CREATE_SUBSCRIPTION = `
mutation($supermarketId: ID!) {
  createSubscription(input: { supermarketId: $supermarketId })
}`

export const MUTATION_DESTROY_SUBSCRIPTION = `
mutation($subscriptionId: ID!) {
  destroySubscription(input: { subscriptionId: $subscriptionId })
}`

export const MUTATION_DESTROY_ALL_SUBSCRIPTIONS = `
mutation($userId: ID!) {
  destroyAllSubscriptions(input: { userId: $userId })
}`

export default graphQLClient
