var fs = require('fs');
var async = require('async');
var ce = require('cloneextend');

var docObj = {

}


exports.dashboard = function(req, res){
	if (req.session.username != null)
  		res.render('dashboard', {title: 'dashboard'});
  	else 
  		res.render('login', {title: 'login'});
};

exports.login = function(req,res) {
	console.log(req.body);
	if (req.body.username == "admin" && req.body.password == "password") {
		req.session.username = "admin"; 
		res.redirect('/dashboard');
	} else  {
		res.render('login', {title: 'login', error: 'incorrect username/password'});
	}

}

exports.upload = function(req, res) {
	var resObj = {
		status: 'FAIL'
		, article: {
			slug:''
			, title: ''
			, byline: ''
			, summary:''
		}

	}
	console.log(req.files.file.name);
	var ext = req.files.file.name.match(/\w+$/)[0];
	var path = '';
	var isPost = false;
	var filepath = '';

	
	if (ext == 'md') {
		path = app.get('posts');
		isPost = true;
	} else
		path = app.get('media');

	if (isPost) {
		
		var content = fs.readFileSync(req.files.file.path, {encoding: 'utf8'});
		var lines = content.split('\n');
		var title = lines[0].match(/[^#*].+/)[0].trim();
		var slug = title.replace(/[^\w\s]/g,'').replace(/\s/g,'-').toLowerCase();
	
		var bucket = app.get('bucket');
		var postObject = null;

		bucket.get(slug,function(err,doc) {
			if (!err) {
				postObject = doc;
				ext = postObject.versions.length + '';
				if (ext.length < 2) {
					ext = '0' + ext;
					
				}
			} else {
				postObject = ce.clone(app.get('postObjectTemplate'));
				postObject.title = title;
				postObject.byline = lines[1].match(/[^#*].+/)[0].trim();
				postObject.slug = slug;
				postObject.created = Date();
				postObject.author = req.session.username;
				console.log('title: ' + postObject.title);
				console.log('byline: ' + postObject.byline);
				console.log('slug: ' + postObject.slug);
				console.log('created: ' + postObject.created);
				console.log('author: ' + postObject.author);
			}

			postObject.versions.push({
				filename: slug + '.' + ext,
				timestamp: Date()
			});

			filepath = path + slug + '.' + ext;
			console.log(filepath);
			bucket.set(slug, postObject, function(err) {
				if (err)
					throw err;
			})
			
			fs.writeFile(filepath, content, function (err) {
	    		if (err) 
	    			res.send('NOPE');
	    		else {
	    			res.send('lol');
	    		}	
	  		});

		});
 		
	}
}