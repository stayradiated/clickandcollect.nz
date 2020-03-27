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

const SupermarketInfo = memo((props: Props) => {
  const { supermarket } = props

  const { data, error } = useSWR<Snapshot[]>(
    `/api/slots/${supermarket?.id}.json`,
    fetcher,
  )

  const [trackedDate, setTrackedDate] = useState(null)

  const handleTrack = useCallback((date) => {
    if (date == null) {
      setTrackedDate(null)
    } else {
      setTrackedDate(date.getTime())
    }
  }, [setTrackedDate])

  const snapshot = data?.find((snapshot) => {
    return new Date(snapshot.date).getTime() === trackedDate
  })

  return (
    <div className="container">
      <header className="header">
        <h2 className="title">
          {supermarket.chain} {supermarket.name}
        </h2>
        <p className="address">{supermarket.address}</p>
        <p className="last-updated-at">
          Last updated at{' '}
          {DateTime.fromISO(supermarket.latestSnapshot.date).toFormat(
            DATE_FORMAT,
          )}
        </p>
      </header>

      <Calendar supermarket={supermarket} snapshot={snapshot} />

      <h4>Last 24 Hours</h4>

      {data != null && <SupermarketChart snapshots={data} onTrack={handleTrack} />}

      <style jsx>{`
        .container {
          flex: 1;
          padding: 1em;
          overflow-y: auto;
        }
        .header {
          display: grid;
          grid-template-areas:
            'title last-updated-at'
            'address address';
          margin-bottom: 1em;
        }
        .title {
          margin: 0;
          grid-area: title;
        }
        .address {
          margin: 0;
          grid-area: address;
        }
        .last-updated-at {
          grid-area: last-updated-at;
          margin: 0;
          text-align: right;
          font-style: italic;
        }
      `}</style>
    </div>
  )
})

export default SupermarketInfo
