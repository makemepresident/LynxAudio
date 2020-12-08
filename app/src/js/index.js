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

const api_host = "http://localhost:80"
const port = 8080
const log = console.log

// Set upload destination for multer to send blob files to
const upload = multer({ dest: '../public/uploads/' })

// Set what character to replace bad words with
const customFilter = new Filter({ placeHolder: '*' })

// Set static file directory
app.use(exp.static(path.join(__dirname, '../public')))

// Tell express where the favicon is
app.use(favicon(path.join(__dirname, "../public/favicon.ico")))

// Set the view engine for when using res.render
app.set("view engine", "ejs")
// Tell the view engine where to find the 'views'
app.set("views", path.join(__dirname, "../public"))
// Allow the app to use the view engine on html files
app.engine('html', require('ejs').renderFile)

// Tell express to begin listening for http requests on selected ports (this section differs on the server
// Version because microphone permissions must be enabled on an https connection)
app.listen(port, () => {
    log("Webapp is running")
})

// Handle client request for a certain URL hash
app.get('/webplayer/:url_hash', (req, res) => {
    // Send request to db for filename
    fetch(api_host + '/dbreq/' + req.params.url_hash, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    // Parse result sent from API
    }).then((res) => {
        return res.json()
    // Take parsed information
    }).then((recordparams) => {
        // If the result was successful, update with file location on the server directory and render the mediaplayer with the file location
        if (recordparams.result != "error") {
            recordparams.result.filename = path.join("../uploads/", recordparams.result.filename)
            res.render(path.join(__dirname, "../public/mediaplayer.html"), {data: JSON.stringify(recordparams.result)})
        // If the result errored, render mediaplayer with error
        } else {
            res.render(path.join(__dirname, "../public/mediaplayer.html"), {data: JSON.stringify(recordparams.result)})
        }
    // Catch an error where the API fails or isn't running and render an error page
    }).catch((err) => {
        res.render(path.join(__dirname, "../public/internalerror.html"))
    })
})

// Handle client request to upload an audio clip
// Upload.single uploads the blob in the form coming from the client to the server directory specified above
app.post('/memoreq', upload.single('blob'), (req, res) => {
    // Prepare JSON to add metadata to
    var json = {} 

    // Check to make sure the user given name is not too long, if it is, send internal error
    if (req.body.usergivenid.length > 50) {
        res.sendStatus(500)
    // If the user given id is valid
    } else {
        // Build the JSON array with file metadata
        json["userid"] = req.body.userid
        json["filename"] = req.file.filename
        json["filesize"] = req.file.size
        json["duration"] = req.body.duration

        // If the user given id is an empty string, skip the bad words filter (causes error if empty string is given to filter)
        if (req.body.usergivenid == "") {
            json["usergivenid"] = req.body.usergivenid
        } else {
            json["usergivenid"] = customFilter.clean(req.body.usergivenid)
        }

        // Send request to API to insert file metadata into db
        fetch(api_host + '/postmemo', {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        // Parse result sent from API
        }).then((res) => {
            return res.text()
        // Take parsed information
        }).then((hash) => {
            // Send unique hash back to client for page redirection
            res.send(hash)
        // If API error occurs, delete uploaded file and send internal server error
        }).catch((err) => {
            fs.unlinkSync('../public/uploads/' + json["filename"])
            res.sendStatus(500)
        })
    }
})

// Handling for when client requests login
app.post('/loginreq', (req, res) => {
    // res.send is not able to be called in the fetch promise, assigning it to a variable inside the scope allows it to be called
    let that = res 

    // Parse body of fetch request
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields) =>  {
        // Build empty JSON object to be added to
        let json = {}

        if (err) {
            log(err)
        } else {
            // Add body of fetch request to new JSON
            json["username"] = fields.username
            json["password"] = crypto.createHash('sha256').update(fields.password).digest('hex')

            // Send request to API to check credentials
            fetch(api_host + '/postlogin', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            // Parse result sent from API
            }).then((res) => {
                return res.json()
            // Take parsed information
            }).then((result) => {
                // Send parsed information back to client
                res.send(JSON.stringify(result))
            // If API error occurs, send internal server error
            }).catch((err) => {
                res.sendStatus(500)
            })
        }
    })
})

