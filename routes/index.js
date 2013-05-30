
/*
 * GET home page.
 */

exports.index = function(req, res){
	var couch = app.get('bucket');
  	couch.view('dev_posts', 'by_created', {limit: 10}, function(err,view) {
     	if(err) 
     		throw err;
	else {
        console.log(view);
		res.render('index', { title: 'readdrop', posts: view });
      }
    })
};