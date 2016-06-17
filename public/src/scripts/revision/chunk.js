

//(function(){

//const CHUNK_SHADER_FRAG = `/* @include ../glsl/chunk-shader.frag */`;
//const CHUNK_SHADER_VERT = `/* @include ../glsl/chunk-shader.vert */`;
/*

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

});
*/
