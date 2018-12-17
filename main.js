const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const http = require('http')
const { Nuxt, Builder } = require('nuxt')
const server = require('express')()
const PORT_PROD = 25081
const PORT_DEV = 3000
const POLL_INTERVAL = 300

global.__ = null
const bw = BrowserWindow

/*
**  Nuxt.js part
*/

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)
server.use(nuxt.render)


// Listen the server
const pool = (p) => {
  server.listen(p, '127.0.0.1')
  console.log(`Server listening on 127.0.0.1:${p}`)
}
// Wait listen server dev.
const pollServer = () => {
  let uri = `http://127.0.0.1:${PORT_DEV}`
  http.get(uri, (res) => {
    const SERVER_DOWN = res.statusCode !== 200
    SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : __.loadURL(uri)
  }).on('error', pollServer)
}


// Build only in dev mode
if (config.dev) {
  new Builder(nuxt).build().then(() => {
    pool(PORT_DEV)
  }).catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
} else {
  pool(PORT_PROD)
}

/*
** Electron app
*/

const newWin = () => {
  __ = new bw({ width: 640, height: 480 })
  __.on('closed', () => __ = null)
  if (!config.dev) {
    return __.loadURL(`http://127.0.0.1:${port}`)
  }
  __.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  pollServer()
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => __ === null && newWin())
