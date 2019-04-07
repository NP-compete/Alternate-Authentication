var express = require('express');
var app = express();

app.get('/', function (req, res) {
    let domain = req.query.domain;
   res.send('No ids for : ' + domain);
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})