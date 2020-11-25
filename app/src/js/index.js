const exp = require('express')
const path = require('path')
const fetch = require('node-fetch')
const formidable = require('formidable')
const Blob = require('node-blob')
const multer = require('multer')
const favicon = require('serve-favicon')
const upload = multer({dest: '../public/uploads/'})
const app = exp()
const api_host = "http://localhost:80"
const port = 8080
const log = console.log

app.use(exp.static(path.join(__dirname, '../public')))
app.use(favicon(path.join(__dirname, "../public/favicon.ico")))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../public"))
app.engine('html', require('ejs').renderFile);  

app.listen(port, () => {
    log("Webapp is running")
})

app.get('/webplayer/:url_hash', (req, res) => {
    console.log(req.params.url_hash)
    // req.params returns object with url hash as string {url_hash: 'henlo}
    // extract url hash
    // make request to REST API to see if hash exists within database
    // if so, serve page with mediaplayer for extracted binary data
    fetch(api_host + '/dbreq/' + req.params.url_hash, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    }).then((res) => {
        return res.json()
    }).then((filename) => {
        filename = path.join("../uploads/", filename)
        res.render(path.join(__dirname, "../public/mediaplayer.html"), {data: JSON.stringify(filename)})
    })
})

app.post('/memoreq', upload.single('blob'), (req, res) => {
    var json = {}
    json["filename"] = req.file.filename
    json["filesize"] = req.file.size
    json["duration"] = req.body.duration
    fetch(api_host + '/postmemo', {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
    }).then((res) => {
        return res.text()
    }).then((unique_hash) => {
        console.log(unique_hash)
        res.send(unique_hash)
    })
    /*let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields, files) => {
        var json = {}
        if (err) {
            log(err)
        }
        json["duration"] = fields.duration
        json["url"] = fields.url
        files.blob.mv('./uploads/' + "test")
        //json["blob"] = files.blob

        /*fetch(api_host + '/postmemo', {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        })
    })*/
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