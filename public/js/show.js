$(init);

function init(){
	var sections = window.location.pathname.split('/');
	var showId = sections[sections.length - 1];
	
	$.getJSON('/api/post/' + showId, function(show){
		loadSection($(document.body), show.post);
	});
}

function loadSection(el, data){
	var dataLinks = el.find('[data-link]');
	for (var i = 0; i < dataLinks.length; i++){
		var dataLinkEl = $(dataLinks[i]);
		var propName = dataLinkEl.attr('data-link');
		var dataItem = data[propName];
		if (dataItem !== null || dataItem !== undefined){
			dataLinkEl.text(dataItem);
		}
	}
}