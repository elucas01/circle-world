(function(){

/* @const */
var GL = window.WebGLRenderingContext ||
         window.WebGL2RenderingContext;

function __WGLU(){
  this.create = function(target){
    if (target == GL.ARRAY_BUFFER || target == GL.ELEMENT_ARRAY_BUFFER){
      return this.createBuffer();
    }
    else if (target == GL.FRAMEBUFFER){
      return this.createFramebuffer();
    }
    else if (target == GL.RENDERBUFFER){
      return this.createRenderbuffer();
    }
    else if (target >= GL.TEXTURE0 && target <= GL.TEXTURE31){
      return this.createTexture();
    }
    else if (target == GL.FRAGMENT_SHADER || target == GL.VERTEX_SHADER){
      return this.createShader(target);
    }
  }
  this.bind = function(object, target){
    if (object instanceof WebGLTexture){
      if (target){
        this.activeTexture(target);
      }
      this.bindTexture(GL.TEXTURE_2D, object);
    }
    else if (object instanceof WebGLFramebuffer){
      target = target || GL.FRAMEBUFFER;
      this.bindFramebuffer(target, object);
    }
    else if (object instanceof WebGLBuffer){
      target = target || GL.ARRAY_BUFFER;
      this.bindBuffer(target, object);
    }
  };
  this.unbind = function(target){
    if (target >= GL.TEXTURE0 && target <= GL.TEXTURE31){
      this.bindTexture(target, null);
    }
    else if (target == GL.FRAMEBUFFER){
      this.bindFramebuffer(GL.FRAMEBUFFER, null);
    }
    else if (target == GL.ARRAY_BUFFER || target == GL.ELEMENT_ARRAY_BUFFER){
      this.bindBuffer(target, null);
    }
  };
  this.delete = function(object){
    if (object instanceof WebGLBuffer){
      this.deleteBuffer(object);
    }
    else if (object instanceof WebGLFramebuffer){
      this.deleteFramebuffer(object);
    }
    else if (object instanceof WebGLRenderbuffer){
      this.deleteRenderbuffer(object);
    }
    else if (object instanceof WebGLTexture){
      this.deleteTexture(object);
    }
  };
  this.data = function(target, type, data){
    console.log("HEELOO");
    if (target >= GL.TEXTURE0 && target <= GL.TEXTURE32){
      console.log("texture");
      var format = type == GL.UNSIGNED_SHORT_5_6_5 ? GL.RGB : GL.RGBA;
      if (data == "null"){
        console.log("null data");
        this.texImage2D(GL.TEXTURE_2D, 0, format, 1, 1, 0, format, type, null);
      } else {
        this.texImage2D(GL.TEXTURE_2D, 0, format, format, type, data);
      }
    }
    else if (target == GL.ARRAY_BUFFER || target == GL.ELEMENT_ARRAY_BUFFER){
      this.bufferData(target, new Float32Array(data), type);
    }
    else if (target == GL.FRAMEBUFFER){
      if (data instanceof WebGLTexture){
        this.framebufferTexture2D(GL.FRAMEBUFFER, type, GL.TEXTURE_2D, data, 0);
      }
    }
  }
  this.shaderFromCode = function(code, type){
    var shader = this.createShader(type || GL.FRAGMENT_SHADER);
    this.shaderSource(shader, code);
    this.compileShader(shader);

    if(!this.getShaderParameter(shader, GL.COMPILE_STATUS)) {
  		throw new Error(this.getShaderInfoLog(shader));
  	}
    return shader;
  };
  this.programFromScripts = function(scripts){
    var program = this.createProgram();
    for (var i = 0; i < scripts.length; i++){
      this.attachShader(program, this.shaderFromCode(scripts[i].code, scripts[i].type));
    }

  	this.linkProgram(program);

  	if(!this.getProgramParameter(program, GL.LINK_STATUS)) {
  		throw new Error(this.getProgramInfoLog(program));
  	}
    return program;
  };
}

function WGLU(canvas){
  if (typeof canvas == 'string')
    canvas = document.getElementById(canvas);

  var wglu = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!wglu)
    throw new Error("Could not create WebGL context.");

  __WGLU.call(wglu);

  return wglu;
}

window.WGLU = WGLU;

})();
