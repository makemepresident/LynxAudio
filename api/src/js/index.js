const exp = require('express')
const app = exp()
const port = 8080
const {Client} = require('pg') // Destructuring - equivalent to saying const tt = require('pg') and tt.Client
// const port = 5432
const log = console.log
app.use(exp.json())

function parseInput(input) {
    // Make sure all parameters are passed
    if (input.length != 5) {
        log("Input length incorrect");
        return false;
    }

    // Check to make sure all values that should be ints are ints
    if (typeof input.id != "number" ||
        typeof input.userid != "number" ||
        typeof input.cliplength != "number" ||
        typeof input.filesize != "number") {
            log("Not all values that should be ints are ints. Error");
            return false;
    }

    // Checks length of all of the ints to make sure they're within the DB
    if (input.id.length > 6) {
        log("Escaped bounds of ids")
        return false
    }
    if (input.userid.length > 6) {
        log("Escaped bounds of UserIDs")
        return false
    }
    if (input.cliplength.length > 5000) {
        log("Cliplength too long to store!")
        return false
    }
    if (input.filezize.length > 2) {
        log("Escaped bounds of filesize")
        return false
    }
    return true
}

function construct_client() {
    let client = new Client({
        user: 'postgres',
        host: 'lynxdb-1.cbqydpcjfuag.us-east-2.rds.amazonaws.com',
        database: 'lynxdb',
        password: 'Yz7S6nF2h6fgACN',
        port: 5432})
    return client
}

app.post('/postmemo', (req, res) => {
    let input = req.body
    if (parseInput(input) != true)
        return
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
    res.send('Success')
})

// Post login

// Get memos where sessionid

app.listen(port, () => {
    log("server is running :)")
})