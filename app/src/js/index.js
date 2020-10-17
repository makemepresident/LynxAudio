const exp = require('express');
const app = exp();
const dbep = 'lynxdb-1.cbqydpcjfuag.us-east-2.rds.amazonaws.com';
const port = 8080;
const log = console.log;

// Routing
app.get('/', (req, res) => {
    try {
        res.send('hellow world');
    } catch(e) {
        log(e)
    }
});

app.listen(port, () => {
    log("server is running :)");
});

// add numbers together, send