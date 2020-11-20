const exp = require('express')
const path = require('path')
const fetch = require('node-fetch')
const formidable = require('formidable')
const Blob = require('node-blob')
const { resolve } = require('path')
const { Console } = require('console')
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
    if (req.params.url_hash == 'favicon.ico') {
        return;
    }
    fetch(api_host + '/dbreq/' + req.params.url_hash, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    }).then((res) => {
        return res.json()
    }).then((json) => {
        let blob = new Blob([json], {type: 'audio/wav'})
        // Soomehow get blob data to element?
    })
    res.send(null)
})

app.post('/memoreq', (req, res) => {
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields, files) => {
        var json = {}
        if (err) {
            log(err)
        }
        json["duration"] = fields.duration
        json["blob"] = files.blob

        fetch(api_host + '/postmemo', {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        })
    })
    res.send(null)
})

app.post('/loginreq', (req, res) => {
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields) =>  {
        let json = {}
        if (err) {
            log(err)
        }
        json["username"] = fields.username
        json["password"] = fields.password

        fetch(api_host + '/postlogin', {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        })
    })
    res.send(null)
})