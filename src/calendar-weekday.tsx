import { memo } from 'react'
import { DateTime } from 'luxon'

interface Props {
  date: DateTime,
}

const CalendarWeekday = memo((props: Props) => {
  const { date } = props
  return (
    <div className="weekday">
      {date.weekdayLong}
      <style jsx>{`
        .weekday {
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 3px;
          text-align: center;
          font-size: 0.8em;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.3em 0;
          border-radius: 4px;

          display: none;
        }
        @media only screen and (min-width: 500px) {
          display: block;
        }
      `}</style>
    </div>
  )
})

export default CalendarWeekday
