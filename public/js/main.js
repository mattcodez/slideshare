$(init);

function init(){
	handlers();
}

function handlers(){
	$('#newShow').submit(function(e){
		e.preventDefault();
		var form = $(this);
		createShow({post:{title:form.find('[name=title]').val()}},function(show){
			if (show._id){
				window.location = '/show/' + show._id;
			}
		});
		
		return false;
	});
}

/**DOM**/
function displayShow(el, show){
	el.append($('<h1></h1>').text(show.title));
}

/**Ajax**/
function createShow(data, cb){
	$.post('/api/post', data, function(show){
		cb(show);
	}).fail(function(err){
		console.dir(arguments);
	});
}