module.exports = function(app) {
	var route = {};

	// index.html
	route.index = function (req, res) {
	  res.render('index', {locals: { routes: app._router.stack }});
	};
	
	// main.html
	route.main = function(req, res){
		res.render('main', {});
	};

	app.get('/', route.index);
	app.get('/main', route.main);
};