var fs = require('fs');



exports.load = function(req, res){
	var couch = app.get('bucket');
  	couch.view('dev_posts', 'by_id', { key: req.params.slug}, function(err,view) {
     	if(err) 
     		throw err;
	else {
		var post = view[0];
		var content = fs.readFileSync(app.get('posts') + '/' + post.value.latest.filename, {encoding: 'utf8'});
		var lines = content.split('\n');
		var postBody = lines.slice(2).join('\n');
		post.value.body = postBody;
		res.render('post', { title: 'readdrop', post: post });
      }
    })
};