var express = require('express')
var SHA256 = require("crypto-js/sha256");
var mongoose = require("mongoose")
var app = express()
var blockChain = []
var transactions = []

var db = mongoose.connect('mongodb://localhost/blockchain');

const TransactionSchema = new Schema({
	sender : String,
	receiver : String, 
	amount : Number
})

const BlockchainSchema  = new Schema({
	index: Number,
	timeStamp : Date,
	data : TransactionSchema,
	hash : String,
})


mongoose.model('BlockchainTable',BlockchainSchema)
var BlockchainTable = mongoose.model('BlockchainTable')
console.log('Here')
lastBlock = BlockchainSchema.findOne().sort({timestamp:-1});

mongoose.model('TransactionTable',TransactionSchema)
var TransactionTable = mongoose.model('TransactionTable')


app.get('/addtransaction/:sender/:receiver/:amount/',function (request, response){
	temp = []
	temp.push(request.params.sender)
	temp.push(request.params.receiver)
	temp.push(request.params.amount)
	transactions.push(temp)
	// TransactionTable.create(temp)
	// response.send(SHA256(transactions[transactions.length-1]).toString())
	response.send(lastBlock)
})

app.get('/getLastBlock/',function(){
	response.send(blockChain[blockChain.length-1])
})


app.get('/addBlock/',function(request,response){
	index = blockChain.length
	timeStamp = new Date().getTime() / 1000
	data = transactions[transactions.length-1]
	if(blockChain.length>0)
		previousHash = blockChain[blockChain.length-1][4]
	else
		previousHash = SHA256("random")
	hash = SHA256(index+timeStamp+data+previousHash).toString()
	temp = []
	temp.push(index)
	temp.push(timeStamp)
	temp.push(data)
	temp.push(hash)
	blockChain.push(temp)
	BlockchainTable.create(temp)
	response.send(blockChain[blockChain.length-1])
})


app.set('port', (process.env.PORT || 3001))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})