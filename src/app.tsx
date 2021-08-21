import Head from 'next/head'
import Link from 'next/link'
import classNames from 'classnames'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import EntypoBell from 'react-entypo-icons/lib/entypo/Bell'

import SupermarketList from './supermarket-list'
import SupermarketInfo from './supermarket-info'

import { useViewerSubscriptions } from './hooks'

import { Supermarket } from './types'
import { fetcher, first, buildSlug } from './utils'
import { API_ENDPOINT } from './constants'

const App = () => {
  const router = useRouter()

  const { data, error: swrError } = useSWR<Supermarket[]>(
    `${API_ENDPOINT}/supermarkets.json`,
    fetcher,
  )
  if (swrError != null) {
    console.error(swrError)
  }
  const { subscriptions = [] } = useViewerSubscriptions()

  const isLoading = data == null
  const supermarkets = data || []

  const storeSlug = first(router.query.s)
  const supermarket = supermarkets.find((s) => buildSlug(s) === storeSlug)
  const subscription = subscriptions.find(
    (s) => s.supermarket.id === supermarket?.id.toString(),
  )

  const title = supermarket
    ? `${supermarket.chain} ${supermarket.name} - Click & Collect`
    : `Click & Collect`

  return (
    <div className="app">
      <Head>
        <title>{title}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <SupermarketList isLoading={isLoading} supermarkets={supermarkets} />
      <main className={classNames({ selected: supermarket != null })}>
        {supermarket && (
          <SupermarketInfo
            supermarket={supermarket}
            subscription={subscription}
          />
        )}
        <footer>
          <a
            target="_blank"
            href="mailto:george@czabania.com"
          >
            Feedback
          </a>
          <a
            target="_blank"
            href="https://github.com/stayradiated/clickandcollect.nz"
          >
            About This Site
          </a>
        </footer>
      </main>
      <style jsx global>{`
        body {
          width: 100vw;
          max-width: none;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <style jsx>{`
        .app {
          height: 100vh;
          width: 100vw;
          position: relative;
          display: flex;
        }
        main {
          background: #fff;
          overflow-y: auto;

          flex: 1;
          flex-direction: column;
          justify-content: flex-end;

          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;

          display: none;
        }
        main.selected {
          display: flex;
          justify-content: flex-start;
        }
        footer {
          padding: 0;
          display: flex;
          justify-content: flex-end;
          background: var(--background);
        }
        footer a {
          color: var(--paragraph);
          text-decoration: none;
          display: block;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1em 2em;
          font-size: 0.8em;
        }
        footer a:hover {
          text-decoration: underline;
        }
        @media only screen and (min-width: 500px) {
          main {
            position: static;
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}

export default App
