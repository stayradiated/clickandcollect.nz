const fetch = require('isomorphic-unfetch')

const buildSlug = (supermarket) => {
  return [
    supermarket.chain,
    supermarket.name
  ].join(' ').replace(/\s+/g, '-').replace(/[^\w-]+/g, '').toLowerCase()
}

module.exports = {
  exportPathMap: async () => {
    const response = await fetch('https://api.clickandcollect.nz/supermarkets.json')
    const supermarkets = await response.json()

    const paths = {
      '/': { page: '/' },
    }

    for (const supermarket of supermarkets) {
      const slug = `/${buildSlug(supermarket)}`
      paths[slug] = { page: '/[slug]' }
    }

    return paths
  }
}
