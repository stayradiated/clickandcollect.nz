import useSWR from 'swr'
import { useState, useCallback } from 'react'
import classNames from 'classnames'

import { CLOUD_ENDPOINT } from '../constants'
import graphQLClient, {
  MUTATION_DESTROY_SUBSCRIPTION,
  MUTATION_DESTROY_ALL_SUBSCRIPTIONS,
} from '../graphql'

import Spinner from '../spinner'
import BoringContainer from '../boring-container'
import { useViewerSubscriptions } from '../hooks'

interface Supermarket {
  chain: string,
  name: string,
}

interface Subscription {
  id: string,
  supermarket: Supermarket,
}

const Loading = () => {
  return (
    <div className="loading">
      <Spinner backgroundColor={[0, 70, 67]} />
      <style jsx>{`
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 10em;
        }
      `}</style>
    </div>
  )
}

interface ErrorMessageProps {
  error: Error,
}

const ErrorMessage = (props: ErrorMessageProps) => {
  const { error } = props
  return (
    <div className="error-message">
      {error.toString()}
      <style jsx>{`
        .error-message {
          font-family: monospace;
          font-weight: bold;
          background-color: #ff3838;
          color: white;
          height: 1em;
          line-height: 1em;
          padding: 1em;
          border-radius: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  )
}

interface UnsubscribeButtonProps {
  subscriptionId: string,
  unsubscribed: boolean,
  onUnsubscribe: (subscriptionId: string) => void,
}

const UnsubscribeButton = (props: UnsubscribeButtonProps) => {
  const { unsubscribed, subscriptionId, onUnsubscribe } = props

  const [
    [unsubscribeInProgress, unsubscribeError],
    setUnsubscribed,
  ] = useState([false, null])

  const handleUnsubscribe = useCallback(async () => {
    setUnsubscribed([true, null])
    try {
      await graphQLClient.request(MUTATION_DESTROY_SUBSCRIPTION, {
        subscriptionId,
      })
      setUnsubscribed([false, null])
      onUnsubscribe(subscriptionId)
    } catch (error) {
      console.error(error)
      setUnsubscribed([false, new Error('failed to unsubscribe')])
    }
  }, [setUnsubscribed, subscriptionId])

  const button = unsubscribed ? (
    <span>Unsubscribed</span>
  ) : unsubscribeInProgress ? (
    <span>Unsubscribing...</span>
  ) : (
    <a href="#" className="unsubscribe-button" onClick={handleUnsubscribe}>
      Unsubscribe
    </a>
  )

  return (
    <>
      {button}
      {unsubscribeError && <ErrorMessage error={unsubscribeError} />}
    </>
  )
}

interface SubscriptionRowProps {
  subscription: Subscription,
  unsubscribed: boolean,
  onUnsubscribe: (subscriptionId: string) => void,
}

const SubscriptionRow = (props: SubscriptionRowProps) => {
  const { unsubscribed, subscription, onUnsubscribe } = props
  const { supermarket } = subscription

  return (
    <li className={classNames('item', { unsubscribed })}>
      <span>
        {supermarket.chain} {supermarket.name}
      </span>
      <UnsubscribeButton
        subscriptionId={subscription.id}
        unsubscribed={unsubscribed}
        onUnsubscribe={onUnsubscribe}
      />
      <style jsx>{`
        .item {
          display: flex;
          align-items: center;
          line-height: 3em;
          padding: 0 1em;
        }
        .item:nth-of-type(2n-1) {
          background: rgba(0, 0, 0, 0.05);
        }
        .item span {
          font-weight: bold;
          flex: 1;
        }
        .item.unsubscribed {
          text-decoration: line-through;
          opacity: 0.7;
        }
      `}</style>
    </li>
  )
}

interface DetailsProps {
  userId: string,
  email: string,
  subscriptions: Subscription[],
}

const Details = (props: DetailsProps) => {
  const { userId, email, subscriptions = [] } = props

  const [unsubscribed, setUnsubscribed] = useState<string[]>([])

  const handleUnsubscribe = useCallback(
    (subscriptionId) => {
      setUnsubscribed((array) => [...array, subscriptionId])
    },
    [setUnsubscribed],
  )

  const handleUnsubscribeAll = useCallback(async () => {
    try {
      await graphQLClient.request(MUTATION_DESTROY_ALL_SUBSCRIPTIONS, {
        userId,
      })
      setUnsubscribed(subscriptions.map((s) => s.id))
    } catch (error) {
      console.error(error)
    }
  }, [])

  const subscriptionCount = subscriptions.filter(
    (s) => unsubscribed.includes(s.id) === false,
  ).length

  return (
    <>
      <p>You are subscribed to {subscriptionCount} supermarket(s).</p>

      <p>
        Notifications will be sent via email to{' '}
        <span className="email">{email}</span>.
      </p>

      <ul>
        {subscriptions.map((subscription) => (
          <SubscriptionRow
            key={subscription.id}
            subscription={subscription}
            unsubscribed={unsubscribed.includes(subscription.id)}
            onUnsubscribe={handleUnsubscribe}
          />
        ))}
      </ul>

      {subscriptionCount > 1 && (
        <a href="#" onClick={handleUnsubscribeAll}>
          Unsubscribe from all supermarkets.
        </a>
      )}

      <style jsx>{`
        ul {
          padding: 0;
        }

        .email {
          background: var(--paragraph);
          border-radius: 4px;
          padding: 0 0.5em;
        }
      `}</style>
    </>
  )
}

const NotificationsPage = () => {
  const { loading, viewer, subscriptions } = useViewerSubscriptions()

  const isLoggedIn = !loading && viewer != null
  const userId = isLoggedIn && viewer.id
  const email = isLoggedIn && viewer.email

  return (
    <BoringContainer>
      <h3>🔔 Email Notifications</h3>

      {loading && <Loading />}
      {!loading && isLoggedIn === false && (
        <a href={`${CLOUD_ENDPOINT}/login`}>Please log in</a>
      )}
      {isLoggedIn && (
        <Details userId={userId} email={email} subscriptions={subscriptions} />
      )}
    </BoringContainer>
  )
}

export default NotificationsPage
