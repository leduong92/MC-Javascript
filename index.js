
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var db = require('./db.js');

var app = express();
var MCProtocol = require('./app.js');

app.use('/app', MCProtocol);

var Mc = new MCProtocol();
Mc.initiateConnection({port: 25884, host: '10.203.83.61', ascii: true}, connected); 
app.get('/', (req, res) => {
    res.send('OK');
    console.log(Mc.result);
});
function connected(err) {
	if (typeof(err) !== "undefined") {
		// We have an error.  Maybe the PLC is not reachable.  
		console.log(err);
		process.exit();
	}
}
var port = process.env.PORT | 5000;
app.listen(port, () => {
    console.log('Server running in port:' + port);
});
