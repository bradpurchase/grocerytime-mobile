module.exports = {
  client: {
    service: {
      name: 'grocerytime',
      url: 'https://api.grocerytime.app/graphql',
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
    includes: ['src/**/*.{ts,tsx}'],
    excludes: ['src/generated/**'],
  },
}
