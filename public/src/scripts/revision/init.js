(function(){

if (!WGLU) return;

WGLU.start(function(){
  WGLU.fullscreen();

  //initialization code

});

WGLU.loop(function(){
  //render code
});

WGLU.loop(function(){
  //physics code
});

const TERRAIN_SHADER_FRAG = "/* @include glsl/terrain-shader.frag */"

})();
