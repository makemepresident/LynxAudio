const exp = require('express')
const crypto = require('crypto')
const app = exp()
const port = 80
const {Client} = require('pg') // Destructuring - equivalent to saying const tt = require('pg') and tt.Client
const formidable = require('formidable')
const Blob = require('node-blob')
const log = console.debug
app.use(exp.json())

function construct_client() {
    // convert to grabbing from local config file/other js file
    let client = new Client({
        user: 'postgres',
        host: 'lynxdb-1.cbqydpcjfuag.us-east-2.rds.amazonaws.com',
        database: 'lynxdb',
        password: 'Yz7S6nF2h6fgACN',
        port: 5432})
    return client
}

app.post('/postmemo', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if(err) {
            console.debug(err)
            return
        }
        // Construct values [userid, blob, length, filesize, unique hash]
        // From FormData, grab login information and assign accordinly, otherwise null
        audio_data = new Blob([files.blob], {type: 'audio/wav'})
        let unique_hash = null
        crypto.randomBytes(10, (err, buff) => {
            if(err)
                return
            console.log(buff.toString('utf-8'))
            unique_hash = buff.toString('utf-8')
        });
        console.log(unique_hash)
        let input = [null, audio_data, files.duration, audio_data.size, unique_hash]
        let client = construct_client()
        client.connect()
        let text = 'INSERT INTO audio_clips(userid, audiobinary, cliplength, filesize, url_hash) VALUES($1, $2, $3, $4, $5)'
        client.query(text, input, (err, res) => {
            if(err) {
                log('Query unsuccessful - ')
                log(err)
                return
            } else {
                log('Query Success')
            }
            client.end()
        })
    })
    res.send(null)
})

app.get('/dbreq', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if(err) {
            console.debug(err)
            return
        }
        let client = construct_client()
        client.connect()
        let text = 'SELECT * FROM audio_clips(userid, audiobinary, cliplength, filesize, url_hash) WHERE audio_clips.url_hash = $1'
        client.query(text, [files.url_hash], (err, res) => {
            // res contains database information
            console.log(res)
        })
    })
})

app.listen(port, () => {
    log("API is running on port " + port)
})