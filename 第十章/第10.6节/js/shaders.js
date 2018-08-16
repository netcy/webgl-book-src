var shadowMapVS = `
	attribute vec4 aPosition;
    	uniform mat4 uMVPMatrixFromLight;
    	void main(){
    	  	gl_Position = uMVPMatrixFromLight * aPosition;
    	}
`;
var shadowMapFS = `
    precision mediump float;
    void main(){
    	gl_FragColor = vec4(gl_FragCoord.z,0.0,0.0,1.0);
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
	void main(){
		vec3 normal = normalize(vNormal);
		vec3 lightDirection = normalize(uLightPosition - vPosition);
		float normalDotDirection = max(dot(normal,lightDirection),0.0);
		vec3 shadowMapCoord = (vPositionFromLight.xyz / vPositionFromLight.w) / 2.0 + 0.5;
		vec4 depthRGBA = texture2D(uShadowMap,shadowMapCoord.xy);
		float depth = depthRGBA.r;
		float visibility = (shadowMapCoord.z > depth + 0.005) ? 0.5 : 1.0;
		vec3 diffuse = uLightColor * vec3(vColor) * visibility;
		vec3 ambient = uAmbientLightColor * vec3(vColor);
		vec4 color = vec4(ambient + diffuse * normalDotDirection,vColor.a);
		gl_FragColor = color;
		// gl_FragColor = vec4(depthRGBA.r,depthRGBA.r,depthRGBA.r,1.0);
	}
`;
