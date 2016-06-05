"use strict";

const attributes = {
	alpha: false,
	depth: false,
	stencil: false,
	antialias: false,
	premultipliedAlpha: false,
	preserveDrawingBuffer: false,
	failIfMajorPerformanceCaveat: true
};

var canvas, gl, program;

window.onload = main;
function main(){
	canvas = document.getElementById("game");
	gl = canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes);
	if (!gl){
		console.log("no gl :(");
		return;
	}
	
	Load.image("./assets/textest.png", drawImage);
}

//REMOVE SHADER LOADING -- FIX BEFORE USE
function drawImage(image, x, y){
	x = 0;
	y = 0;
	
	Load.text("./src/glsl/main.vert", function(vert){
		Load.text("./src/glsl/main.frag", function(frag){
			program = WebGL.createProgramFromShaders(gl, vert, frag);
			
			var positionLocation = gl.getAttribLocation(program, "a_position"); 

			// look up uniform locations
			var matrixLoc = gl.getUniformLocation(program, "tex_matrix");

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

			// Upload the image into the texture.
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			var dstX = 20;
			var dstY = 30;
			var dstWidth = 64;
			var dstHeight = 64;

			// convert dst pixel coords to clipspace coords      
			var clipX = dstX / canvas.width  *  2 - 1;
			var clipY = dstY / canvas.height * -2 + 1;
			var clipWidth = dstWidth  / canvas.width  *  2;
			var clipHeight = dstHeight / canvas.height * -2;
			
			console.log(clipX, clipY, clipWidth, clipHeight);

			// build a matrix that will stretch our
			// unit quad to our desired size and location
			gl.uniformMatrix3fv(matrixLoc, false, [
				clipWidth, 0, clipX,
				0, clipHeight, clipY,
				0, 0, 1,
			]);
			
			//gl.viewport(0, 0, canvas.width, canvas.height);
			
			// Draw the rectangle.
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		});
	});
}

