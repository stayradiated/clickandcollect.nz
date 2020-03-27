import { DateTime } from 'luxon'
import { memo, useCallback, useState } from 'react'
import {
  AreaChart,
  Baseline,
  ChartContainer,
  ChartRow,
  Charts,
  EventMarker,
  Resizable,
  ScatterChart,
  YAxis,
} from 'react-timeseries-charts'
import { TimeSeries, TimeRange } from 'pondjs'

import { Snapshot } from './types'
import { toSum } from './utils'

interface Props {
  snapshots: Snapshot[],
  onTrack: (time: Date) => void
}

const SupermarketChart = memo((props: Props) => {
  const { snapshots, onTrack } = props

  const points = snapshots
    .map((snapshot) => {
      const date = DateTime.fromISO(snapshot.date)
      const sum = Object.values(snapshot.slots).reduce<number>(toSum, 0)
      return [date.toMillis(), sum]
    })
    .sort((a, b) => {
      return a[0] - b[0]
    })

  const timeseries = new TimeSeries({
    name: 'snapshots',
    columns: ['time', 'value'],
    points,
  })

  const [state, setState] = useState({
    trackerValue: '-- °C',
    trackerEvent: null,
  })

  const handleTrackerChanged = useCallback((t) => {
    if (t) {
      const e = timeseries.atTime(t)
      const eventValue = e.get('value')
      setState({ trackerValue: eventValue, trackerEvent: e })

      const eventTime = new Date(
        e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2
      )
      onTrack(eventTime)
    } else {
      setState({ trackerValue: null, trackerEvent: null })
      onTrack(null)
    }
  }, [])

  return (
    <Resizable>
      <ChartContainer
        timeRange={timeseries.timerange()}
        onTrackerChanged={handleTrackerChanged}
      >
        <ChartRow height="200">
          <YAxis
            id="axis"
            label="# Available Slots"
            min={0}
            max={timeseries.max(undefined) + 20}
            width="60"
            format=".0f"
          />
          <Charts>
            <AreaChart
              axis="axis"
              series={timeseries}
              interpolation="curveStep"
              style={{
                value: {
                  line: {
                    normal: {
                      stroke: '#17c0eb',
                      fill: 'none',
                      strokeWidth: 2,
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
              series={timeseries}
            />
            <Baseline axis="axis" value={0} />
            <EventMarker
              type="flag"
              axis="axis"
              event={state.trackerEvent}
              info={[{ label: 'Available', value: state.trackerValue }]}
              infoWidth={120}
              markerRadius={2}
              markerStyle={{ fill: 'black' }}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  )
})

export default SupermarketChart
