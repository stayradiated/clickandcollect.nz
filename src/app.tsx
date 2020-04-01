import { useRouter } from 'next/router'
import Head from 'next/head'
import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'
import classNames from 'classnames'

import SupermarketList from './supermarket-list'
import SupermarketInfo from './supermarket-info'

import { Supermarket } from './types'
import { first, buildSlug } from './utils'

const fetcher = (url) => fetch(url).then((r) => r.json())

const App = () => {
  const router = useRouter()

  const { data: supermarkets, error } = useSWR<Supermarket[]>(
    'https://api.clickandcollect.nz/supermarkets.json',
    fetcher,
  )

  if (supermarkets == null) {
    return <div>Loading...</div>
  }

  if (error != null) {
    return <div>{error.message}</div>
  }

  const storeSlug = first(router.query.s)
  const supermarket = supermarkets.find((s) => buildSlug(s) === storeSlug)

  console.log(router.query)

  const title = supermarket
    ? `${supermarket.chain} ${supermarket.name} - Click & Collect`
    : `Click & Collect`

  return (
    <div className="app">
      <Head>
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css"
        />
        <link
          rel="stylesheet"
          href="//brick.freetls.fastly.net/Source+Sans+Pro:400,400i,700"
        />
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
      <SupermarketList supermarkets={supermarkets} />
      <main className={classNames({ selected: supermarket != null })}>
        {supermarket && <SupermarketInfo supermarket={supermarket} />}
        <footer>
          <a
            target="_blank"
            href="https://contact.george.czabania.com/?product=clickandcollect.nz"
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
          font-family: 'Source Sans Pro', sans-serif;
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
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
        }
        footer a {
          display: block;
          border-left: 1px solid #eee;
          padding: 1em 2em;
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
