$(init);

function init(){
	handlers();
}

function handlers(){
	$('#newShow').onSubmit(function(e){
		e.preventDefault();
		createShow($(this).serializeArray(),function(show){
			var pane = $('#show');
			displayShow(pane, show);
			pane.show();
		);
		
		return false;
	});
}

/**DOM**/
function displayShow(el, show){
	el.append($('<h1></h1>').text(show.name));
}

/**Ajax**/
function createShow(data, cb){
	$.post('/api/post', data, function(show){
		cb(show);
	});
}