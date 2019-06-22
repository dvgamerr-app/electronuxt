const pkg = require('./package')

module.exports = {
  mode: 'spa',
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ]
  },
  loading: { color: '#fff' },
  css: [],
  plugins: [],
  modules: [],
  build: {},
  electron: {
    ip: '127.0.0.1',
    port: 25081,
    poll: 300
  }
}
