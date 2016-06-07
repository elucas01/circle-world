var WebGL = {
	createProgramFromShaders: function(gl, vertexCode, fragmentCode){
		var fragment = gl.createShader(gl.FRAGMENT_SHADER);
		var vertex = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(fragment, fragmentCode);
		gl.shaderSource(vertex, vertexCode);
		//gl.compileShader(vertex);

		gl.compileShader(fragment);
		if(!gl.getShaderParameter(fragment,gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(fragment));
			return;
		}
		
		gl.compileShader(vertex);
		if(!gl.getShaderParameter(vertex,gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(vertex));
			return;
		}
		
		var program = gl.createProgram(); 
		gl.attachShader(program,vertex); 
		gl.attachShader(program,fragment);
		gl.linkProgram(program);
		gl.useProgram(program);
		
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.log(gl.getProgramInfoLog(program));
			return;
		}
		
		return program;
	}
};

/*
var WebGL = {};
WebGL.shaderFromCode = function(gl, type, code){
	var shader = gl.createShader(gl[type]);
	gl.shaderSource(shader, code);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS)) {
		throw new Error(type + ": " + gl.getShaderInfoLog(fs));
	}
	return shader;
};
WebGL.programFromShaders = function(gl, vertex, fragment){
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
WebGL.
*/



