const CHUNK_SHADER_FRAG = `/* @include glsl/chunk-shader.frag */`;
const CHUNK_SHADER_VERT = `/* @include glsl/chunk-shader.vert */`;

const BLOCK_SHADER_FRAG = `/* @include glsl/block-shader.frag */`;
const BLOCK_SHADER_VERT = `/* @include glsl/block-shader.vert */`;

const TERRAIN_TEST_FRAG = `/* @include glsl/terrain-test.frag */`;


function Grid(width, height, data){
  // this.vertices;
  // this.indices;
  // this.vbo;
  // this.ibo;

  this.width = width;
  this.height = height;
  this.data = data || new Array(width * height);
}
Grid.prototype.initVertices = function(){
  var xscale = 2 / (this.width);
  var yscale = 2 / (this.height);

  var p, v = [];
  var x, w = this.width;
  var y, h = this.height;

  for (x = 0; x <= w; x++){
    for (y = 0; y <= h; y++){
      p = (x + y * (w + 1)) * 2;
      var r = 1.0;//(Math.random() * 0.2 + 0.8);
      v[p + 0] = (x * xscale - 1) * r;
      v[p + 1] = (y * yscale - 1) * r;
    }
  }

  this.vertices = v;
};
Grid.prototype.initIndices = function(){
  var p, i = [];
  var l = 0;
  var x, w = this.width;
  var y, h = this.height;
  var d = this.data;

  for (x = 0; x < w; x++){
    for (y = 0; y < h; y++){
      if (d[x + y * w]){
        p = x + y * (w + 1);
        // 6 is the number of vertices needed to make a square from two triangles
        i[l++] = p;
        i[l++] = p + 1;
        i[l++] = p + w + 1;
        i[l++] = p + 1;
        i[l++] = p + w + 1;
        i[l++] = p + w + 2;
      }
    }
  }

  this.indices = i;
};
Grid.prototype.createBuffers = function(gl, program){
  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

  var a_position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);


  var ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

  this.vbo = vbo;
  this.ibo = ibo;
};
Grid.prototype.bindBuffers = function(gl){
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
};
Grid.prototype.drawBuffers = function(gl){
  gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
};

function Chunk(x, y, width, height, texture){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.texture = texture;
}
Chunk.prototype.prepare = function(gl){
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
};

function ChunkRenderer(gl){
	this.gl = gl;
	this.chunks = [];
  // this.ps;

	// this.vbo;
	// this.program;
	// this.umatrix;
}
ChunkRenderer.prototype.add = function(chunk){
	this.chunks.push(chunk);
};
ChunkRenderer.prototype.createPixelShader = function(program){
  this.ps = new PixelShader(this.gl);
  this.ps.createBuffer();
  this.ps.createProgram(program);
};
ChunkRenderer.prototype.createChunk = function(x, y, width, height){
  this.ps.useProgram();
  this.ps.bindBuffer();
  var loc = this.gl.getUniformLocation(this.ps.program, "u_samplePos");
  this.gl.uniform2f(loc, x, y);

  var texture = beginRenderToTexture(this.gl, width * 0.25, height * 0.25);
  this.ps.drawBuffer();
  endRenderToTexture(this.gl);

  this.add(new Chunk(x, y, width, height, texture));
};
ChunkRenderer.prototype.createBuffer = function(){
	var vbo = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
  this.gl.bufferData(
		this.gl.ARRAY_BUFFER,
		new Float32Array([
			0,0, 1,0, 0,1, 1,0, 0,1, 1,1
		]),
		this.gl.STATIC_DRAW
	);

	this.program = this.gl.programFromScripts([{
    code: CHUNK_SHADER_VERT,
    type: this.gl.VERTEX_SHADER
  }, {
    code: CHUNK_SHADER_FRAG,
    type: this.gl.FRAGMENT_SHADER
  }]);

	this.gl.useProgram(this.program);

  var a_position = this.gl.getAttribLocation(this.program, "a_position");
  this.gl.enableVertexAttribArray(a_position);
  this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);

	var u_sampler = this.gl.getUniformLocation(this.program, "u_sampler");
	this.gl.uniform1i(u_sampler, 0);

	this.umatrix = this.gl.getUniformLocation(this.program, "u_texMatrix");
  this.vbo = vbo;
};
ChunkRenderer.prototype.bindBuffer = function(){
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
};
ChunkRenderer.prototype.setUniforms = function(chunk){
	// var scale = 2 / Math.min(this.gl.canvas.width, this.gl.canvas.height);

	var clipX = chunk.x / this.gl.canvas.width  *  2 - 1;
	var clipY = chunk.y / this.gl.canvas.height * -2 + 1;
	var clipWidth = chunk.width  / this.gl.canvas.width  *  2;
	var clipHeight = chunk.height / this.gl.canvas.height * -2;

	// var clipX = chunk.x * scale - 1;
	// var clipY = - chunk.y * scale + 1;
	// var clipWidth = chunk.width * scale;
	// var clipHeight = - chunk.height * scale;

	this.gl.uniformMatrix3fv(this.umatrix, false, [
		clipWidth, 0, clipX,
		0, clipHeight, clipY,
		0, 0, 1,
	]);

	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, chunk.texture);
};
ChunkRenderer.prototype.drawBuffer = function(){
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};
ChunkRenderer.prototype.drawChunks = function(){
	this.bindBuffer();
	for (var i = 0, l = this.chunks.length; i < l; i++){
		this.setUniforms(this.chunks[i]);
		this.drawBuffer();
	}
};
ChunkRenderer.prototype.useProgram = function(){
  this.gl.useProgram(this.program);
};

