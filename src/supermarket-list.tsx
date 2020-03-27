import { memo, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Link from 'next/link'
import classNames from 'classnames'

import { Supermarket } from './types'
import { toSum } from './utils'

interface Props {
  supermarkets: Supermarket[],
}

const DEBOUNCE_MS = 250

const search = (rawQuery: string, supermarkets: Supermarket[]) => {
  const words = rawQuery
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.trim())
  return supermarkets.filter((supermarket) => {
    const { chain, name, address } = supermarket
    return words.every((word) => {
      return (
        chain?.toLowerCase().includes(word) ||
        name?.toLowerCase().includes(word) ||
        address?.toLowerCase().includes(word)
      )
    })
  })
}

const SupermarketList = memo((props: Props) => {
  const { supermarkets } = props

  const [searchResults, setSearchResults] = useState(supermarkets)

  const [debouncedCallback] = useDebouncedCallback(
    (query) => {
      if (query.trim().length === 0) {
        setSearchResults(supermarkets)
      } else {
        setSearchResults(search(query, supermarkets))
      }
    },
    DEBOUNCE_MS,
    { maxWait: 4 * DEBOUNCE_MS },
  )

  return (
    <div className="container">
      <input
        className="input"
        type="search"
        placeholder="Search supermarkets..."
        onChange={(e) => debouncedCallback(e.target.value)}
      />
      <ul className="list">
        {searchResults.map((supermarket) => {
          const sumAvailable =
            supermarket.latestSnapshot == null
              ? 0
              : Object.values(supermarket.latestSnapshot.slots).reduce<number>(
                toSum,
                0,
              )

          return (
            <li
              key={supermarket.id}
              className={classNames('list-item', {
                [supermarket.chain.toLowerCase().replace(/[^\w]/g, '')]: true,
                unavailable: sumAvailable === 0,
              })}
            >
              <Link
                href="/supermarket/[supermarketId]"
                as={`/supermarket/${supermarket.id}`}
                passHref
              >
                <a className="list-item-link">
                  <div className="name">
                    {supermarket.chain} {supermarket.name}
                  </div>
                  <div className="available">{sumAvailable}</div>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
      <style jsx>{`
        .container {
          width: 30em;
          display: flex;
          flex-direction: column;
          background: #222;
        }
        .input {
          margin: 1em;
        }
        .list {
          overflow-y: auto;
          padding: 0;
          margin: 0;
        }
        .list-item {
          list-style: none;
          margin: 0;
        }
        .list-item.unavailable {
          text-decoration: strike;
        }
        .list-item:nth-child(2n) {
          background: rgba(255, 255, 255, 0.01);
        }
        .list-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .list-item-link {
          display: block;
          color: #fff;
          display: flex;
          cursor: default;
          line-height: 1.5em;
          padding: 0.5em 1em;
        }
        .list-item-link:hover {
          text-decoration: none;
        }
        .list-item-link:focus {
          outline: none;
          box-shadow: inset 0 0 3px #7158e2;
          background: #3d3d3d;
        }
        .list-item-link:before {
          display: block;
          border-radius: 4px;
          width: 2.5em;
          margin-right: 1em;
          font-size: 0.75em;
          text-align: center;
          font-weight: bold;
        }
        .list-item.countdown .list-item-link:before {
          content: 'CD';
          background: #007837;
          color: #fff;
        }
        .list-item.newworld .list-item-link:before {
          content: 'NW';
          background: #e11a2c;
          color: #fff;
        }
        .list-item.freshchoice .list-item-link:before {
          content: 'FS';
          background: #3bbdef;
          color: #fff;
        }
        .list-item.paknsave .list-item-link:before {
          content: 'PS';
          background: #ffd600;
          color: #000;
        }
        .name {
          flex: 1;
          font-weight: bold;
        }
        .available {
          font-weight: bold;
        }
        .unavailable .available {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
})

export default SupermarketList
