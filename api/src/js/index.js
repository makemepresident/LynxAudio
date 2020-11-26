const exp = require('express')
const crypto = require('crypto')
const app = exp()
const port = 80
const {Client} = require('pg') // Destructuring - equivalent to saying const tt = require('pg') and tt.Client
const formidable = require('formidable')
const Blob = require('node-blob')
const e = require('express')
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
    let result = {}
    let that = res

    let client = construct_client()
    client.connect()
    let input = [username]
    let text = 'SELECT id, username, password, first FROM users WHERE username=$1'
    client.query(text, input, (err, res) => {
        if (err)  {
            log('Query unsuccessful')
            log(err)
        } else {
            log("Query success")
            if (res.rowCount == 0) {
                result["result"] = "userresult"
            } else if (password == res.rows[0].password) {
                result["result"] = "true"
                result["username"] = res.rows[0].username
                result["id"] = res.rows[0].id
                result["firstname"] = res.rows[0].first
            } else {
                result["result"] = "passresult"
            }
        }
        client.end()
        that.send(JSON.stringify(result))
    })
})

app.post('/postregister', (req, res) => {
    let ressend = res
    let input = [req.body.username, req.body.password, req.body.first, req.body.last, req.body.email]
    let client = construct_client()
    client.connect()
    let query = 'INSERT INTO users(username, password, first, last, email) VALUES($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT users_username_key DO NOTHING'
    client.query(query, input, (err, res) =>  {
        if (err) {
            console.log(err)
        } else {
            if (res.rowCount == 1) {
                ressend.send("true")
            } else if (res.rowCount == 0) {
                ressend.send("false")
            }
        }
    })
})

app.post('/postmemo', (req, res) => {
    let that = res
    let unique_hash = crypto.randomBytes(5)
    let unique_string = unique_hash.toString('hex')
    let input = [null, req.body.filename, parseInt(req.body.duration), parseInt(req.body.filesize), unique_string, req.body.usergivenid]

    if (!isNaN(parseInt(req.body.userid))) {
        input[0] = parseInt(req.body.userid)
    }
    
    let client = construct_client()
    client.connect()
    let text = 'INSERT INTO audio_clips(userid, filename, cliplength, filesize, url_hash, usergivenid) VALUES($1, $2, $3, $4, $5, $6)'
    client.query(text, input, (err, res) => {
        if (err) {
            log('Query unsuccessful - ')
            log(err)
            return
        } else {
            log('Query Success')
        }
        client.end()
        that.send(unique_string)
    })
})

app.get('/dbreq/:unique_hash', (req, res) => {
    let that = res
    let filename = {}
    let client = construct_client()
    client.connect()
    let text = 'SELECT * FROM audio_clips WHERE url_hash = $1'
    let input = [req.params.unique_hash]
    client.query(text, input, (err, res) => {
        if(err) {
            log('Query unsuccessful - ')
            console.log(err)
        } else {
            if (res.rowCount == 0) {
                filename["result"] = "error"
            } else {
                log("Query successful")
                filename["result"] = res.rows[0]
            }
        }
        client.end()
        that.send(JSON.stringify(filename))
    })
})

app.post('/allmemopost', (req, res) => {
    let that = res

    let client = construct_client()
    client.connect()
    let text = 'SELECT * FROM audio_clips WHERE userid=$1'
    let input = [req.body.userid]
    client.query(text, input, (err, res) => {
        if (err) {
            log(err)
        } else {
            log("Query successful")
            client.end()
            that.send(JSON.stringify(res.rows))
        }
    })
})

app.post('/delpost', (req, res) => {
    let that = res

    let client = construct_client()
    client.connect()
    let text = 'DELETE FROM audio_clips WHERE filename=$1'
    let input = [req.body.filename]
    client.query(text, input, (err, res) => {
        if (err) {
            log(err)
            that.send("err")
        } else {
            log("Query successful")
            client.end()
            that.send("success")
        }
    })
})

app.listen(port, () => {
    log("API is running on port " + port)
})