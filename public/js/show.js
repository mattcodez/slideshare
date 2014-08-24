$(init);

function init(){
	var sections = window.location.pathname.split('/');
	var showId = sections[sections.length - 1];
	var photoList = [];

	var socket = io.connect('/');

	socket.emit('setShow', {showId:showId});

	socket.on('updatePhotoList', function(data){
		if (data){
			photoList = data;
			showPic(photoList.length - 1); //Always show latest pic
			resetSwap(); //Give latest pic full time
		}
	});

	//Get initial show data
	$.getJSON('/api/post/' + showId, function(show){
		loadSection($(document.body), show.post);
		photoList = show.post.photos || photoList;
	});

	var newImageForm = $('#newImage');
	var fileInput = newImageForm.find('INPUT[type=file]');

	//Trigger file selection from separate button
	$('#picAdd BUTTON').on('click', function(){
		fileInput.click();
	});

	//Submit form when file is selected
	fileInput.on('change', function(){
		newImageForm.submit();
	});

	//Upload new photos
	newImageForm.submit(function(e){
		e.preventDefault();
		var form = $(this);

		var formData = getImageFormData(form.find('input[type=file]')[0].files);

		$.ajax({
			url: '/api/post/' + showId,
			data: formData,
			processData: false,
			contentType: false,
			type: 'PUT',
			success: function(show){
				photoList = show.photos || photoList;
			}
		});
	});

	//Swap photos
	var pic = $('#picture img');
	var picIndex = 0;
	function swapPic(){
		if (!photoList[picIndex]){
			if (photoList.length === 0){
				return;
			}
			picIndex = 0;
		}

		showPic(picIndex++);
	}

	var swapInterval = null;
	function resetSwap(){
		var swapDelay = 4000;
		clearInterval(swapInterval);
		swapInterval = setInterval(swapPic, swapDelay);
	}
	resetSwap(); //init

	function showPic(index){
		var photo = photoList[index];
		pic.attr('src', '/uploads/' + photo);
	}

	//Generate QRCode
	var qrcode = new QRCode("qrcode", {
		text: window.location.href,
		correctLevel : QRCode.CorrectLevel.H
	});
}

function getImageFormData(files){
	var formData = new FormData();
	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		if (!file.type.match('image.*')) {
			continue;
		}

		formData.append('photos', file, file.name);
	}

	return formData;
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
