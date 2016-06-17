//Globals
var GL;
var GLCanvas;

(function(){

var WGLU = {
  processes: {
    startup: [],
    resize: []
  },

  start: function(func){
    WGLU.processes.startup.push(function(){
      func();
    });

    window.onload = function(){
      for (var i = 0; i < WGLU.processes.startup.length; i++){
        WGLU.processes.startup[i]();
      }

      window.onresize = function(){
        for (var i = 0; i < WGLU.processes.resize.length; i++){
          WGLU.processes.resize[i]();
        }
      };
    };
  },
  loop: function(func, time){
    time = time || 10;

    function frame(){
      func();

      window.setTimeout(function(){
        window.requestAnimationFrame(frame);
      }, time);
    }

    WGLU.processes.startup.push(frame);
  },
  resize: function(func){
    WGLU.processes.resize.push(function(){
      func();
    });
  },

  initialize: function(canvas){
    if (typeof canvas == 'string')
      GLCanvas = document.getElementById(canvas);
    else
      GLCanvas = canvas;

    GL = GLCanvas.getContext('webgl') || GLCanvas.getContext('experimental-webgl');

    if (!GL)
      throw new Error("Could not create WebGL context.");
  },
  shaderFromCode: function(code, type){
    var shader = GL.createShader(type || GL.FRAGMENT_SHADER);
    GL.shaderSource(shader, code);
    GL.compileShader(shader);

    if(!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      console.log(code);
  		throw new Error(GL.getShaderInfoLog(shader));
  	}
    return shader;
  },
  programFromScripts: function(scripts){
    var program = GL.createProgram();
    for (var i = 0; i < scripts.length; i++){
      GL.attachShader(program, WGLU.shaderFromCode(scripts[i].code, scripts[i].type));
    }

  	GL.linkProgram(program);

  	if(!GL.getProgramParameter(program, GL.LINK_STATUS)) {
  		throw new Error(GL.getProgramInfoLog(program));
  	}
    return program;
  },

  fillWindow: function(){
    GLCanvas.width = window.innerWidth;
    GLCanvas.height = window.innerHeight;
    GL.viewport(0, 0, GLCanvas.width, GLCanvas.height);
  },
  fullscreen: function(){
    if (GLCanvas.requestFullscreen) {
			GLCanvas.requestFullscreen();
		}
		else if (GLCanvas.webkitRequestFullScreen) {
			GLCanvas.webkitRequestFullScreen();
		}
		else if (GLCanvas.mozRequestFullScreen){
			GLCanvas.mozRequestFullScreen();
		}

    WGLU.resize(function(){
      WGLU.fillWindow();
    });
  }
};

window.WGLU = WGLU;

})();
