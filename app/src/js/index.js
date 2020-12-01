const exp = require('express')
const path = require('path')
const fetch = require('node-fetch')
const formidable = require('formidable')
const Blob = require('node-blob')
const multer = require('multer')
const favicon = require('serve-favicon')
const crypto = require('crypto')
const Filter = require('bad-words')
const fs = require('fs')
const app = exp()

const api_host = "http://localhost:5432"
const port = 5433
const log = console.log

const upload = multer({ dest: '../public/uploads/' })
const customFilter = new Filter({ placeHolder: '*' })

app.use(exp.static(path.join(__dirname, '../public')))
app.use(favicon(path.join(__dirname, "../public/favicon.ico")))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../public"))
app.engine('html', require('ejs').renderFile);  

app.listen(port, () => {
    log("Webapp is running")
})

app.get('/webplayer/:url_hash', (req, res) => {
    // req.params returns object with url hash as string {url_hash: 'henlo}
    // extract url hash
    // make request to REST API to see if hash exists within database
    // if so, serve page with mediaplayer for filename
    fetch(api_host + '/dbreq/' + req.params.url_hash, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    }).then((res) => {
        return res.json()
    }).then((recordparams) => {
        if (recordparams.result != "error") {
            recordparams.result.filename = path.join("../uploads/", recordparams.result.filename)
            res.render(path.join(__dirname, "../public/mediaplayer.html"), {data: JSON.stringify(recordparams.result)})
        } else {
            res.render(path.join(__dirname, "../public/mediaplayer.html"), {data: JSON.stringify(recordparams.result)})
        }
    }).catch((err) => {
        res.render(path.join(__dirname, "../public/internalerror.html"))
    })
})

app.post('/memoreq', upload.single('blob'), (req, res) => {
    var json = {}
    if (req.body.usergivenid.length > 50) {
        res.sendStatus(500)
    } else {
        json["userid"] = req.body.userid
        if (req.body.usergivenid == "") {
            json["usergivenid"] = req.body.usergivenid
        } else {
            json["usergivenid"] = customFilter.clean(req.body.usergivenid)
        }
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
        }).then((hash) => {
            res.send(hash)
        }).catch((err) => {
            fs.unlinkSync('../public/uploads/' + json["filename"])
            res.sendStatus(500)
        })
    }
})

app.post('/loginreq', (req, res) => {
    let that = res
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields) =>  {
        let json = {}
        if (err) {
            log(err)
        } else {
            json["username"] = fields.username
            json["password"] = crypto.createHash('sha256').update(fields.password).digest('hex')

            fetch(api_host + '/postlogin', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            }).then((res) => {
                return res.json()
            }).then((result) => {
                res.send(JSON.stringify(result))
            }).catch((err) => {
                res.sendStatus(500)
            })
        }
    })
})

app.post('/regreq', (req, res) => {
    let incoming = formidable.IncomingForm()
    let passback = res
    incoming.parse(req, (err, fields) => {
        if (err) {
            log(err)
        } else {
            if (fields.username.length > 30 || fields.password.length > 255 || fields.first.length > 30 || fields.last.length > 30 || fields.email.length > 50) {
                res.send("false")
            } else if (customFilter.isProfane(fields.username)) {
                res.send("profane")
            } else {
                let json = {}
                json["username"] = fields.username
                json["password"] = crypto.createHash('sha256').update(fields.password).digest('hex')
                json["first"] = customFilter.clean(fields.first)
                json["last"] = customFilter.clean(fields.last)
                json["email"] = fields.email

                fetch(api_host + '/postregister', {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(json)
                }).then((res) => {
                    return res.text()
                }).then((result) => {
                    res.send(result)
                }).catch((err) => {
                    res.sendStatus(500)
                })
            }
        }
    })
})

app.post('/allreq', (req, res) => {
    let incoming = formidable.IncomingForm()
    let passback = res
    incoming.parse(req, (err, fields) => {
        if (err) {
            log(err)
        } else {
            let json = {}
            json["userid"] = fields.userid
            fetch(api_host + '/allmemopost', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            }).then((res) => {
                return res.json()
            }).then((result) => {
                res.send(JSON.stringify(result))
            }).catch((err) => {
                res.sendStatus(500)
            })
        }
    })
})

app.post('/delreq', (req, res) => {
    let incoming = formidable.IncomingForm()
    let passback = res
    incoming.parse(req, (err, fields) => {
        if (err) {
            log(err)
        } else {
            let json = {}
            json["filename"] = fields.filename

            fetch(api_host + '/delpost', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            }).then((res) => {
                return res.text()
            }).then((result) => {
                try {
                    fs.unlinkSync('../public/uploads/' + fields.filename)
                } catch (error) {
                    // File DNE, just delete db entry
                }
                res.send(result)
            }).catch((err) => {
                res.sendStatus(500)
            })
        }
    })
})

app.get('/recreq', (req, res) => {
    fetch(api_host + '/recpost', {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    }).then((res) => {
        return res.json()
    }).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.sendStatus(500)
    })
})