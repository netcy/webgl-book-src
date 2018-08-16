var shadowMapVS = `
	attribute vec4 aPosition;
    	uniform mat4 uMVPMatrixFromLight;
    	void main(){
    	  	gl_Position = uMVPMatrixFromLight * aPosition;
    	}
`;
var shadowMapFS = `
    precision mediump float;
     vec4 packDepth( const in float depth ) {
    	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );
    	const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );
    	vec4 depthRGBA = fract(depth * bit_shift);
    	depthRGBA -= depthRGBA * bit_mask;
    	return depthRGBA;
    }
    void main(){
    	gl_FragColor = packDepth(gl_FragCoord.z);
    }
`;

var  normalVS = `
 	attribute vec4 aPosition;
 	attribute vec4 aColor;
 	attribute vec3 aNormal;
 	varying vec3 vNormal;
 	varying vec3 vPosition;
 	varying vec4 vColor;
 	varying vec4 vPositionFromLight;
  	uniform mat4 uMVPMatrix;
  	uniform mat4 uMVPMatrixFromLight;
 	void main(){
 		gl_Position = uMVPMatrix* aPosition;
 		vPositionFromLight = uMVPMatrixFromLight * aPosition;
 		vPosition = vec3(aPosition);
 		vNormal = aNormal;
 		vColor = aColor;
 	}
`;
var normalFS = `
	precision mediump float;
	uniform vec3 uLightColor;
	uniform vec3 uLightPosition;
	uniform vec3 uAmbientLightColor;
	varying vec3 vNormal;
	varying vec3 vPosition;
	varying vec4 vColor;
	varying vec4 vPositionFromLight;
	uniform sampler2D uShadowMap;
	float unpackDepth( const in vec4 rgba_depth ) {
		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );
		float depth = dot( rgba_depth, bit_shift );
		return depth;
	} 
	void main(){
		vec3 normal = normalize(vNormal);
		vec3 lightDirection = normalize(uLightPosition - vPosition);
		float normalDotDirection = max(dot(normal,lightDirection),0.0);
		vec3 shadowMapCoord = (vPositionFromLight.xyz / vPositionFromLight.w) / 2.0 + 0.5;
		vec4 depthRGBA = texture2D(uShadowMap,shadowMapCoord.xy);
		float depth = unpackDepth(depthRGBA);
		float visibility = (shadowMapCoord.z > depth + 0.0015) ? 0.5 : 1.0;
		vec3 diffuse = uLightColor * vec3(vColor) * visibility;
		vec3 ambient = uAmbientLightColor * vec3(vColor);
		vec4 color = vec4(ambient + diffuse * normalDotDirection,vColor.a);
		gl_FragColor = color;
	}
`;