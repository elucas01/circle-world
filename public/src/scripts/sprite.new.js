(function(){
"use strict";

var FRAGMENT_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#else
	precision mediump float;
#endif

uniform sampler2D u_sampler;

varying vec2 v_textureCoord;

void main() {
   gl_FragColor = texture2D(u_sampler, v_textureCoord);
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

function Texture(gl){
	this.unit = Texture.units++;

	this.data;
	this.width;
	this.height;

	this.gl = gl;
	this.elem;
}
Texture.prototype.load = function(source, width, height){
	if (source instanceof Image)
		this.data = source;

	else if (source instanceof ImageData)
		this.data = source;

	else if (Array.isArray(source))
		this.data = new ImageData(new Uint8ClampedArray(source), width, height);

	else
		throw new Error("Invalid source");

	this.width = this.data.width;
	this.height = this.data.height;
};
Texture.prototype.init = function(){
	if (!this.data)
		throw new Error("No data loaded.");

	var gl = this.gl;

	this.elem = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + this.unit);
	this.bind();

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.data);
};
Texture.prototype.bind = function(){
	this.gl.activeTexture(this.gl.TEXTURE0 + this.unit);
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.elem);
};
Texture.prototype.clear = function(){
	this.gl.texImage2D(this.gl.TEXTURE_2D,
										 0,
										 this.gl.RGBA,
										 this.width,
										 this.height,
										 0,
										 this.gl.RGBA,
										 this.gl.UNSIGNED_BYTE,
										 null);
}
Texture.prototype.setAsTarget = function(){
	//this.gl.bindTexture(this.gl.TEXTURE_2D, this.elem);
	this.bind();
	this.clear();

	this.frame = this.gl.createFramebuffer();
 	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frame);
 	this.frame.width = this.width;
 	this.frame.height = this.height;

	this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
			this.gl.COLOR_ATTACHMENT0,
			this.gl.TEXTURE_2D, this.elem, 0);

	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
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
Sprite.prototype.touch = function(that){
	/*var dx = this.x - that.x;
	var dy = this.y - that.y;

	return dx + this.width < 0 &&
				 dy + this.height < 0 &&
				 dx - that.width > 0 &&
				 dy - that.height > 0;*/
	 return this.x + this.width > that.x &&
 					this.y + this.height > that.y &&
 					this.x < that.x + this.width &&
 					this.y < that.y + this.height;
};

/*
function PhysicsSprite(texture, x, y, width, height){
	Sprite.call(this, texture, x, y, width, height);

	this.vx = 0;
	this.vy = 0;

	this.mass = 100;
}
PhysicsSprite.prototype = Object.create(Sprite.prototype);
PhysicsSprite.prototype.update = function(){
	this.x += this.vx;
	this.y += this.vy;
};
PhysicsSprite.prototype.force = function(fx, fy){
	this.vx += fx / this.mass;
	this.vy += fy / this.mass;
};
PhysicsSprite.prototype.collide = function(that){
	that.collideX(this);
	that.collideY(this);
};
PhysicsSprite.prototype.collideX = function(that){
	if (!this.touch(that)) return;

	var e1 = Math.max(this.x, that.x);
	var e2 = Math.min(this.x + this.width, that.x + that.width);

	var overlap = Math.abs(e2 - e1);
	var ptime = overlap / Math.abs(this.vx - that.vx);

	this.x -= this.vx * ptime;
	that.x -= that.vx * ptime;

	var m = this.mass * this.vx + that.mass * that.vx;
	var mthis = that.mass * (that.vx - this.vx);
	var mthat = this.mass * (this.vx - that.vx);
	this.vx = (m + mthis) / (this.mass + that.mass);
	that.vx = (m + mthat) / (this.mass + that.mass);

	this.x += this.vx * ptime;
	that.x += that.vx * ptime;
};
PhysicsSprite.prototype.collideY = function(that){
	if (!this.touch(that)) return;

	var e1 = Math.max(this.y, that.y);
	var e2 = Math.min(this.y + this.height, that.y + that.height);

	var overlap = Math.abs(e2 - e1);
	var ptime = overlap / Math.abs(this.vy - that.vy);

	this.y -= this.vy * ptime;
	that.y -= that.vy * ptime;

	var m = this.mass * this.vy + that.mass * that.vy;
	var mthis = that.mass * (that.vy - this.vy);
	var mthat = this.mass * (this.vy - that.vy);
	this.vy = (m + mthis) / (this.mass + that.mass);
	that.vy = (m + mthat) / (this.mass + that.mass);

	this.y += this.vy * ptime;
	that.y += that.vy * ptime;
};

function StaticSprite(texture, x, y, width, height){
	Sprite.call(this, texture, x, y, width, height);
}
StaticSprite.prototype = Object.create(Sprite.prototype);
StaticSprite.prototype.update = function(){
	//Nothing
};
StaticSprite.prototype.collide = function(that){
	this.collideX(that);
	this.collideY(that);
};
StaticSprite.prototype.collideX = function(that){
	if (!this.touch(that)) return;

	var e1 = Math.max(this.x, that.x);
	var e2 = Math.min(this.x + this.width, that.x + that.width);

	var overlap = Math.abs(e2 - e1);
	var ptime = overlap / Math.abs(that.vx);

	that.x -= that.vx * ptime;
	that.vx *= -0.5;
	that.x += that.vx * ptime;
};
StaticSprite.prototype.collideY = function(that){
	if (!this.touch(that)) return;

	var e1 = Math.max(this.y, that.y);
	var e2 = Math.min(this.y + this.height, that.y + that.height);

	var overlap = Math.abs(e2 - e1);
	var ptime = overlap / Math.abs(that.vy);

	that.y -= that.vy * ptime;
	that.vy *= -0.5;
	that.y += that.vy * ptime;
};
*/

