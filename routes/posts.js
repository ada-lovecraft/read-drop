var fs = require('fs');



exports.load = function(req, res){
	var couch = app.get('bucket');
  	couch.view('dev_posts', 'by_id', { key: req.params.slug}, function(err,view) {
     	if(err) 
     		throw err;
	else {
		var post = view[0];
		post.value.body = fs.readFileSync(app.get('posts') + '/' + post.value.latest.filename, {encoding: 'utf8'});
		res.render('post', { title: 'readdrop', post: post });
      }
    })
};