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
	
	// show.html
	route.show= function(req, res){
		//req.params.id
		res.render('show', {});
	};

	app.get('/', route.index);
	app.get('/main', route.main);
	app.get('/show/:id', route.show);
};