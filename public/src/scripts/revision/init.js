(function(){

var TERRAIN_SHADER_FRAG;

//var camera;
var pixelshader;
//var sprite;
//var chunk;
var worldview;

WGLU.setup(function(){
  WGLU.initialize("game-canvas");
  WGLU.fillWindow();

  //Load.image("./assets/textest.png", function(img){
    //camera = new Camera(0, 0);
    //camera.copySize(GLCanvas);
    //pixelshader = new PixelShader(TERRAIN_SHADER_FRAG);

    //sprite = new Sprite(img, 0, 0, 64, 64);
    //sprite.init();

    //pixelshader = new PixelShader(TERRAIN_SHADER_FRAG);
    //pixelshader.init();

    //chunk = new Chunk(0, 0, 512, 512);
    //chunk.init(pixelshader);

    //camera.add(chunk);
    //camera.add(sprite);
    //camera.init();
  //});
  pixelshader = new PixelShader(TERRAIN_SHADER_FRAG);
  pixelshader.init();
  worldview = new WorldView(0, 0, GLCanvas.width, GLCanvas.height, pixelshader, 512, 512);
  worldview.init();
});

WGLU.loop(function(){
  //render code
  worldview.move(-1, 0);
  worldview.draw();
});

WGLU.resize(function(){
  WGLU.fillWindow();
  worldview.copySize(GLCanvas);
});

window.onclick = function(){
  WGLU.fullscreen();
};

window.onload = function(){
  WGLU.begin();
};

TERRAIN_SHADER_FRAG = `
/* @include glsl/terrain-shader.frag */`;

})();
