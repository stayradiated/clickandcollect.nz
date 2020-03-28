import { Supermarket } from './types'

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
