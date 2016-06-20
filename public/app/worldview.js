(function(){

function WorldView(x, y, width, height, pixelshader, chunkWidth, chunkHeight){
  Camera.call(this, x, y, width, height);

  this.pixelshader = pixelshader;

  this.chunkWidth = chunkWidth;
  this.chunkHeight = chunkHeight;

  this.cliprect = new AABB(x - this.chunkWidth,
                           y - this.chunkHeight,
                           width + this.chunkWidth * 2,
                           height + this.chunkHeight * 2);

  this.chunksAcross = Math.ceil(this.cliprect.width / this.chunkWidth);
  this.chunksDown = Math.ceil(this.cliprect.height / this.chunkHeight);
}
WorldView.prototype = Object.create(Camera.prototype);
WorldView.prototype.init = function(){
  Camera.prototype.init.call(this);

  var xs = Math.floor(this.cliprect.x / this.chunkWidth) * this.chunkWidth;
  var ys = Math.floor(this.cliprect.y / this.chunkHeight) * this.chunkHeight;

  var xd = this.chunkWidth;
  var yd = this.chunkHeight;

  var xc = Math.ceil(this.cliprect.width / this.chunkWidth);
  var yc = Math.ceil(this.cliprect.height / this.chunkHeight);

  var x,xp;
  var y,yp;

  for (x = 0; x < xc; x++){
    for (y = 0; y < yc; y++){
      xp = xs + xd * x;
      yp = ys + yd * y;

      var chunk = new Chunk(xp, yp, xd, yd);
      chunk.init(this.pixelshader);
      this.add(chunk);
    }
  }
};
WorldView.prototype.createChunk = function(x, y, width, height){
  var chunk = new Chunk(x, y, width, height);
  chunk.init(this.pixelshader);
  this.add(chunk);
};
WorldView.prototype.clip = function(){
  var chunks = this.sprites;
  this.sprites = [];
  for (var i = 0; i < chunks.length; i++){
    if (this.cliprect.overlaps(chunks[i])){
      this.add(chunks[i]);
    } else {
      this.createChunk(
        //X
        chunks[i].x + this.chunksAcross * this.chunkWidth *
        (chunks[i].x + chunks[i].width < this.x ? 1 : (
         chunks[i].x > this.x + this.width ? -1 : 0)),
        //Y
        chunks[i].y + this.chunksDown * this.chunkHeight *
        (chunks[i].y + chunks[i].height < this.y ? 1 : (
         chunks[i].y > this.y + this.height ? -1 : 0)),
        this.chunkWidth,
        this.chunkHeight);

      //chunks[i].delete();
    }
  }
};

WorldView.prototype.move = function(x, y){
  AABB.prototype.move.call(this, x, y);
  AABB.prototype.move.call(this.cliprect, x, y);
  this.clip();
};

window.WorldView = WorldView;

})();
