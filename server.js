/* Core */
var path = require("path"),
    fs = require("fs");

/* Other */
var express = require("express"),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    ejs = require('ejs');

var routes = require("./lib/routes");

/* Constants */
var TEMPLATE_PATH = path.join( __dirname, "/templates" );

/* App kickoff */
var app = express();

app.set('view engine', 'ejs');
app.set('views', TEMPLATE_PATH);
app.engine('html', ejs.renderFile);
app.use( express.static(__dirname) );
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost/test');

/* Routes */
app.get( '/', routes.index );
app.get( '/read/:id', routes.read );

/* JSON API */
app.get( '/posts', routes.getPosts );
app.get( '/posts/:id', routes.getPost );
app.get( '/enrich/:id', routes.enrich );
app.get( '/markasread/:id', routes.markAsRead );

app.get( '/sync', routes.syncAll );
//app.get( '/sync/:id', routes.sync );

app.listen( 3000 );
