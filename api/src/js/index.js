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

app.post('/postlogin', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let client = construct_client()
    client.connect()
    let input = [username]
    let text = 'SELECT username, password FROM users WHERE username=$1'
    client.query(text, input, (err, res) => {
        if (err)  {
            log('Query unsuccessful')
            log(err)
            return
        } else {
            log("Query success")
            if (crypto.createHash('sha256').update(password).digest('hex') == res.rows[0].password) {
                log("user verified")
                // Implement user sign-on garbage here (cookies or whatever)
            }
        }
        client.end()
    })
    res.send(null)
})

app.post('/postmemo', (req, res) => {
    audio_data = new Blob([req.body.blob], {type: 'audio/wav'})
    console.log(audio_data)
    let unique_hash = crypto.randomBytes(5)
    let input = [null, audio_data, parseInt(req.body.duration), audio_data.size, unique_hash.toString('hex')]

    let client = construct_client()
    client.connect()
    let text = 'INSERT INTO audio_clips(userid, audiobinary, cliplength, filesize, url_hash) VALUES($1, $2, $3, $4, $5)'
    client.query(text, input, (err, res) => {
        if (err) {
            log('Query unsuccessful - ')
            log(err)
            return
        } else {
            log('Query Success')
        }
        client.end()
    })
    res.send(null)
})

app.get('/dbreq/:unique_hash', (req, res) => {
    let that = res
    let audiobinary = null
    let client = construct_client()
    client.connect()
    let text = 'SELECT audiobinary FROM audio_clips WHERE url_hash = $1'
    let input = [req.params.unique_hash]
    client.query(text, input, (err, res) => {
        if(err) {
            log('Query unsuccessful - ')
            console.log(err)
            return
        } else {
            log("Query successful")
            audiobinary = new Blob([res.rows[0]], {type: 'audio/wav'})
        }
        client.end()
        that.send(JSON.stringify(audiobinary))
    })
})

app.listen(port, () => {
    log("API is running on port " + port)
})