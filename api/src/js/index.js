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
        let unique_hash = crypto.randomBytes(5)
        let input = [null, audio_data, parseInt(fields.duration), audio_data.size, unique_hash.toString('hex')]
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

app.get('/dbreq/:unique_hash', (req, res) => {
    let client = construct_client()
    client.connect()
    let text = 'SELECT * FROM audio_clips WHERE audio_clips.url_hash = $1'
    client.query(text, [req.params.unique_hash], (err, res) => {
        // res contains database information
        if(err) {
            console.log(err)
            return
        }
        // res.rows will contain the extracted db information
        // console.log(res.rows)
    })
    res.send(null)
})

app.listen(port, () => {
    log("API is running on port " + port)
})