var billboardVS = `
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;
	uniform vec2 uScale;
	attribute vec2 aPosition;
	attribute vec2 aUv;
	varying vec2 vUv;
	void main(){
		vUv = aUv;
		vec2 position = aPosition * uScale;
		vec4 finalPosition = uModelViewMatrix * vec4(0.0,0.0,0.0,1.0);
		finalPosition.xy += position;
		finalPosition = uProjectionMatrix * finalPosition;
		gl_Position = finalPosition;
	}
`;
var billboardFS = `
	precision mediump float;
	uniform sampler2D uTexture;
	varying vec2 vUv;
	void main(){
		vec4 textureColor = texture2D( uTexture, vUv );
		gl_FragColor =textureColor;
	}
`;