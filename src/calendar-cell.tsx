import { memo } from 'react'
import { DateTime } from 'luxon'
import classNames from 'classnames'

interface Props {
  date: DateTime,
  available: number,
}

const getCount = (available: number): [string, string] => {
  switch (true) {
    case available < 0: {
      return ['no-data', '']
    }
    case available === 0: {
      return ['eq-0', '0']
    }
    case available < 10: {
      return ['lt-10', available.toString()]
    }
    case available < 20: {
      return ['lt-20', available.toString()]
    }
    default: {
      return ['gt-20', available.toString()]
    }
  }
}

const CalendarCell = memo((props: Props) => {
  const { date, available } = props

  const [className, count] = getCount(available)
  const isToday = DateTime.local().toISODate() === date.toISODate()

  const dayName = isToday ? 'Today' : `${date.day} ${date.monthShort}`

  return (
    <div
      className={classNames('cell', { 'is-today': isToday, [className]: true })}
    >
      <div className="content">
        <div className="day">{dayName}</div>
        <svg className="count" viewBox="0 0 25 25">
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">{count}</text>
        </svg>
      </div>

      <style jsx>{`
        .cell {
          position: relative;
          box-sizing: border-box;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          flex-basis: 33.333%;
        }
        .cell::before {
          content: '';
          display: block;
          padding-top: 100%;
        }
        .cell.is-today {
          box-shadow: inset 0 0 0 3px #000;
        }
        .cell.no-data {
          opacity: 0.5;
        }
        .cell.eq-0 .count text {
          fill: #ccc;
        }
        .cell.lt-10 {
          box-shadow: inset 0 0 0 3px #ffb8b8;
        }
        .cell.lt-20 {
          box-shadow: inset 0 0 0 3px #ffaf40;
        }
        .cell.gt-20 {
          box-shadow: inset 0 0 0 3px #32ff7e;
        }

        .content {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          padding: 0.5em 1em;
          box-sizing: border-box;
        }

        .day {
          text-transform: uppercase;
          font-weight: bold;
          margin: 0;
        }

        .count {
          width: 100%;
        }
        .count text {
          font-weight: bold;
          text-align: center;
          fill: #363636;
        }
      `}</style>
    </div>
  )
})

export default CalendarCell
