


var express = require('express');
var app = express();
var ENS = require('ethereum-ens');
var Registrar = require('eth-registrar-ens');
var Web3 = require('web3');
var path = require('path');
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
	
	res.sendFile(path.join(__dirname + '/public/index.html'));
	 
});

app.get('/auction', function(req, res){
	res.sendFile(path.join(__dirname + '/public/auction.html'));
});

app.get('/auction/:name', function(req, res){
	res.sendFile(path.join(__dirname + '/public/auction.html'));
});

app.get('/getName/:name', function(req, res){
	var name = req.params.name
	if(typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider); 
      } else {
        let Web3 = require('web3');
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/8i79uUtEy5hyOQGNkI2x"));
	 }
	 if(web3.isConnected()) {
		ensAddress='0x314159265dd8dbb310642f98f50c066173c1259b';
		ens = new ENS(web3,  ensAddress);
		var registrar = new Registrar(web3, ens, 'eth', 7,
		  function (err, txid) {
		    registrar.getEntry(name, function (err, result) {

		    	if (result.status === 0) {
			        output = {'display':"Name is available and the auction hasn’t started!",'status':result.status};
			    } else if (result.status === 1) {
			        output = {'display':" Name is available and the auction has been started",'status':result.status};
			    } else if (result.status === 2) {
			        output = {'display':"Name is taken and currently owned by someone",'status':result.status};
			    } else if (result.status === 3) {
			        output = {'display':"Name is forbidden",'status':result.status};
			    } else if (result.status === 4) {
			        output = {'display':"Name is currently in  the ‘reveal’ stage of the auction",'status':result.status};
			    } else if (result.status === 5) {
			        output = {'display':"Name is not yet available due to the ‘soft launch’ of names.",'status':result.status};
			    } else {
			        output = "unknown status";
			    }
			  res.send(output);


			});	    
		  }
		);
	}else{
		res.send('Web3 is not Connected');

	}
});

app.listen(3000);