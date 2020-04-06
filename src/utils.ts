import mem from 'mem'

import { Coords, Supermarket } from './types'

export const toSum = (sum, value) => sum + value

export const first = (n: string | string[]) => {
  if (Array.isArray(n)) {
    return n[0]
  }
  return n
}

export const buildSlug = (supermarket: Supermarket): string => {
  return [supermarket.chain, supermarket.name]
    .join(' ')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
}

const TO_RADIANS = Math.PI / 180

const calculateDistance = ([lat1, lon1]: Coords, [lat2, lon2]: Coords) => {
  const R = 6371e3 // metres
  const φ1 = lat1 * TO_RADIANS
  const φ2 = lat2 * TO_RADIANS
  const Δφ = (lat2 - lat1) * TO_RADIANS
  const Δλ = (lon2 - lon1) * TO_RADIANS

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c

  return d
}

export const sortSupermarketsByDistance = mem<
[Coords, Supermarket[]],
Supermarket[],
string
>(
  (geolocation, supermarkets) => {
    console.log(geolocation)

    if (geolocation == null) {
      return supermarkets
    }

    const distanceOf = supermarkets.reduce<Record<string, number>>(
      (record, supermarket) => {
        const distance = calculateDistance(geolocation, [
          supermarket.latitude,
          supermarket.longitude,
        ])
        record[supermarket.id] = distance
        return record
      },
      {},
    )

    const sortedSupermarkets = [...supermarkets].sort((a, b) => {
      return distanceOf[a.id] - distanceOf[b.id]
    })

    return sortedSupermarkets
  },
  {
    cacheKey: ([geolocation, supermarkets]) => {
      const supermarketData = supermarkets
        .map((s) => {
          const { id, latitude, longitude } = s
          return [id, latitude, longitude]
        })
        .sort((a, b) => {
          return a[0] - b[0]
        })
      return JSON.stringify([geolocation, supermarketData])
    },
  },
)