function SpriteRenderer(gl){
	this.sprites = [];

	this.gl = gl;
	this.program;

	this.matrix;
	this.sampler;
}
SpriteRenderer.prototype.init = function(){
	var gl = this.gl;
	var fragment = gl.createShader(gl.FRAGMENT_SHADER);
	var vertex = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(fragment, FRAGMENT_SOURCE);
	gl.shaderSource(vertex,   VERTEX_SOURCE);

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
	this.sampler = gl.getUniformLocation(program, "u_sampler");
};
SpriteRenderer.prototype.add = function(sprite){
	sprite.texture.clear();
	this.sprites.push(sprite);
};
SpriteRenderer.prototype.setTextureUnit = function(unit){
	this.gl.uniform1i(this.sampler, unit);
};
SpriteRenderer.prototype.setTexture = function(texture){
	if (texture.unit)
		this.setTextureUnit(texture.unit);
};
SpriteRenderer.prototype.setMatrix = function(x, y, width, height){
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
SpriteRenderer.prototype.draw = function(){
	var sprites = this.sprites;
	for (var i = 0, l = sprites.length; i < l; i++){
		var sprite = sprites[i];

		this.setTexture(sprite.texture);
		this.setMatrix(sprite.x, sprite.y, sprite.width, sprite.height);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
	}
};

function Chunk(scale, x, y, width, height){
	this.scale = scale;
	this.data = new Array(width * height);

	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;
}
Chunk.prototype.get = function(x, y){
	return this.data[x + y * this.width];
};
Chunk.prototype.set = function(x, y, value){
	this.data[x + y * this.width] = value;
};
Chunk.prototype.select = function(sprite){
	var xs = Math.floor(sprite.x / this.scale);
	var ys = Math.floor(sprite.y / this.scale);
	var xe = Math.ceil((sprite.x + sprite.width) / this.scale);
	var ye = Math.ceil((sprite.y + sprite.height) / this.scale);

	for (var x = xs; x < xe; x++){
		for (var y = ys; x < xe; x++){

		}
	}
}
Chunk.prototype.random = function(){
	for (var i = 0; i < this.data.length; i++){
		this.data[i] = Math.floor(Math.random() * 2.0);
	}
};
Chunk.prototype.generateSprites = function(renderer, texture){
	for (var x = 0; x < this.width; x++){
		for (var y = 0; y < this.height; y++){
			if (this.get(x, y) != 0){
				var sprite = new Sprite(texture, this.x + x * this.scale, this.y + y * this.scale, this.scale, this.scale);
				renderer.add(sprite);
			}
		}
	}
};

function World(scale, width, height){
	this.scale = scale;
	this.chunkScale = 8;
	this.data = new Array(width * height);

	this.width = width;
	this.height = height;
}
World.prototype.get = function(x, y){
	return this.data[x + y * this.width];
};
World.prototype.set = function(x, y, value){
	this.data[x + y * this.width] = value;
};
World.prototype.random = function(){
	for (var x = 0; x < this.width; x++){
		for (var y = 0; y < this.height; y++){
			var chunk = new Chunk(this.scale,
														x * this.chunkScale * this.scale,
														y * this.chunkScale * this.scale,
														this.chunkScale,
														this.chunkScale);
			chunk.random();
			this.set(x, y, chunk);
		}
	}
};
World.prototype.generateSprites = function(renderer, texture){
	for (var i = 0; i < this.data.length; i++){
		this.data[i].generateSprites(renderer, texture);
	}
};

function GameView(){
	this.canvas;
	this.gl;

	this.settings = {};
}
GameView.prototype.attachToCanvas = function(canvas){
	if (typeof canvas === "string")
		canvas = document.getElementById(canvas);

	this.canvas = canvas;

	this.gl = canvas.getContext('webgl', this.settings) ||
					  canvas.getContext('experimental-webgl', this.settings);

	if (!this.gl)
		throw new Error("Could not create WebGL context.");

	canvas.addEventListener("click", function(){
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		}
		else if (canvas.webkitRequestFullScreen) {
			canvas.webkitRequestFullScreen();
		}
		else if (canvas.mozRequestFullScreen){
			canvas.mozRequestFullScreen();
		}
	});

	this.resize();
};
GameView.prototype.resize = function(){
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};
GameView.prototype.createSpriteRenderer = function(){
	return new SpriteRenderer(this.gl);
};
GameView.prototype.createTexture = function(){
	return new Texture(this.gl);
};


//Exports
window.Texture = Texture;
window.Sprite = Sprite;
window.Chunk = Chunk;
window.World = World;
/*window.PhysicsSprite = PhysicsSprite;
window.StaticSprite = StaticSprite;*/
window.SpriteRenderer = SpriteRenderer;
window.GameView = GameView;

})();
