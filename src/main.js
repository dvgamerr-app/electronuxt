const { app, BrowserWindow } = require('electron')
const http = require('http')
const path = require('path')
const url = require('url')

let main = null

const { Nuxt, Builder } = require('nuxt')
const { listen } = require('./server')
let config = require('../nuxt.config.js')

config.dev = !(process.env.NODE_ENV === 'production')

// Wait listen server dev.
let pollTimeout = 0
const pollWaitServer = async () => {
  let uri = `http://${config.electron.ip}:${config.electron.port}`
  console.log(` - waiting '${uri}'`)
  http.get(uri, (res) => {
    if (res.statusCode !== 200) {
      pollTimeout = setTimeout(pollWaitServer, config.electron.poll)
    } else {
      clearTimeout(pollTimeout)
      main.loadURL(uri)
    }
  }).on('error', pollWaitServer)
}

const initApp = async () => {
  console.log('Init Nuxt.js')
  const nuxt = new Nuxt(config)

  console.log(`Build only in dev mode: ${config.dev}`)
  if (config.dev) await new Builder(nuxt).build()
  await listen(config, nuxt)
}

const newWin = () => {
  main = new BrowserWindow({ width: 640, height: 480 })
  main.on('closed', () => main = null)
  main.loadURL(url.format({
    pathname: path.join(__dirname, 'src/loading.html'),
    protocol: 'file:',
    slashes: true
  }))
  pollWaitServer()
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => main === null && newWin())

initApp().catch((error) => {
  console.error(error) // eslint-disable-line no-console
  process.exit(1)
})