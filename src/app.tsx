import { useRouter } from 'next/router'
import Head from 'next/head'
import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'

import SupermarketList from './supermarket-list'
import SupermarketInfo from './supermarket-info'

import { Supermarket } from './types'
import { buildSlug } from './utils'

const fetcher = (url) => fetch(url).then((r) => r.json())

const App = () => {
  const { data: supermarkets, error } = useSWR<Supermarket[]>(
    'https://api.clickandcollect.nz/supermarkets.json',
    fetcher,
  )

  const router = useRouter()

  if (supermarkets == null) {
    return <div>Loading...</div>
  }

  if (error != null) {
    return <div>{error.message}</div>
  }

  const { slug } = router.query
  const supermarket = supermarkets.find((s) => buildSlug(s) === slug)

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
          href="//brick.freetls.fastly.net/Source+Sans+Pro:400,700"
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
      {supermarket && <SupermarketInfo supermarket={supermarket} />}
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
        }
        @media only screen and (min-width: 500px) {
          .app {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}

export default App
