/* GET home page */
module.exports.index = function(req, res){
  res.render('index', { title: 'QuikRent' });
};

module.exports.login = function(req, res){
  res.render('login', { title: 'QuikRent Register or Login' });
};