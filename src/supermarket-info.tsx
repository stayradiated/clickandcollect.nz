import { memo, useState, useCallback } from 'react'
import { DateTime } from 'luxon'
import useSWR from 'swr'
import fetch from 'isomorphic-unfetch'

import Calendar from './calendar'
import SupermarketChart from './supermarket-chart'

import { Snapshot, Supermarket } from './types'

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
    case 'New World': {
      return 'https://www.ishopnewworld.co.nz/'
    }
    case "PAK'nSAVE": {
      return 'https://www.paknsaveonline.co.nz/'
    }
  }
}

const SupermarketInfo = memo((props: Props) => {
  const { supermarket } = props

  const { data } = useSWR<Snapshot[]>(
    `https://api.clickandcollect.nz/slots/${supermarket?.id}.json`,
    fetcher,
  )

  const [trackedDate, setTrackedDate] = useState(null)

  const handleTrack = useCallback(
    (date) => {
      if (date == null) {
        setTrackedDate(null)
      } else {
        setTrackedDate(date.getTime())
      }
    },
    [setTrackedDate],
  )

  const snapshot = data?.find((snapshot) => {
    return new Date(snapshot.date).getTime() === trackedDate
  })

  const lastUpdatedAt = DateTime.fromISO(
    (data && data[0]?.date) || supermarket.latestSnapshot.date,
  )

  return (
    <div className="container">
      <header className="header">
        <h2 className="title">
          {supermarket.chain} {supermarket.name}
          <a
            className="open-store"
            target="_blank"
            href={getSupermarketLink(supermarket)}
          >
            Shop Online
          </a>
        </h2>
        <p className="address">{supermarket.address}</p>
        <p className="last-updated-at">
          Last updated at {lastUpdatedAt.toFormat(DATE_FORMAT)}
        </p>
      </header>

      <Calendar supermarket={supermarket} snapshot={snapshot} />

      <h4>Last 24 Hours</h4>

      <SupermarketChart snapshots={data || []} onTrack={handleTrack} />

      <footer>
        <a
          target="_blank"
          href="https://github.com/stayradiated/clickandcollect.nz"
        >
          About This Site
        </a>
      </footer>

      <style jsx>{`
        .container {
          flex: 1;
          padding: 1em;
          overflow-y: auto;
          background: #fff;

          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        .header {
          margin-bottom: 1em;
        }
        .title {
          margin: 0;
          grid-area: title;
        }
        .open-store {
          display: inline-block;
          color: #17c0eb;
          font-size: 0.6em;
          border: 1px solid #18dcff;
          border-radius: 4px;
          padding: 0.2em 0.4em;
          margin-left: 1em;
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
        .address {
          margin: 0;
          grid-area: address;
        }
        .last-updated-at {
          grid-area: last-updated-at;
          margin: 0;
          text-align: center;
          align-self: center;
          font-size: 0.8em;
          font-style: italic;
          border: 3px solid #eee;
          padding: 0.5em 1em;
          border-radius: 4px;
          margin-top: 1em;
        }

        @media only screen and (min-width: 500px) {
          .container {
            position: static;
          }
          .header {
            display: grid;
            grid-template-areas:
              'title last-updated-at'
              'address last-updated-at';
            grid-template-columns: 1fr auto;
          }
        }
      `}</style>
    </div>
  )
})

export default SupermarketInfo
