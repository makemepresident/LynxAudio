const exp = require('express')
const app = exp()
const port = 8080
const {Client} = require('pg') // Destructuring - equivalent to saying const tt = require('pg') and tt.Client
// const port = 5432
const log = console.log
app.use(exp.json())

function construct_client() {
    let client = new Client({
        user: 'postgres',
        host: 'lynxdb-1.cbqydpcjfuag.us-east-2.rds.amazonaws.com',
        database: 'lynxdb',
        password: 'Yz7S6nF2h6fgACN',
        port: 5432})
    return client
}

function db_insertAudioClip(input) {
    let client = construct_client()
    client.connect()
    let values = []
    values[0] = input.id
    values[1] = input.userid
    values[2] = input.audiopath
    values[3] = input.cliplength
    values[4] = input.filesize
    let text = 'INSERT INTO audioclips(id, userid, audiopath, cliplength, filesize) VALUES($1, $2, $3, $4, $5)'
    client.query(text, values, (err, res) => {
        if(err) {
            log('Query unsuccessful')
            log(err)
            return
        }
        log('Success')
        client.end()
    })
}

app.post('/postmemo', (req, res) => {
    db_insertAudioClip(req.body);
    res.send('Success')
})

// Post voicememo 

// Post login

// Get memos where sessionid

app.listen(port, () => {
    log("server is running :)")
})