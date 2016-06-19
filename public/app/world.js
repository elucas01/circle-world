(function(){

function WorldView(x, y, width, height, pixelshader, chunkWidth, chunkHeight){
  Camera.call(this, x, y, width, height);

  this.pixelshader = pixelshader;

  this.chunkWidth = chunkWidth;
  this.chunkHeight = chunkHeight;
}

WorldView.prototype.init = function(){
  var xs = Math.floor(this.x / this.chunkWidth) * this.chunkWidth;
  var ys = Math.floor(this.y / this.chunkHeight) * this.chunkHeight;

  var xd = this.chunkWidth;
  var yd = this.chunkHeight;

  var xc = Math.ceil(this.width / this.chunkWidth);
  var yc = Math.ceil(this.height / this.chunkHeight);

  var x,xp;
  var y,yp;

  for (x = 0; x < xc; x++){
    for (y = 0; y < yc; y++){
      xp = xs + xd * x;
      yp = ys + yd * y;

      var chunk = new Chunk(xp, yp, xd, yd);
      chunk.init(this.pixelshader);
      this.sprites.push(chunk);
    }
  }
};
WorldView.prototype.clip = function(camera){
  var chunks = this.chunks;
  for (var i = 0; i < chunks.length; i++){
    if (!chunks[i].overlaps(camera)){
      chunks[i].delete();
      delete chunks[i];
    }
  }
};

window.WorldView = WorldView;

})();
