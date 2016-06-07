"use strict";

const attributes = {
	alpha: false,
	depth: false,
	stencil: false,
	antialias: false,
	premultipliedAlpha: false,
	preserveDrawingBuffer: true,
	failIfMajorPerformanceCaveat: true
};

var gl;
var player;

window.onload = main;
function main(){
	var canvas = document.getElementById("game");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);
	if (!gl){
		console.log("no gl :(");
		return;
	}
	
	Load.image("./assets/textest.png", function(image){
		player = new Sprite(image, 0, 0, 64, 64);
		player.init(gl);
		draw();
	});
}

window.onresize = resize;
function resize(){
	var canvas = document.getElementById("game");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	gl.viewport(0, 0, canvas.width, canvas.height);
}

function draw(){
	var time = Date.now() * 0.001;
	
	gl.clearColor(0, 0, 0, 0);
	
	player.x = Math.cos(time) * 128 + 64;
	player.y = Math.sin(time) * 128 + 64;
	player.update(gl);
	player.draw(gl);
	
	window.requestAnimationFrame(function(){
		window.setTimeout(draw, 15);
	});
}






