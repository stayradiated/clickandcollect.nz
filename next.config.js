module.exports = {
  exportPathMap: () => ({
    '/index': { page: '/[...slug]' },
  })
}
