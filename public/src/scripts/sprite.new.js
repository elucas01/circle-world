(function(){

var FRAGMENT_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

uniform sampler2D u_sampler;

varying vec2 v_textureCoord;

void main() {
   gl_FragColor = texture2D(u_sampler, textureCoord);
}
`;

var VERTEX_SOURCE = `
attribute vec2 a_position;
uniform mat3 u_textureMatrix;

varying vec2 v_textureCoord;

void main(){
	gl_Position = vec4(vec3(a_position, 1) * u_textureMatrix, 1);
  v_textureCoord = a_position;
}
`;


function SpriteGroup(gl){
	this.sprites = [];

	this.gl = gl;
	this.program;

	this.matrix;
	this.sampler;
}
SpriteGroup.prototype.init = function(){
	var gl = this.gl;
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

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]), gl.STATIC_DRAW);

	var a_position = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(a_position);
	gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

	this.matrix = gl.getUniformLocation(program, "u_textureMatrix");
};
SpriteGroup.prototype.setTextureUnit = function(unit){
	this.gl.uniform1i(this.sampler, unit);
};
SpriteGroup.prototype.setTexture = function(texture){
	if (texture.unit)
		this.setTextureUnit(texture.unit);
};
SpriteGroup.prototype.setMatrix = function(x, y, width, height){
	var clipX = x / this.gl.canvas.width  *  2 - 1;
	var clipY = y / this.gl.canvas.height * -2 + 1;
	var clipWidth = width  / this.gl.canvas.width  *  2;
	var clipHeight = height / this.gl.canvas.height * -2;

	this.gl.uniformMatrix3fv(this.matrix, false, [
		clipWidth, 0, clipX,
		0, clipHeight, clipY,
		0, 0, 1,
	]);
};
SpriteGroup.prototype.draw = function(){
	var sprites = this.sprites;
	for (var i = 0, l = sprites.length; i < l; i++){
		var sprite = sprites[i];

		this.setTexture(sprite.texture);
		this.setMatrix(sprite.x, sprite.y, sprite.width, sprite.height);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
};


function Texture(source, width, height){
	this.load(source, width, height);

	this.unit = Texture.units++;

	this.data;
	this.width;
	this.height;

	this.elem;
}
Texture.prototype.load = function(source, width, height){
	if (source instanceof Image)
		this.data = source.imageData;

	else if (source instanceof ImageData)
		this.data = source;

	else if (Array.isArray(source))
		this.data = new ImageData(new Uint8ClampedArray(source), width, height);

	else
		throw new Error("Invalid source");

	this.width = this.data.width;
	this.height = this.data.height;
};
Texture.prototype.init = function(gl){
	if (!this.data)
		throw new Error("No data loaded.");

	this.elem = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + this.id);
	this.bind(gl);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.data);
};
Texture.prototype.bind = function(gl){
	gl.bindTexture(gl.TEXTURE_2D, this.elem);
};
Texture.units = 0;


function Sprite(texture, x, y, width, height){
	this.texture = texture;

	this.x = x || 0;
	this.y = y || 0;
	this.width =  width || 64;
	this.height = height || 64;
}
Sprite.prototype.setTexture = function(texture){
	this.texture = texture;
};
Sprite.prototype.size = function(width, height){
	this.width = width;
	this.height = height;
};
Sprite.prototype.position = function(x, y){
	this.x = x;
	this.y = y;
};


//Exports
window.Texture = Texture;
window.Sprite = Sprite;
window.SpriteGroup = SpriteGroup;

})();
