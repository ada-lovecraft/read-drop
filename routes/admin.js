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