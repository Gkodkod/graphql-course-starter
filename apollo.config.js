module.exports = {
  client: {
    service: {
      name: 'local-dev',
      url: 'http://localhost:4000/graphql',
    },
    includes: ['src/**/*.{ts,tsx,js,jsx,graphql}'],
  },
};
