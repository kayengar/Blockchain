var express = require('express')
var SHA256 = require("crypto-js/sha256");
var app = express()
var blockChain = []
var transactions = []


app.get('/addtransaction/:sender/:receiver/:amount/',function (request, response){
var mongoose = require("mongoose")
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://localhost/Blockchain');

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ');
}); 

mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
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

// TransactionSchema.save()



mongoose.model('BlockchainTable',BlockchainSchema)
var BlockchainTable = mongoose.model('BlockchainTable')



var tt = new TransactionTable()

// BlockchainSchema.save()
console.log('Here')
lastBlock = BlockchainTable.findOne().sort({timestamp:-1});
	temp = []
	temp.push(request.params.sender)
	temp.push(request.params.receiver)
	temp.push(request.params.amount)
	transactions.push(temp)
	tt.create(temp)
	tt.save()
	// response.send(SHA256(transactions[transactions.length-1]).toString())
	response.send(temp)
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