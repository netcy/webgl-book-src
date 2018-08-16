var particleVS = `
	uniform mat4 uViewMatrix;
	uniform mat4 uProjectionMatrix;
      attribute vec4 aPosition;
      attribute vec3 aColor;
      varying vec3 vColor;
      attribute float aPointSize;
	void main(){
		gl_Position = uProjectionMatrix * uViewMatrix * aPosition;
		gl_PointSize = aPointSize;
		vColor = aColor;
	}
`;
var particleFS = `
	precision mediump float;
	varying vec3 vColor;
	void main(){
		gl_FragColor = vec4(vColor,0.5);
	}
`;
