import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import SupermarketList from './supermarket-list'
import SupermarketInfo from './supermarket-info'

import { Supermarket } from './types'

interface Props {
  supermarkets: Supermarket[],
}

const App = (props: Props) => {
  const { supermarkets } = props
  const router = useRouter()

  const { supermarketId: rawSupermarketId } = router.query
  const supermarketId =
    typeof rawSupermarketId === 'string' && parseInt(rawSupermarketId, 10)
  const supermarket = supermarkets.find((s) => s?.id === supermarketId)

  return (
    <div className="app">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css"
        />
        <link
          rel="stylesheet"
          href="//brick.freetls.fastly.net/Source+Sans+Pro:400,700"
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
          display: flex;
        }
      `}</style>
    </div>
  )
}

export default App
