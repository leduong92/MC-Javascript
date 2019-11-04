var net = require('net');
var util = require('util');
var effectiveDebugLevel = 0;

var dgram = require("dgram");

module.exports = MCProtocol;

function MCProtocol() {
    var self = this;
	self.isoclient = undefined; 
	self.isoConnectionState = 0;
	self.isAscii = 1;
	self.connectionParams = undefined;
	self.connectionID = 'UNDEF';
    self.protocol = false;
    self.result = undefined;
}

MCProtocol.prototype.initiateConnection = function(cParam, callback) {
    var self = this;

    if (cParam === undefined) { cParam = { port: 25884, host: '10.203.83.65', ascii: false, tcp: false }; }

    outputLog('Initiate Called - Connecting to PLC with address and parameters:');
	outputLog(cParam);

    if (typeof(cParam.name) === 'undefined') {
		self.connectionID = cParam.host;
	} else {
		self.connectionID = cParam.name;		
	}
    if (typeof(cParam.ascii) === 'undefined') {
		self.isAscii = false;
	} else {
		self.isAscii = cParam.ascii;		
    }

    if (typeof(cParam.protocol) === 'undefined')
        self.protocol = false;
    else 
        self.protocol = cParam.protocol;

    self.connectionParams = cParam;
	self.connectCallback = callback;
    self.connectNow(self.connectionParams, false);
}
MCProtocol.prototype.dropConnection = function () {
	var self = this;
	if (typeof(self.isoclient) !== 'undefined') {
		self.isoclient.end();
	}		
	self.connectionCleanup();  
}
MCProtocol.prototype.receiveData = function() {
    var self = this;
}
MCProtocol.prototype.connectNow = function(cParam, suppressCallback) {
    var self = this;
    self.connectionCleanup();
    self.isoclient = dgram.createSocket("udp4");

    self.isoclient.on("message", function(message, rinfo) {
        self.result = message.toString();
        //console.log(self.result);
        self.isoclient.close((err) => {
            if (err) console.log('Error when receive buffer from PLC: ', err);
        });
    });
    self.isoclient.on("listening", function() {
        self.isoclient.send('500000FF03FF000018001004010000D*0000000001', cParam.port, cParam.host, (err,bytes) => {
            if (err)
                console.log("err: "+err+" bytes: "+bytes);
        });
    });
    self.isoclient.on("close", function() {
        console.log("closed");
    });
    self.isoclient.on("error", function(err) {
        console.log("error: ",err);  
    });
    self.isoclient.bind(cParam.port);

	outputLog('<initiating a new connection>',1,self.connectionID);  
    outputLog('Attempting to connect to host...',0,self.connectionID);
}
MCProtocol.prototype.McCommand = function () {
    return 5;
}
MCProtocol.prototype.connectionCleanup = function() {
	var self = this;
    console.log('Connection cleanup is happening');	
	if (typeof(self.isoclient) !== "undefined") {
		self.isoclient.removeAllListeners('message');
		self.isoclient.removeAllListeners('error');
		self.isoclient.removeAllListeners('connect');
		self.isoclient.removeAllListeners('listening');
    }
}

function outputLog(txt, debugLevel, id) {
	var idtext;
	if (typeof(id) === 'undefined') {
		idtext = '';
	} else {
		idtext = ' ' + id;
	}
	if (typeof(debugLevel) === 'undefined' || effectiveDebugLevel >= debugLevel) { console.log('[' + process.hrtime() + idtext + '] ' + util.format(txt)); }
}
