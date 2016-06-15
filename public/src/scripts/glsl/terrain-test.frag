#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform vec2 u_samplePos;

float hash( in vec2 p ) {
  return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);
}

float noise( in vec2 p )
{
  vec2 i = floor( p );
  vec2 f = p - i;
	vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( hash( i + vec2(0.0,0.0) ),
                   hash( i + vec2(1.0,0.0) ), u.x),
              mix( hash( i + vec2(0.0,1.0) ),
                   hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float fbm (in vec2 p){
  const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 ) * 0.75;
  float f  = 0.5000*noise( p ); p = m*p;
      	f += 0.2500*noise( p ); p = m*p;
      	f += 0.1250*noise( p ); p = m*p;
      	f += 0.0625*noise( p ); p = m*p;
  return f;
}

void main() {
  vec2 uv = (gl_FragCoord.xy + u_samplePos * 0.25) / 16.0;
  float noi = fbm(uv);

  float ran = hash(uv);
  ran *= pow(ran, 48.0);
  ran *= ran * (3.0 - 2.0 * ran);
  ran *= fbm(uv * 0.25);

  vec4 col;

  if (noi + uv.y > 6.0){
    col = vec4(0.1, 0.6, 0.0, 1.0);
  } else {
    col = mix(
      vec4(0.2, 0.0, 0.3, 1.0),
      vec4(1.0, 1.0, 0.9, 1.0),
      ran
    );
  }

  gl_FragColor = col;
}
