
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'readdrop' });
  var bucket = app.get('bucket');
  console.log(bucket);
};