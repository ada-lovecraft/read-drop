
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , couchbase = require('couchbase')


exports.app = app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var couchConfig = {
    "debug" : false,
    "user" : process.env.COUCHBASE_USER,
    "password" : process.env.COUCHBASE_PASS,
    "hosts" : [ "localhost:8091" ],
    "bucket" : "default"
}


couchbase.connect(couchConfig, function (err, bucket) {
	if(err)  {
		console.log('connection error');
		throw err;
	}
	else {
		app.set('bucket', bucket);
		couch = bucket;

	}
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
