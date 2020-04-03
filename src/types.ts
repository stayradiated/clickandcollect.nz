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
}

export interface Snapshot {
  date: string,
  slots: Record<string, number>,
}
