function Sprite(image, x, y, width, height){
	this.image = image;
	
	this.x = x;
	this.y = y;
	this.width =  width;
	this.height = height;
}
Sprite.prototype.init = function(gl){
	var fragment = gl.createShader(gl.FRAGMENT_SHADER);
	var vertex = gl.createShader(gl.VERTEX_SHADER);
	
	gl.shaderSource(fragment, Sprite.fragment);
	gl.shaderSource(vertex,   Sprite.vertex);
	
	gl.compileShader(fragment);
	
	if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fragment));
		return;
	}
	
	gl.compileShader(vertex);
	if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vertex));
		return;
	}
	
	var program = gl.createProgram(); 
	gl.attachShader(program, vertex); 
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	gl.useProgram(program);
	
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log(gl.getProgramInfoLog(program));
		return;
	}
	
	var pos = gl.getAttribLocation(program, "pos");
	
	
	
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]), gl.STATIC_DRAW);
	
	
	gl.enableVertexAttribArray(pos);
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	this.matrix = gl.getUniformLocation(program, "texm");
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
};
Sprite.prototype.update = function(gl, canvas){
	var clipX = this.x / gl.canvas.width  *  2 - 1;
	var clipY = this.y / gl.canvas.height * -2 + 1;
	var clipWidth = this.width  / gl.canvas.width  *  2;
	var clipHeight = this.height / gl.canvas.height * -2;
	
	gl.uniformMatrix3fv(this.matrix, false, [
		clipWidth, 0, clipX,
		0, clipHeight, clipY,
		0, 0, 1,
	]);
};
Sprite.prototype.texture = function(gl){
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
};
Sprite.prototype.draw = function(gl){
	gl.drawArrays(gl.TRIANGLES, 0, 6);
};

Sprite.fragment = `#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float; 
#else
	precision mediump float;
#endif

uniform sampler2D image;

varying vec2 texCoord;

void main() {
   gl_FragColor = texture2D(image, texCoord);
}`;

Sprite.vertex = `attribute vec2 pos;
uniform mat3 texm;

varying vec2 texCoord;

void main(){
	gl_Position = vec4(vec3(pos, 1) * texm, 1);
    texCoord = pos; 
}`;


