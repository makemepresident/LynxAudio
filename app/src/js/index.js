const exp = require('express')
const path = require('path')
const axios = require('axios').default
const fetch = require('node-fetch')
const formidable = require('formidable')
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
    console.log(req.params)
    fetch(api_host + '/dbreq/' + req.params.url_hash, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    })

    // axios({
    //     method: 'POST',
    //     url: api_host + '/dbreq/' + req.params.url_hash
    // }).then((res) => {
    //     console.log(res)
    // }).catch((err) => {
    //     console.log(err)
    // })
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