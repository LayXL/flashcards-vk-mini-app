const localtunnel = require("localtunnel")
require("dotenv").config()
;(async () => {
    const tunnel = await localtunnel({ port: 5173, subdomain: process.env.SUBDOMAIN })

    console.log(`Tunnel start on ${tunnel.url}`)

    tunnel.on("close", () => {
        tunnel.open()
    })
})()
