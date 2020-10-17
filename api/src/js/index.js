const exp = require('express')
const app = exp()
const dbep = 'lynxdb-1.cbqydpcjfuag.us-east-2.rds.amazonaws.com'
const port = 8080
const {Pool, Client} = require('pg')
// const port = 5432
const log = console.log

// Post voicememo data
app.post('/postmemo', (req, res) => {
    // check headers
    // check authentication
    // make insert request to db
    let client = new Client({
        user: 'postgres',
        host: dbep,
        database: 'lynxdb',
        password: 'Yz7S6nF2h6fgACN',
        port: port}).connect()

    client.query('INSERT INTO audioclips(id, userid, audiopath, cliplength, filesize) VALUES($1, $2, $3, $4, $5)')
})

// Post login

// Get memos where sessionid

app.listen(port, () => {
    log("server is running :)")
})