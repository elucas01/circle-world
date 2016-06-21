(function(){

var TERRAIN_SHADER_FRAG;

//var camera;
var pixelshader;
//var sprite;
//var chunk;
var worldview;
var controller;

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

  controller = new Controller();
  controller.addKey(38, 0, -1);
  controller.addKey(40, 0, 1);
  controller.addKey(37, -1, 0);
  controller.addKey(39, 1, 0);

});

WGLU.loop(function(){
  //render code
  var dir = controller.direction();
  worldview.move(dir.x * 6.0, dir.y * 6.0);
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
