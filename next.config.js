module.exports = {
  exportPathMap: () => {
    return {
      '/': { page: '/' },
      '/supermarket/1': {
        page: '/supermarket/[supermarketId]',
        query: { supermarketId: 1 }
      }
    }
  }
}
