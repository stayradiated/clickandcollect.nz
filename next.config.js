/* eslint-disable unicorn/prefer-module */
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  exportPathMap: () => ({
    '/': { page: '/' },
    '/subscribe-to-product-updates': { page: '/subscribe-to-product-updates' },
    '/notifications': { page: '/notifications' },
    '/landing': { page: '/landing' },
  })
}
