"use strict";

const attributes = {
	alpha: false,
	depth: false,
	stencil: false,
	antialias: true,
	premultipliedAlpha: false,
	preserveDrawingBuffer: false,
	failIfMajorPerformanceCaveat: true
};

var canvas, gl, program;
var img;

window.onload = main;
function main(){
	canvas = document.getElementById("game");
	gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);
	if (!gl){
		console.log("no gl :(");
		return;
	}
	
	setup();
}

function setup(){
	Load.text("./src/glsl/main.vert", function(vert){
		Load.text("./src/glsl/main.frag", function(frag){
			program = WebGL.createProgramFromShaders(gl, vert, frag);
			var positionLocation = gl.getAttribLocation(program, "a_position"); 
			
			// provide texture coordinates for the rectangle.
			var positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			  0.0,  0.0,
			  1.0,  0.0,
			  0.0,  1.0,
			  0.0,  1.0,
			  1.0,  0.0,
			  1.0,  1.0]), gl.STATIC_DRAW);
			  
			  
			gl.enableVertexAttribArray(positionLocation);
			gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);

			// Set the parameters so we can render any size image.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

			Load.image("./assets/textest.png", function(res){
				console.log("image loaded");
				img = res;
				draw();
			});
		});
	});
}

function draw(){
	// look up uniform locations
	var matrixLoc = gl.getUniformLocation(program, "tex_matrix");
	
	setImage(img);
	
	
	var t = Date.now() * 0.0001;
	for (var i = 0; i < 10; i++){
		t += Math.PI * 0.2;
		moveImage(matrixLoc, Math.sin(t) * 100 + 100, Math.cos(t) * 50 + 50, 64, 64)
		renderImage();
	}
	
	window.requestAnimationFrame(function(){
		window.setTimeout(draw, 15);
	});
}


/*function drawImage(image, matrixLoc, x, y, width, height){
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    
	var clipX = x / canvas.width  *  2 - 1;
	var clipY = y / canvas.height * -2 + 1;
	var clipWidth = width  / canvas.width  *  2;
	var clipHeight = height / canvas.height * -2;
	
	gl.uniformMatrix3fv(matrixLoc, false, [
		clipWidth, 0, clipX,
		0, clipHeight, clipY,
		0, 0, 1,
	]);
	
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}*/

function setImage(image){
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}

function moveImage(matrix, x, y, width, height){
	var clipX = x / canvas.width  *  2 - 1;
	var clipY = y / canvas.height * -2 + 1;
	var clipWidth = width  / canvas.width  *  2;
	var clipHeight = height / canvas.height * -2;
	
	gl.uniformMatrix3fv(matrix, false, [
		clipWidth, 0, clipX,
		0, clipHeight, clipY,
		0, 0, 1,
	]);
}

function renderImage(){
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}



