module.exports = {
  client: {
    service: {
      name: 'grocerytime',
      url: 'https://grocerytime-trips-4m6r8lzkhiq8.herokuapp.com/graphql',
      // optional disable SSL validation check
      skipSSLValidation: true,
    },
    includes: ['src/**/*.{ts,tsx}'],
    excludes: ['src/generated/**'],
  },
}
