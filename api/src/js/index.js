const exp = require('express')
const crypto = require('crypto')
const app = exp()
const port = 80
const {Client} = require('pg') // Destructuring - equivalent to saying const tt = require('pg') and tt.Client
const formidable = require('formidable')
const Blob = require('node-blob')
const e = require('express')
const log = console.debug

// Tell express to use JSON parser for parsing incoming body data
app.use(exp.json())

// Construct the database credentials
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

// DB handing for a login request
app.post('/postlogin', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let result = {} // Build empty JSON object to be added to
    let that = res

    // Build connection to DB
    let client = construct_client()
    client.connect()
    // Prepare PostgresSQL statement to fetch information from the database
    let input = [username]
    let text = 'SELECT id, username, password, first FROM users WHERE username=$1'
    // Send the query to the database
    client.query(text, input, (err, res) => {
        if (err)  {
            log(err)
        } else {
            // If no results found, username does not exist
            if (res.rowCount == 0) {
                result["result"] = "userresult"
            // If password is valid, send a success result with some user information
            } else if (password == res.rows[0].password) {
                result["result"] = "true"
                result["username"] = res.rows[0].username
                result["id"] = res.rows[0].id
                result["firstname"] = res.rows[0].first
            // Password is incorrect
            } else {
                result["result"] = "passresult"
            }
        }
        // End connection and send result JSON
        client.end()
        that.send(JSON.stringify(result))
    })
})

// DB handling for a registration request
app.post('/postregister', (req, res) => {
    let that = res // res.send is not able to be called in the query callback, assigning it to a variable inside the scope allows it to be called
    // Prepare PostgresSQL statement to insert information into the database
    let query = 'INSERT INTO users(username, password, first, last, email) VALUES($1, $2, $3, $4, $5) ON CONFLICT ON CONSTRAINT users_username_key DO NOTHING'
    let input = [req.body.username, req.body.password, req.body.first, req.body.last, req.body.email]
    // Build connection to DB
    let client = construct_client()
    client.connect()
    // Send the query to the database
    client.query(query, input, (err, res) =>  {
        if (err) {
            console.log(err)
        } else {
            // If insertion is successful
            if (res.rowCount == 1) {
                that.send("true")
            // If insertion failed (due to username conflict)
            } else if (res.rowCount == 0) {
                that.send("false")
            }
            // End db connection
            client.end()
        }
    })
})

// DB handling for a memo recording
app.post('/postmemo', (req, res) => {
    // res.send is not able to be called in the query callback, assigning it to a variable inside the scope allows it to be called
    let that = res

    // Generate a random hash 5 bytes long
    let unique_hash = crypto.randomBytes(5)

    // Build it into a hex string
    let unique_string = unique_hash.toString('hex')

    // Prepare PostgresSQL statement to insert file metadata into the database
    let input = [null, req.body.filename, parseInt(req.body.duration), parseInt(req.body.filesize), unique_string, req.body.usergivenid]
    let text = 'INSERT INTO audio_clips(userid, filename, cliplength, filesize, url_hash, usergivenid) VALUES($1, $2, $3, $4, $5, $6)'

    // If the user is signed in, userid to an int for insertion to db
    // If the user is not signed in, will keep input[0] null
    if (!isNaN(parseInt(req.body.userid))) {
        input[0] = parseInt(req.body.userid)
    }

    // Build connection to DB
    let client = construct_client()
    client.connect()

    // Send the query to the database
    client.query(text, input, (err, res) => {
        if (err) {
            log(err)
        } else {
            // End db connection
            client.end()
            // Send the generated string back to the client
            that.send(unique_string)
        }
    })
})

// DB hanging for when a user requests a file based on unique hash
app.get('/dbreq/:unique_hash', (req, res) => {
    let that = res // res.send is not able to be called in the query callback, assigning it to a variable inside the scope allows it to be called
    let filename = {} // Build empty JSON object to be added to

    // Build connection to DB
    let client = construct_client()
    client.connect()

    // Prepare PostgresSQL statement to select file metadata into the database
    let text = 'SELECT * FROM audio_clips WHERE url_hash = $1'
    let input = [req.params.unique_hash]

    // Send the query to the database
    client.query(text, input, (err, res) => {
        if(err) {
            console.log(err)
        } else {
            // If the unique hash does not exist in the db, file does not exist
            if (res.rowCount == 0) {
                filename["result"] = "error"
            // If the hash does exist, return the meta data
            } else {
                filename["result"] = res.rows[0]
            }
        }
        // End db connection and send result JSON back to client
        client.end()
        that.send(JSON.stringify(filename))
    })
})

// DB handling for "myrecordings" page
app.post('/allmemopost', (req, res) => {
    let that = res // res.send is not able to be called in the query callback, assigning it to a variable inside the scope allows it to be called

    // Build connection to DB
    let client = construct_client()
    client.connect()

    // Prepare PostgresSQL statement to select all users file metadata into the database
    let text = 'SELECT * FROM audio_clips WHERE userid=$1 ORDER BY audio_clips.id DESC'
    let input = [req.body.userid]

    // Send the query to the database
    client.query(text, input, (err, res) => {
        if (err) {
            log(err)
        } else {
            // End db connection and send resultant rows back to client
            client.end()
            that.send(JSON.stringify(res.rows))
        }
    })
})

// DB handling for audio clip deletion
app.post('/delpost', (req, res) => {
    let that = res // res.send is not able to be called in the query callback, assigning it to a variable inside the scope allows it to be called

    // Build connection to DB
    let client = construct_client()
    client.connect()

    // Prepare PostgresSQL statement to delete the users file metadata from the database
    let text = 'DELETE FROM audio_clips WHERE filename=$1'
    let input = [req.body.filename]
    
    // Send the query to the database
    client.query(text, input, (err, res) => {
        if (err) {
            log(err)
            that.send("err")
        // If deletion is successful
        } else {
            // End db connection and send success
            client.end()
            that.send("success")
        }
    })
})

// DB handling for recent recordings
app.get('/recpost', (req, res) => {
    let that = res // res.send is not able to be called in the query callback, assigning it to a variable inside the scope allows it to be called

    // Build connection to DB
    let client = construct_client()
    client.connect()

    // Prepare PostgresSQL statement to grab the 5 most recent recordings where the userid is not null
    let text = "SELECT audio_clips.id,usergivenid,cliplength,username,url_hash "
                 + "FROM audio_clips "
                 + "INNER JOIN users ON audio_clips.userid = users.id ORDER BY audio_clips.id "
                 + "DESC LIMIT 5"

    // Send the query to the database
    client.query(text, (err, res) => {
        if (err) {
            log(err)
        } else {
            // End db connection and send resulting rows
            client.end()
            that.send(JSON.stringify(res.rows))
        }
    })
})

// Tell Express to listen for HTTP requests on selected port
app.listen(port, () => {
    log("API is running on port " + port)
})