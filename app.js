
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , posts = require('./routes/posts')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , couchbase = require('couchbase')
  , markdown = require( "markdown" ).markdown;


var postObjectTemplate = {
  doctype: "post",
  title: "",
  slug: "",
  versions: [],
  byline: "",
  author: "",
  created: "",
  tags: [] 
}


exports.app = app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('posts', __dirname +'/posts/');
app.set('media', __dirname +'/public/media/');
app.set('view engine', 'jade');
app.set('postObjectTemplate',postObjectTemplate);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('plastic-soul'));

app.use(express.session({
    secret: 'plastic-soul'
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.locals.md = function(text) {
  return markdown.toHTML(text);
}


var couchConfig = {
    "debug" : false,
    "user" : process.env.COUCHBASE_USER,
    "password" : process.env.COUCHBASE_PASS,
    "hosts" : [ "localhost:8091" ],
    "bucket" : "readdrop"
}


couchbase.connect(couchConfig, function (err, bucket) {
	if(err)  {
		console.log('connection error');
		throw err;
	}
	else {
		app.set('bucket', bucket);
	}
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/dashboard', admin.dashboard);
app.post('/login', admin.login);
app.post('/upload', admin.upload);
app.get('/:slug', posts.load);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
