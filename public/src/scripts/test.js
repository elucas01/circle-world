if (false){
	var FRAGMENT_SOURCE = `
	#ifdef gl_FRAGMENT_PRECISION_HIGH
		precision highp float;
	#else
		precision mediump float;
	#endif

	uniform sampler2D u_sampler;

	varying vec2 v_textureCoord;

	void main() {
	   gl_FragColor = vec4(1, 0.5, 0, 1);//texture2D(u_sampler, v_textureCoord);
	}
	`;

	var VERTEX_SOURCE = `
	attribute vec2 a_position;
	varying vec2 v_textureCoord;

	void main(){
		gl_Position = vec4(a_position, 1, 1);
	  v_textureCoord = a_position;
	}
	`;
}
else {
	var FRAGMENT_SOURCE = `
	#ifdef gl_FRAGMENT_PRECISION_HIGH
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
	varying vec2 v_textureCoord;
	uniform mat3 u_texMatrix;

	void main(){
		gl_Position = vec4(vec3(a_position, 1.0) * u_texMatrix, 1.0);
	  v_textureCoord = a_position;
	}
	`;
}

console.log(`/* @include glsl/texture-shader.frag */`);

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

  // console.log(Math.max.apply(null, this.indices), this.vertices.length * 0.5);
  // console.log(this.indices);
  // console.log(this.vertices);

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

	// this.vbo;
	// this.program;
	// this.umatrix;
}
ChunkRenderer.prototype.add = function(chunk){
	this.chunks.push(chunk);
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
    code: VERTEX_SOURCE,
    type: this.gl.VERTEX_SHADER
  }, {
    code: FRAGMENT_SOURCE,
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

function beginRenderToTexture(gl){
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  var fbo = gl.createFramebuffer();//(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  return tex;
}
function endRenderToTexture(gl){
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

/*
window.onload = function(){
  var chunks = [];

  var gl = WGLU("game-canvas");

  var vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,  1, -1,  1, -1, -1, 1,  1, -1, -1, 1, -1]), gl.STATIC_DRAW);

  var program = gl.programFromScripts([{
    code: VERTEX_SOURCE,
    type: gl.VERTEX_SHADER
  }, {
    code: FRAGMENT_SOURCE,
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
  var tex = beginRenderToTexture(gl);

  // Render to the texture (using clear because it's simple)
  gl.clearColor(0, 1, 0, 1); // green;
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Now draw with the texture to the canvas
  // NOTE: We clear the canvas to red so we'll know
  // we're drawing the texture and not seeing the clear
  // from above.
  //gl.unbind(gl.FRAMEBUFFER);
  endRenderToTexture(gl);

  gl.clearColor(1, 0, 0, 1); // red
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

}
*/

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
    code: VERTEX_SOURCE,
    type: gl.VERTEX_SHADER
  }, {
    code: FRAGMENT_SOURCE,
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
	Load.image("./assets/textest.png", function(image){

		var gl = WGLU("game-canvas");
		window.onresize = function(){
			gl.resize();
		};
		window.onclick = function(){
			gl.fullscreen();
		};

		/*var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);*/

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		var data = new Uint8Array(8*8*4);
		var solid = new Uint8Array(8*8*4);

		var v;
		for (var i = 0; i < 8*8*4; i++){
			v = Math.random()*256 | 0;
			data[i] = v;
			solid[i] =
		}

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 8, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);


		var cr = new ChunkRenderer(gl);
		cr.createBuffer();
		cr.add(new Chunk(0, 0, 128, 128, texture));
		cr.add(new Chunk(128, 128, 128, 128, texture));

		function draw(){
			cr.drawChunks();
			window.requestAnimationFrame(draw);
		}
		draw();
	});
};
