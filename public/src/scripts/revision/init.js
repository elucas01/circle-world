(function(){

var TERRAIN_SHADER_FRAG;

var camera;
var pixelshader;
var sprite;
var chunk;

WGLU.setup(function(){
  WGLU.initialize("game-canvas");

  Load.image("./assets/textest.png", function(img){
    camera = new Camera(0, 0);
    camera.copySize(GLCanvas);
    //pixelshader = new PixelShader(TERRAIN_SHADER_FRAG);

    sprite = new Sprite(img, 0, 0, 64, 64);
    sprite.init();

    pixelshader = new PixelShader(TERRAIN_SHADER_FRAG);
    pixelshader.init();

    chunk = new Chunk(0, 0, 512, 512);
    chunk.init(pixelshader);

    camera.add(chunk);
    camera.add(sprite);
    camera.init();
  });
});

WGLU.loop(function(){
  //render code
  camera.draw();
});

WGLU.resize(function(){
  WGLU.fillWindow();
  camera.copySize(GLCanvas);
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
