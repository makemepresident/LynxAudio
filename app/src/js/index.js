const exp = require('express')
const path = require('path')
// const derby = require('derby')
// const app = derby.createApp()
const app = exp()
const api_host = "http://localhost:80"
const port = 8080
const log = console.log

log(path.join(__dirname, '../public'))
app.use(exp.static(path.join(__dirname, '../public')))

app.listen(port, () => {
    log("Webapp is running")
})

app.get('/:url_hash', (req, res) => {
    // req.params returns object with url hash as string {url_hash: 'henlo}
    // extract url hash
    // make request to REST API to see if hash exists within database
    // if so, serve page with mediaplayer for extracted binary data
    let fd = new FormData()
    fd.append('url_hash', req.params.url_hash)
    let api_req = fetch(api_host + '/dbreq', {
        method: 'GET',
        mode: 'no-cors',
        body: fd
    })
})