var Load = {
	text: function(url, callback){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url);
		xhr.onreadystatechange = function(data){
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
				callback(xhr.responseText);
			}
		};
		xhr.send();
	},

	image: function(url, callback){
		var img = new Image();
		img.onload = function(){
			callback(img);
		};
		img.src = url;
	}
};
