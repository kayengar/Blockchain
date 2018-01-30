var express = require('express')
var SHA256 = require("crypto-js/sha256");
var json = require("json-object")
var app = express()
var blockChain = []
var transactions = []
var mongoose = require("mongoose")
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://localhost/Blockchain');

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ');
}); 

mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

const TransactionSchema = new mongoose.Schema({
	sender : String,
	receiver : String, 
	amount : Number
})

const BlockchainSchema  = new mongoose.Schema({
	index: Number,
	timeStamp : Date,
	data : TransactionSchema,
	hash : String,
})

mongoose.model('TransactionTable',TransactionSchema)
var TransactionTable = mongoose.model('TransactionTable')

mongoose.model('BlockchainTable',BlockchainSchema)
var BlockchainTable = mongoose.model('BlockchainTable')

app.get('/addtransaction/:sender/:receiver/:amount/',function (request, response){

	temp = {
		sender : request.params.sender,
		receiver : request.params.receiver, 
		amount : request.params.amount
	}
    var tt = new TransactionTable(temp);
    tt.save()
	response.send(temp)
})

app.get('/getLastBlock/',function(){
	response.send(blockChain[blockChain.length-1])
})


app.get('/addBlock/',function(request,response){
	index = BlockchainTable.find().toJSON()
	console.log(index)
	timeStamp = new Date()
	previousHash = BlockchainTable.findOne().sort({timestamp:-1}).exec()
    data = TransactionTable.findOne().sort({timestamp:-1})
    console.log(data)
	temp = {
		index : index.toString(),
		timeStamp : timeStamp.toString(),
		data : data.toString(),
	    hash : SHA256(index+timeStamp+data+previousHash).toString()
	}
	var bt = new BlockchainTable(temp)
	bt.save()
	response.send(temp)
})


app.set('port', (process.env.PORT || 3001))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})