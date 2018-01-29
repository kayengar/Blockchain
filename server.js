var express = require('express')
var SHA256 = require("crypto-js/sha256");
var app = express()
var blockChain = []
var transactions = []
function print(){
	blockChain.push("val");

	return transactions;
}

app.get('/addtransaction/:sender/:receiver/:amount/',function (request, response){
	temp = []
	temp.push(request.params.sender)
	temp.push(request.params.receiver)
	temp.push(request.params.amount)
	transactions.push(temp)
	response.send(SHA256(transactions[transactions.length-1]).toString())
})

app.get('/getLastBlock/',function(){
	response.send(blockChain[blockChain.length-1])
})

// app.get('/hash/:index/:previousHash/:timeStamp/:data',function (request,response){
// 	response.send(.toString())
// })

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
	response.send(blockChain[blockChain.length-1])
})


app.set('port', (process.env.PORT || 3001))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send(print())
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})