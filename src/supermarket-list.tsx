import { memo, useState, useEffect, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useSessionStorage } from 'react-use'

import { Coords, Supermarket } from './types'
import { toSum, first, buildSlug, sortSupermarketsByDistance } from './utils'
import Spinner from './spinner'
import useGeolocation from './use-geolocation'

interface Props {
  isLoading: boolean,
  supermarkets: Supermarket[],
}

enum SORT_BY {
  NAME = 'NAME',
  LOCATION = 'LOCATION',
}

const SEARCH_DEBOUNCE_MS = 250

const performSearch = (
  rawQuery: string,
  supermarkets: Supermarket[],
  sortBy: SORT_BY,
  geolocation: Coords,
): Supermarket[] => {
  const sortedSupermarkets =
    sortBy === SORT_BY.NAME
      ? supermarkets
      : sortSupermarketsByDistance(geolocation, supermarkets)

  if (typeof rawQuery !== 'string' || rawQuery.trim().length === 0) {
    return sortedSupermarkets
  }

  const words = rawQuery
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.trim())

  const filteredSupermarkets = sortedSupermarkets.filter((supermarket) => {
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

  return filteredSupermarkets
}

const SupermarketList = memo((props: Props) => {
  const { isLoading, supermarkets } = props

  const [sortBy, setSortBy] = useSessionStorage<SORT_BY>(
    'sort_by',
    SORT_BY.NAME,
    true,
  )

  const { latitude, longitude, error: geolocationError } = useGeolocation(sortBy === SORT_BY.LOCATION, {
    enableHighAccuracy: false,
  })
  if (geolocationError != null) {
    console.error(geolocationError)
  }

  const geolocation: Coords = (latitude == null || longitude == null) ? null : [latitude, longitude]

  const router = useRouter()
  const initialQuery = first(router.query.q)

  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const [searchResults, setSearchResults] = useState(
    performSearch(searchQuery, supermarkets, sortBy, geolocation),
  )

  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    setSearchResults(
      performSearch(searchQuery, supermarkets, sortBy, geolocation),
    )
  }, [geolocation, sortBy, searchQuery, supermarkets])

  const handleSortByLocation = useCallback(() => setSortBy(SORT_BY.LOCATION), [
    setSortBy,
  ])
  const handleSortByName = useCallback(() => setSortBy(SORT_BY.NAME), [
    setSortBy,
  ])

  const [debouncedCallback] = useDebouncedCallback((query: string) => {
    setSearchQuery(query)

    const nextRouterQuery = { ...router.query }
    if (query.trim().length > 0) {
      nextRouterQuery.q = query
    } else {
      delete nextRouterQuery.q
    }

    router.replace(
      {
        pathname: '/',
        query: nextRouterQuery,
      },
      undefined,
      { shallow: true },
    )
  }, SEARCH_DEBOUNCE_MS)

  return (
    <div className="container">
      <input
        className="input"
        type="search"
        defaultValue={initialQuery}
        placeholder="Search supermarkets..."
        onKeyUp={(e) => debouncedCallback((e.target as any).value)}
      />

      <ul className={classNames('list', { loading: isLoading })}>
        {isLoading && <Spinner />}
        {isLoading === false && (
          <li className="sort-by">
            <label className="sort-by-label">Sort By</label>
            <button
              className={classNames('sort-by-button', {
                'sort-by-button-active': sortBy === SORT_BY.NAME,
              })}
              onClick={handleSortByName}
            >
              A-Z
            </button>
            <button
              className={classNames('sort-by-button', {
                'sort-by-button-active': sortBy === SORT_BY.LOCATION,
              })}
              onClick={handleSortByLocation}
            >
              Location
            </button>
          </li>
        )}

        {searchResults.map((supermarket, index) => {
          const previousResult = searchResults[index - 1]
          const previousRegion = previousResult?.region

          const { region } = supermarket

          const sumAvailable =
            supermarket.latestSnapshot == null
              ? 0
              : Object.values(supermarket.latestSnapshot.slots).reduce<number>(
                toSum,
                0,
              )

          const query = searchQuery ? { q: searchQuery } : {}

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

        .sort-by {
          margin: 0 1em 1em;
        }
        .sort-by-label {
          margin-right: 1em;
          font-weight: bold;
          color: #aaa;
          text-transform: uppercase;
          font-size: 0.8em;
        }
        .sort-by-button {
          background: #555;
          color: #fff;
          border-radius: 0;
          margin: 0;
          border: 1px solid #777;
          font-size: 0.8em;
          font-weight: bold;
        }
        .sort-by-button-active {
          background: #ccc;
          color: #333;
        }
        .sort-by-button:first-of-type {
          border-radius: 4px 0 0 4px;
          border-right: none;
        }
        .sort-by-button:last-of-type {
          border-radius: 0 4px 4px 0;
        }

        .list {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          margin: 0;
        }
        .list.loading {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .list.loading > li {
          display: none;
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