// Handling for when client requests registration
app.post('/regreq', (req, res) => {
    // res.send is not able to be called in the fetch promise, assigning it to a variable inside the scope allows it to be called
    let passback = res

    // Parse body of fetch request
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields) => {
        if (err) {
            log(err)
        } else {
            // Server side check to ensure data is correct length for insertion into db
            if (fields.username.length > 30 || fields.password.length > 255 || fields.first.length > 30 || fields.last.length > 30 || fields.email.length > 50) {
                res.send("false")
            // If the username is profrane, send profane result to client
            } else if (customFilter.isProfane(fields.username)) {
                res.send("profane")
            // If data is all good for database
            } else {
                // Build empty JSON object to be added to, then add parsed data to json object
                let json = {}
                json["username"] = fields.username
                json["password"] = crypto.createHash('sha256').update(fields.password).digest('hex')
                json["first"] = customFilter.clean(fields.first)
                json["last"] = customFilter.clean(fields.last)
                json["email"] = fields.email

                // Send request to API to insert registration data into db
                fetch(api_host + '/postregister', {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(json)
                // Parse result sent from API
                }).then((res) => {
                    return res.text()
                // Take parsed information
                }).then((result) => {
                    // Send parsed information to client
                    res.send(result)
                // If API error occurs, send internal server error
                }).catch((err) => {
                    res.sendStatus(500)
                })
            }
        }
    })
})

// Handling for when user requests their recordings page
app.post('/allreq', (req, res) => {
    // res.send is not able to be called in the fetch promise, assigning it to a variable inside the scope allows it to be called
    let passback = res

    // Parse body of fetch request
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields) => {
        if (err) {
            log(err)
        } else {
            // Build empty JSON object to be added to, then add parsed data to json object (just userid this time)
            let json = {}
            json["userid"] = fields.userid

            // Send request to API to get recent recordings based on userid
            fetch(api_host + '/allmemopost', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            // Parse result sent from API
            }).then((res) => {
                return res.json()
            // Take parsed information
            }).then((result) => {
                // Send parsed information (user's audio_clips metadata)
                res.send(JSON.stringify(result))
            // If API error occurs, send internal server error
            }).catch((err) => {
                res.sendStatus(500)
            })
        }
    })
})

// Handling for when user wants to delete audio clip
app.post('/delreq', (req, res) => {
    // res.send is not able to be called in the fetch promise, assigning it to a variable inside the scope allows it to be called
    let passback = res

    // Parse body of fetch request
    let incoming = formidable.IncomingForm()
    incoming.parse(req, (err, fields) => {
        if (err) {
            log(err)
        } else {
            // Build empty JSON object to be added to, then add parsed data to json object (just filename this time)
            let json = {}
            json["filename"] = fields.filename

            // Send request to API to delete audio clip metadata
            fetch(api_host + '/delpost', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            // Parse result sent from API
            }).then((res) => {
                return res.text()
            // Take parsed information
            }).then((result) => {
                // Syncronously delete file from db
                try {
                    fs.unlinkSync('../public/uploads/' + fields.filename)
                } catch (error) {
                    // File does not exist, just delete db entry
                }
                // Send result to client
                res.send(result)
            // If API error occurs, send internal server error
            }).catch((err) => {
                res.sendStatus(500)
            })
        }
    })
})

// Handling for front page recent recordings from other users tab
app.get('/recreq', (req, res) => {
    // Send request to API to get recent audio clips
    fetch(api_host + '/recpost', {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
    // Parse result sent from API
    }).then((res) => {
        return res.json()
    // Take parsed information
    }).then((result) => {
        // Send parsed information to client
        res.send(result)
    // If API error occurs, send internal server error
    }).catch((err) => {
        res.sendStatus(500)
    })
})