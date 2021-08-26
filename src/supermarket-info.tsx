import { memo, useState, useCallback } from 'react'
import { DateTime } from 'luxon'
import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'

import EntypoShoppingCart from 'react-entypo-icons/lib/entypo/ShoppingCart'

import Calendar from './calendar'
import SupermarketChart from './supermarket-chart'

import { Snapshot, Supermarket } from './types'
import { API_ENDPOINT } from './constants'

interface Props {
  supermarket: Supermarket,
}

const DATE_FORMAT = 'LLLL d yyyy, h:mm:ss a'

const fetcher = (url) => fetch(url).then((r) => r.json())

const getSupermarketLink = (supermarket: Supermarket) => {
  switch (supermarket.chain) {
    case 'Countdown': {
      return 'https://shop.countdown.co.nz/'
    }
    case 'FreshChoice': {
      const name = supermarket.name
        .toLowerCase()
        .replace(/\s/g, '')
        .split(',')[0]
      return `https://${name}.store.freshchoice.co.nz/`
    }
    case 'SuperValue': {
      const name = supermarket.name
        .toLowerCase()
        .replace(/\s/g, '')
        .split(',')[0]
      return `https://${name}.store.supervalue.co.nz/`
    }
    case 'New World': {
      return 'https://www.newworld.co.nz/shop'
    }
    case "PAK'nSAVE": {
      return 'https://www.paknsave.co.nz/shop'
    }
  }
}

const SupermarketInfo = memo((props: Props) => {
  const { supermarket } = props

  const { data, error } = useSWR<Snapshot[]>(
    `${API_ENDPOINT}/slots/${supermarket?.id}.json`,
    fetcher,
  )

  const isLoading = data == null

  if (error != null) {
    console.error(error)
  }

  const [trackedDate, setTrackedDate] = useState(null)

  const handleTrack = useCallback(
    (timestamp) => {
      setTrackedDate(timestamp)
    },
    [setTrackedDate],
  )

  const snapshot = data?.find((snapshot) => {
    return new Date(snapshot.date).getTime() === trackedDate
  })

  const lastUpdatedAt =
    (data && data[0]?.date) || supermarket.latestSnapshot?.date

  return (
    <div className="container">
      <header className="header">
        <h2 className="title">
          {supermarket.chain} {supermarket.name}
        </h2>
        <p className="address">{supermarket.address}</p>
        <a
          className="open-store"
          target="_blank"
          href={getSupermarketLink(supermarket)}
        >
          <EntypoShoppingCart /> Shop Online
        </a>
        {lastUpdatedAt && (
          <p className="last-updated-at">
            Last updated {DateTime.fromISO(lastUpdatedAt).toRelative()}
          </p>
        )}
      </header>

      <Calendar supermarket={supermarket} snapshot={snapshot} />

      <h4>Last 24 Hours</h4>

      <SupermarketChart
        isLoading={isLoading}
        snapshots={data || []}
        onTrack={handleTrack}
      />

      <style jsx>{`
        .container {
          flex: 1;
          padding: 1em;
        }

        .header {
          margin-bottom: 1em;
        }
        .title {
          margin: 0 0 0.2em;
          grid-area: title;
        }
        .address {
          font-style: italic;
          margin: 0 0 0.5em;
          grid-area: address;
        }
        .open-store {
          grid-area: open-store;
          margin: 0 0 0.5em;
          display: block;
          text-align: center;
          color: #17c0eb;
          font-size: 1em;
          border: 3px solid #18dcff;
          border-radius: 4px;
          padding: 0.2em 0.4em;
          font-weight: bold;
        }
        .open-store:focus {
          background: none;
          border-color: #ff9f1a;
          color: #ffaf40;
          outline: none;
        }
        .open-store:hover {
          border-color: #18dcff;
          text-decoration: none;
          background: #18dcff;
          color: #fff;
        }
        .open-store:active {
          border-color: #7d5fff;
          background: #7d5fff;
          color: #fff;
        }
        .last-updated-at {
          grid-area: last-updated-at;
          margin: 0;
          text-align: center;
          align-self: center;
          font-size: 0.8em;
          background: rgba(0, 0, 0, 0.04);
          padding: 0.5em 1em;
          border-radius: 4px;
        }

        @media only screen and (min-width: 500px) {
          .header {
            display: grid;
            grid-template-areas:
              'title open-store'
              'address last-updated-at';
            grid-template-columns: 1fr auto;
          }
        }
      `}</style>
    </div>
  )
})

export default SupermarketInfo
