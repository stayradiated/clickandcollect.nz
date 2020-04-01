import { DateTime } from 'luxon'
import { memo, useCallback, useState } from 'react'
import {
  AreaChart,
  ScatterChart,
  Baseline,
  ChartContainer,
  ChartRow,
  Charts,
  EventMarker,
  Resizable,
  YAxis,
} from 'react-timeseries-charts'
import { TimeSeries, TimeRange } from 'pondjs'

import { Snapshot } from './types'
import { toSum } from './utils'

interface Props {
  snapshots: Snapshot[],
  onTrack: (time: Date) => void,
}

const buildTimeSeries = (snapshots: Snapshot[]) => {
  const points = snapshots
    .map((snapshot) => {
      const date = DateTime.fromISO(snapshot.date)
      const sum = Object.values(snapshot.slots).reduce<number>(toSum, 0)
      return [date.toMillis(), sum]
    })
    .sort((a, b) => {
      return a[0] - b[0]
    })

  const timeSeries = new TimeSeries({
    name: 'snapshots',
    columns: ['time', 'value'],
    points,
  })

  return timeSeries
}

const SupermarketChart = memo((props: Props) => {
  const { snapshots, onTrack } = props

  if (snapshots.length === 0) {
    return <div>Loading...</div>
  }

  const timeSeries = buildTimeSeries(snapshots)

  const [state, setState] = useState({
    trackerValue: '0',
    trackerEvent: null,
  })

  const handleTrackerChanged = useCallback(
    (t) => {
      if (t) {
        const e = timeSeries.atTime(t)
        const eventValue = e.get('value').toString()
        setState({ trackerValue: eventValue, trackerEvent: e })

        const eventTime = new Date(
          e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2,
        )
        onTrack(eventTime)
      } else {
        setState({ trackerValue: null, trackerEvent: null })
        onTrack(null)
      }
    },
    [timeSeries, onTrack],
  )

  return (
    <Resizable>
      <ChartContainer
        timeRange={timeSeries.timerange()}
        onTrackerChanged={handleTrackerChanged}
      >
        <ChartRow height="200">
          <YAxis
            id="axis"
            label="# Available Slots"
            min={0}
            max={timeSeries.max(undefined) + 20}
            width="60"
            format=".0f"
          />
          <Charts>
            <Baseline axis="axis" value={0} />
            <AreaChart
              axis="axis"
              series={timeSeries}
              interpolation="curveLinear"
              style={{
                value: {
                  line: {
                    normal: {
                      strokeWidth: 0,
                    },
                  },
                  area: {
                    normal: {
                      fill: '#18dcff',
                      stroke: 'none',
                      opacity: 0.5,
                    },
                  },
                },
              }}
            />
            <ScatterChart
              axis="axis"
              series={timeSeries}
              style={{
                value: {
                  normal: {
                    fill: '#7158e2',
                  },
                },
              }}
            />
            <EventMarker
              type="flag"
              axis="axis"
              event={state.trackerEvent}
              info={[{ label: 'Available', value: state.trackerValue }]}
              infoTimeFormat="%x %X"
              infoWidth={120}
              markerRadius={2}

              infoStyle={{
                box: {
                  fill: '#f0f0f0', stroke: 'none', opacity: 1
                },
                label: {
                  fill: '#333', opacity: 1
                }
              }}
              stemStyle={{ stroke: '#3d3d3d' }}
              markerStyle={{ fill: '#3d3d3d' }}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  )
})

export default SupermarketChart
