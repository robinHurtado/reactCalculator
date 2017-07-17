const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Schema = mongoose.Schema;

const mathSchema = new Schema({
	input: { type: String, required: true },
	result: String
});

const Operation = mongoose.model('Math', mathSchema);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Configure Mongoose and connect to MongoDB
 */
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/MathOperations', function(err){
	if (err) 	console.log('ERROR: could not connect to mongoDB. Is it running? (use `mongod`)');		
	console.log('connected to mongoDB');
});
	
app.get('/operations', (req, res) => {
	Operation.find((err, results) => {
		if (err) return res.status(500).send(err);
		
		res.send(results);
	});
});

app.post('/operation', (req, res) => {
	const result = eval(req.body.operation);
	const newOperation = new Operation({
		input: req.body.operation,
		result: result
	});

	newOperation.save((err, operation) => {
		if (err) return res.status(500).send(err);

		res.send(operation);
	});
});

/**
 * default route: send html
 */
app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

/**
 * Start server
 */
const server = app.listen('8081', function() {
  console.log('Server up and running at port ' + server.address().port)
});
