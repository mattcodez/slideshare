"use strict";
$(init);

function init(){
	handlers();
	listShows();
}

function listShows(){
	var el = $('#shows');
	getShows(function(shows){
		for (var i = 0; i < shows.length; i++){
			addShowItem(el, shows[i]);
		}
	});
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

function addShowItem(el, show){
	el.append('<p></p>').append(
		$('<a></a>')
		.text(show.title)
		.attr('href', '/show/' + show._id)
	);
}

/**Ajax**/
function createShow(data, cb){
	$.post('/api/post', data, function(show){
		cb(show);
	}).fail(function(err){
		console.dir(arguments);
	});
}

function getShows(cb){
	$.get('/api/posts', function(data){
		cb(data.posts);
	});
}