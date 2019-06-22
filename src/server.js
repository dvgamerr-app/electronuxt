const server = require('express')()

module.exports = {
  listen: async (config, nuxt) => {
    server.use(nuxt.render)
    console.log(`Nuxtjs router aready.`)
    if (!config.dev) await nuxt.ready()

    server.listen(config.electron.port, config.electron.ip)
    console.log(`Electron listening on ${config.electron.ip}:${config.electron.port}`)
  }
}
