(function(){

var TERRAIN_SHADER_FRAG;

var camera;
var pixelshader;
var sprite;

WGLU.start(function(){
  WGLU.initialize("game-canvas");

  Load.image("./assets/textest.png", function(img){
    camera = new Camera(0, 0, window.innerWidth, window.innerHeight);
    pixelshader = new PixelShader(TERRAIN_SHADER_FRAG);

    sprite = new Sprite(img, 0, 0, 64, 64);
  });
});

WGLU.loop(function(){
  //render code
});

WGLU.loop(function(){
  //physics code
});

WGLU.resize(function(){
  camera.copySize(GLCanvas);
});

window.onclick = function(){
  WGLU.fullscreen();
};

TERRAIN_SHADER_FRAG = `
/* @include glsl/terrain-shader.frag */`;

})();
