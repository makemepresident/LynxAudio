const exp = require('express')
const app = exp()
const api_host = "PLACEHOLDER -- will be localhost of some sort (same EC2 instance)"
const port = 8080
const log = console.log

// Routing
app.get('/', (req, res) => {
    res.send('henlo')
})

app.listen(port, () => {
    log("server is running :)")
})