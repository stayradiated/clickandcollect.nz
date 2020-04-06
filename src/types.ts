export interface Supermarket {
  id: number,
  chain: string,
  name: string,
  address: string,
  region: string,
  latestSnapshot: {
    date: string,
    slots: Record<string, number>,
  },
  latitude: number,
  longitude: number,
  distance?: number,
}

export interface Snapshot {
  date: string,
  slots: Record<string, number>,
}

export type Coords = [number, number]
