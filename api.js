 
// Allows us to create our HTTP Server 
const http = require("http");

// Core KOA Dependancies
const Koa = require("koa");
const koaJson = require('koa-json');
const bodyParser = require('koa-bodyparser');

// Gather routes
const defaultRoute = require('./routes/default');

// Define our constants
const API_PORT = 8051;  // port:8051 for blue 

// Create a new instance of the KOA API
const api = new Koa();

// Add Middleware
api.use(bodyParser());
api.use(koaJson());


defaultRoute(api);

// Create out server which will listen for calls to the API
http.createServer(api.callback()).listen(API_PORT);

