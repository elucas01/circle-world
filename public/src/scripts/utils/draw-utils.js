"use strict";

function drawImage(image, x, y, width, height){	
	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	// look up uniform locations
	var matrixLoc = gl.getUniformLocation(program, "tex_matrix");

	// convert dst pixel coords to clipspace coords      
	var clipX = x / canvas.width  *  2 - 1;
	var clipY = y / canvas.height * -2 + 1;
	var clipWidth = width  / canvas.width  *  2;
	var clipHeight = height / canvas.height * -2;
	
	//console.log(clipX, clipY, clipWidth, clipHeight);

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
}

function WebGL2D(){
	var gl, canvas;
	
	this.init = function(canvas){
		if (typeof canvas === 'string') canvas = document.getElementById(canvas);
		gl = canvas.getContext('webgl', WebGL2D.attributes) || 
			 canvas.getContext('experimental-webgl', WebGL2D.attributes);
		if (!gl) throw new Error("Failed to create WebGL context.");
	};
	this.createShader = function(type, code){
		var shader = gl.createShader(gl[type]);
		gl.shaderSource(shader, code);
		gl.compileShader(shader);
		if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS)) {
			throw new Error(type + ": " + gl.getShaderInfoLog(fs));
		}
		return shader;
	};
	this.createProgramFromShaders = function(vert, frag){
		var program = gl.createProgram(); 
		gl.attachShader(program, vert); 
		gl.attachShader(program, frag);
		gl.linkProgram(program);
		gl.useProgram(program);
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error("PROGRAM: \n" + gl.getProgramInfoLog(program));
		}
		return program;
	};
	this.createVertexBuffer = function(vertices){
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	};
	this.setVertexBufferAttrib = function(program, name){
		var position = gl.getAttribLocation(program, name);
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
	};
	this.setVertex
	
	this.renderImage = function(program, image, x, y, width, height){
		
	};
	
	this.program = WebGL.createProgramFromShaders(gl, vert, frag);
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
}

WebGL2D.attributes = {
	alpha: false,
	depth: false,
	stencil: false,
	antialias: false,
	premultipliedAlpha: false,
	preserveDrawingBuffer: false,
	failIfMajorPerformanceCaveat: true
};