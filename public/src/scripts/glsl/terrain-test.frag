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

float normal(in vec2 p){
  const vec2 eps = vec2(1.0, 0.0) * 0.001;
  return normalize(eps.xx * fbm(p + eps.xx) +
                   eps.xy * fbm(p + eps.xy) +
                   eps.yx * fbm(p + eps.yx) +
                   eps.yy * fbm(p + eps.yy));
}

void main() {
  vec2 uv = (gl_FragCoord.xy + u_samplePos * 0.25) / 16.0;
  float noi = fbm(uv) * 4.0;

  float ran = hash(uv);
  vec3 col;

  if (noi + uv.y > 6.0){
    col = vec4(0.1, 0.7 - ran * 0.3, 0.0);
  } else {
    ran *= pow(ran, 48.0);
    ran *= ran * (3.0 - 2.0 * ran);
    ran *= fbm(uv * 0.25);

    col = mix(
      vec4(0.2, 0.0, 0.3),
      vec4(1.0, 1.0, 0.9),
      ran
    );

    col *= max(0.0, dot(normal(uv), vec2(-0.707))) * 0.6 + 0.4;
  }

  gl_FragColor = vec4(col, 0.0);
}
