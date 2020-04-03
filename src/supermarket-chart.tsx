import { memo, useCallback } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { DateTime } from 'luxon'
import classNames from 'classnames'

import { Snapshot } from './types'
import { toSum } from './utils'
import Spinner from './spinner'

interface Props {
  isLoading: boolean,
  snapshots: Snapshot[],
  onTrack: (timestamp: number) => void,
}

const buildTimeSeries = (snapshots: Snapshot[]) => {
  const data = snapshots
    .map((snapshot) => {
      const date = DateTime.fromISO(snapshot.date)
      const sum = Object.values(snapshot.slots).reduce<number>(toSum, 0)

      return {
        index: Math.floor(date.toMillis()),
        available: sum,
      }
    })
    .sort((a, b) => {
      return a.index - b.index
    })

  const min = data.length === 0 ? 0 : data[0].index
  const max = data.length === 0 ? 0 : data[data.length - 1].index

  const ticks = [min]
  for (let i = min; i < max; i += 60 * 60 * 3) {
    const tickTime = DateTime.fromMillis(i)
      .set({ minute: 0, second: 0 })
      .toMillis()
    if (tickTime > min) {
      ticks.push(tickTime)
    }
  }

  return { data, ticks }
}

const formatMillisAsTime = (millis: number) => {
  const datetime = DateTime.fromMillis(millis)
  return datetime.toFormat('h:mm a')
}

const formatMillisAsDateTime = (millis: number) => {
  const datetime = DateTime.fromMillis(millis)
  return datetime.toFormat('d LLL, h:mm a')
}

const XAxisTick = (props) => {
  const { x, y, stroke, payload } = props
  const text = formatMillisAsTime(payload.value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {text}
      </text>
    </g>
  )
}

const SupermarketChart = memo((props: Props) => {
  const { isLoading, snapshots, onTrack } = props

  const { data, ticks } = buildTimeSeries(snapshots)

  const handleMouseMove = useCallback(
    (event) => {
      const { activeLabel } = event
      onTrack(activeLabel)
    },
    [onTrack],
  )

  const handleMouseLeave = useCallback(() => {
    onTrack(null)
  }, [onTrack])

  return (
    <div className={classNames('container', { loading: isLoading })}>
      {(isLoading && <Spinner backgroundColor={[113, 88, 226]} />) || (
        <ResponsiveContainer
          className="recharts-container"
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            margin={{ right: 0, bottom: 0, left: 0, top: 0 }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#18dcff" stopOpacity={1} />
                <stop offset="100%" stopColor="#18dcff" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            <XAxis
              ticks={ticks}
              tick={XAxisTick}
              dataKey="index"
              name="Time"
              type="number"
              domain={['dataMin', 'dataMax']}
            />

            <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} />

            <CartesianGrid strokeDasharray="3 3" />

            <Tooltip
              labelFormatter={formatMillisAsDateTime}
              isAnimationActive={false}
            />
            <Area
              dot={{ strokeWidth: 0, fill: '#7158e2', r: 2 }}
              type="monotone"
              dataKey="available"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#gradient)"
              animationDuration={300}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          // padding-bottom: 16.5%;
          height: 200px;
        }
        .container.loading {
          background: #eee;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
})

export default SupermarketChart
