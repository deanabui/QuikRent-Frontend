/* GET home page */
module.exports.index = function(req, res){
  res.render('index', { title: 'QuikRent' });
};

module.exports.register = function(req, res){
  res.render('register', { title: 'Register for QuikRent' });
};

module.exports.login = function(req, res){
  res.render('login', { title: 'Log into QuikRent' });
};

module.exports.account = function(req, res){
  res.render('account', { title: 'Log into QuikRent' });
};