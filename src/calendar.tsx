import { memo } from 'react'
import { DateTime } from 'luxon'

import CalendarCell from './calendar-cell'
import CalendarWeekday from './calendar-weekday'

import { Supermarket, Snapshot } from './types'

interface Props {
  supermarket: Supermarket,
  snapshot: Snapshot,
}

const Calendar = memo((props: Props) => {
  const { supermarket, snapshot } = props

  const now = DateTime.local()

  const titles = [
    <CalendarWeekday key={1} date={now.set({ weekday: 1 })} />,
    <CalendarWeekday key={2} date={now.set({ weekday: 2 })} />,
    <CalendarWeekday key={3} date={now.set({ weekday: 3 })} />,
    <CalendarWeekday key={4} date={now.set({ weekday: 4 })} />,
    <CalendarWeekday key={5} date={now.set({ weekday: 5 })} />,
    <CalendarWeekday key={6} date={now.set({ weekday: 6 })} />,
    <CalendarWeekday key={7} date={now.set({ weekday: 7 })} />,
  ]

  const startOfWeek = now.set({ weekday: 1 })

  const dates = new Array(7 * 2).fill(null).map((_, index) => {
    return startOfWeek.set({ weekday: index + 1 })
  })

  const cells = dates.map((date) => {
    const key = date.toISODate()
    const slots = (snapshot || supermarket.latestSnapshot)?.slots
    const available = (slots && slots[key]) ?? -1
    return <CalendarCell key={key} date={date} available={available} />
  })

  return (
    <div className="grid">
      {titles}
      {cells}
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 10px;
        }
        @media only screen and (min-width: 500px) {
          .grid {
            grid-template-columns: repeat(7, 1fr);
          }
        }
      `}</style>
    </div>
  )
})

export default Calendar