function beginRenderToTexture(gl, width, height){
  //gl.viewport(0, 0, width, height);
  var fbo = gl.createFramebuffer();//(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  fbo.width = width;
  fbo.height = height;

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  gl.bindTexture(gl.TEXTURE_2D, null);

  return tex;
}
function endRenderToTexture(gl){
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

///*
window._onload = function(){
  var chunks = [];

  var gl = WGLU("game-canvas");

  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,  1, -1,  1, -1, -1, 1,  1, -1, -1, 1, -1]), gl.STATIC_DRAW);

  var program = gl.programFromScripts([{
    code: BLOCK_SHADER_VERT,
    type: gl.VERTEX_SHADER
  }, {
    code: CHUNK_SHADER_FRAG,
    type: gl.FRAGMENT_SHADER
  }]);

  gl.useProgram(program);

  var a_position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  //var tex = gl.createTexture();
  //gl.bindTexture(gl.TEXTURE_2D, tex);
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);



  //var fbo = gl.createFramebuffer();//(gl.FRAMEBUFFER);
  //gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  //gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  var tex = beginRenderToTexture(gl, 16, 16);

  // Render to the texture (using clear because it's simple)
  //gl.clearColor(0, 1, 0, 1); // green;
  //gl.clear(gl.COLOR_BUFFER_BIT);

  var ps = new PixelShader(gl);
  ps.createBuffer();
  ps.createProgram(TERRAIN_TEST_FRAG);
  ps.drawBuffer();

  // Now draw with the texture to the canvas
  // NOTE: We clear the canvas to red so we'll know
  // we're drawing the texture and not seeing the clear
  // from above.
  //gl.unbind(gl.FRAMEBUFFER);
  endRenderToTexture(gl);
  //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(program);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

  gl.clearColor(1, 0, 0, 1); // red
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

};
//*/


window._onload = function(){
  var chunks = [];

  var gl = WGLU("game-canvas");
	window.onresize = function(){
		gl.resize();
	};
	window.onclick = function(){
		gl.fullscreen();
	};

  var program = gl.programFromScripts([{
    code: BLOCK_SHADER_VERT,
    type: gl.VERTEX_SHADER
  }, {
    code: BLOCK_SHADER_FRAG,
    type: gl.FRAGMENT_SHADER
  }]);

  gl.useProgram(program);



  var grid = new Grid(5, 5, [1, 0, 0, 1, 1,
                             1, 0, 1, 0, 1,
                             1, 1, 0, 1, 1,
                             1, 0, 1, 0, 1,
                             1, 1, 0, 0, 1]);
  grid.initVertices();
  grid.initIndices();
  grid.createBuffers(gl, program);
  grid.drawBuffers(gl);

};



window.onload = function(){
	var gl = WGLU("game-canvas");
	window.onresize = function(){
		gl.resize();
	};
	window.onclick = function(){
		gl.fullscreen();
	};
  /*
  var ps = new PixelShader(gl);
  ps.createBuffer();
  ps.createProgram(TERRAIN_TEST_FRAG);
  var loc = gl.getUniformLocation(ps.program, "u_samplePos");
  gl.uniform2f(loc, 0, 0);


  var texture = beginRenderToTexture(gl, 256, 128);
  ps.drawBuffer();
  endRenderToTexture(gl);
  */

	var cr = new ChunkRenderer(gl);

  cr.createPixelShader(TERRAIN_TEST_FRAG);
  cr.createChunk(0, 0, 256, 256);
  cr.createChunk(0, 256, 256, 256);
  cr.createChunk(256, 256, 256, 256);

	//cr.add(new Chunk(0, 0, 1024, 512, texture));
	//cr.add(new Chunk(128, 128, 128, 128, texture));

  cr.createBuffer();
  cr.useProgram();
  cr.bindBuffer();
	function draw(){

		cr.drawChunks();
		window.requestAnimationFrame(draw);
	}
	draw();
};
