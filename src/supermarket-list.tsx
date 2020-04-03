import { memo, useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'

import { Supermarket } from './types'
import { toSum, first, buildSlug } from './utils'

interface Props {
  supermarkets: Supermarket[],
}

interface Search {
  query: string,
  results: Supermarket[],
}

const DEBOUNCE_MS = 250

const sortByRegion = (array: Supermarket[]): Supermarket[] => {
  return array.sort((a, b) => {
    return (
      a.region.localeCompare(b.region) ||
      a.chain.localeCompare(b.chain) ||
      a.name.localeCompare(b.name)
    )
  })
}

const performSearch = (
  rawQuery: string,
  supermarkets: Supermarket[],
): Search => {
  if (typeof rawQuery !== 'string' || rawQuery.trim().length === 0) {
    return { query: rawQuery, results: supermarkets }
  }

  const words = rawQuery
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.trim())

  const results = supermarkets.filter((supermarket) => {
    const { chain, name, address, region } = supermarket
    return words.every((word) => {
      return (
        chain?.toLowerCase().includes(word) ||
        name?.toLowerCase().includes(word) ||
        address?.toLowerCase().includes(word) ||
        region?.toLowerCase().includes(word)
      )
    })
  })

  return {
    query: rawQuery,
    results: sortByRegion(results),
  }
}

const SupermarketList = memo((props: Props) => {
  const { supermarkets } = props

  const router = useRouter()
  const initialQuery = first(router.query.q)

  const [search, setSearch] = useState<Search>({
    query: initialQuery,
    results: supermarkets,
  })

  useEffect(() => {
    if (initialQuery != null) {
      setSearch(performSearch(initialQuery, supermarkets))
    }
  }, [initialQuery])

  const [debouncedCallback] = useDebouncedCallback(
    (query) => {
      setSearch(performSearch(query, supermarkets))
      router.replace(
        {
          pathname: '/',
          query: {
            ...router.query,
            q: query,
          },
        },
        undefined,
        { shallow: true },
      )
    },
    DEBOUNCE_MS,
    { maxWait: 4 * DEBOUNCE_MS },
  )

  return (
    <div className="container">
      <input
        className="input"
        type="search"
        defaultValue={initialQuery}
        placeholder="Search supermarkets..."
        onChange={(e) => debouncedCallback(e.target.value)}
      />
      <ul className="list">
        {search.results.map((supermarket, index) => {
          const previousResult = search.results[index - 1]
          const previousRegion = previousResult?.region

          const { region } = supermarket

          const sumAvailable =
            supermarket.latestSnapshot == null
              ? 0
              : Object.values(supermarket.latestSnapshot.slots).reduce<number>(
                toSum,
                0,
              )

          const query = search.query ? { q: search.query } : {}

          return [
            region !== previousRegion && (
              <li key={region} className="list-header">
                {region}
              </li>
            ),
            <li
              key={supermarket.id}
              className={classNames('list-item', {
                [supermarket.chain.toLowerCase().replace(/[^\w]/g, '')]: true,
                unavailable: sumAvailable === 0,
              })}
            >
              <Link
                href={{
                  pathname: '/',
                  query: {
                    ...query,
                    s: buildSlug(supermarket),
                  },
                }}
                passHref
              >
                <a className="list-item-link">
                  <div className="logo" />
                  <div className="name">
                    {supermarket.chain} {supermarket.name}
                  </div>
                  <div className="address">{supermarket.address}</div>
                  <div className="available">{sumAvailable}</div>
                </a>
              </Link>
            </li>,
          ]
        })}
      </ul>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          background: #222;
          width: 100%;
        }
        .input {
          margin: 1em;
        }
        .list {
          overflow-y: auto;
          padding: 0;
          margin: 0;
        }
        .list-header {
          list-style: none;
          font-weight: bold;
          padding: 1em 0;
          text-align: center;
          background: #333;
          color: #ddd;
          letter-spacing: 1px;
          font-size: 0.7em;
          text-transform: uppercase;
          border-bottom: 1px solid #555;
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
          display: grid;
          grid-template-areas:
            'logo name available'
            '_ address address';
          grid-template-columns: 2em 1fr auto;
          grid-gap: 0 1em;
          color: #fff;
          cursor: default;
          line-height: 1.5em;
          padding: 0.5em 1em;
        }
        .list-item-link:hover {
          text-decoration: none;
        }
        .list-item-link:active,
        .list-item-link:focus {
          outline: none;
          background: #eee;
          color: #000;
        }

        .logo {
          position: relative;
          font-size: 0.75em;
          height: 2em;
        }
        .logo:before {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          margin-right: 1em;
          text-align: center;
          font-weight: bold;
        }
        .list-item.countdown .logo:before {
          content: 'CD';
          background: #007837;
          color: #fff;
        }
        .list-item.newworld .logo:before {
          content: 'NW';
          background: #e11a2c;
          color: #fff;
        }
        .list-item.freshchoice .logo:before {
          content: 'FC';
          background: #3bbdef;
          color: #fff;
        }
        .list-item.paknsave .logo:before {
          content: 'PS';
          background: #ffd600;
          color: #000;
        }

        .name {
          grid-area: name;
          font-weight: bold;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .address {
          grid-area: address;
          color: #ccc;
          font-style: italic;
          font-size: 0.8em;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .list-item-link:active .address,
        .list-item-link:focus .address {
          color: #777;
        }

        .available {
          grid-area: available;
          font-weight: bold;
        }

        .unavailable .available {
          color: rgba(255, 255, 255, 0.5);
        }
        .unavailable .list-item-link:active .available,
        .unavailable .list-item-link:focus .available {
          color: rgba(0, 0, 0, 0.5);
        }

        @media only screen and (min-width: 500px) {
          .container {
            width: 400px;
          }
        }
      `}</style>
    </div>
  )
})

export default SupermarketList
