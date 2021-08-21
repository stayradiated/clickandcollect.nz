import useSWR from 'swr'

import graphQLClient, { QUERY_VIEWER_SUBSCRIPTIONS } from './graphql'

const useViewerSubscriptions = () => {
  const { data, error } = useSWR(QUERY_VIEWER_SUBSCRIPTIONS, (query) =>
    graphQLClient.request(query),
  )
  if (error != null) {
    console.error(error)
  }
  const loading = data == null
  const viewer = data?.viewer
  const subscriptions = viewer?.subscriptions

  const loggedIn = !loading && viewer != null

  return {
    loading,
    loggedIn,
    viewer,
    subscriptions,
    error,
  }
}

export { useViewerSubscriptions }
