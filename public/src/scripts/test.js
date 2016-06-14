/* jshint esversion: 6 */

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

  console.log(Math.max.apply(null, this.indices), this.vertices.length * 0.5);
  console.log(this.indices);
  console.log(this.vertices);

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

window.onload = function(){
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
