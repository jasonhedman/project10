'use strict';

// load modules
var cors = require('cors')
const express = require('express');
const morgan = require('morgan');
var jsonParser = require('body-parser').json;

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));
app.use(jsonParser());

// TODO setup your api routes here

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept. Authorization");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   return res.status(200).json({});
//   next();
// })

app.use(cors())

var router = require('./routes');

app.use('/api', router);

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/fsjstd-restapi");

var db = mongoose.connection;

db.on('error', (err) => {
  console.error("connection error:", err);
})

db.once("open", () => {
  console.log("db connection successful");
})

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use(function(err, req, res, next){
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
