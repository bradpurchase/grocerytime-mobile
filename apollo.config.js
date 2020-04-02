module.exports = {
  client: {
    service: {
      name: 'grocerytime',
      url: 'https://grocerytime.herokuapp.com/graphql',
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
    includes: ['src/**/*.{ts,tsx}'],
    excludes: ['src/generated/**'],
  },
}
