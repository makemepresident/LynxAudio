const exp = require('express')
const path = require('path')
const app = exp()
const api_host = "PLACEHOLDER -- will be localhost of some sort (same EC2 instance)"
const port = 8080
const log = console.log

log(path.join(__dirname, '../public'))
app.use(exp.static(path.join(__dirname, '../public')))

app.listen(port, () => {
    log("Webapp is running")
})