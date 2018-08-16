var colorVS = ` 
	attribute vec4 aPosition;
  	uniform mat4 uModelMatrix;
  	uniform mat4 uViewMatrix;
  	uniform mat4 uProjectMatrix;
  	void main(){
  		gl_Position = uProjectMatrix * uViewMatrix * uModelMatrix*aPosition ;
  	}
`
var colorFS = `
	precision mediump float;
	uniform vec4 uColor;
	void main(){
		gl_FragColor = uColor;
	}
`

var textureVS = `
 	attribute vec4 aPosition;
  	uniform mat4 uModelMatrix;
 	uniform mat4 uViewMatrix;
  	uniform mat4 uProjectMatrix;
 	attribute vec2 aUv;
 	varying vec2 vUv;
 	void main(){
 		vUv = aUv;
 		gl_Position = uProjectMatrix * uViewMatrix * uModelMatrix*aPosition ;
 	}
`

var textureFS = `
	precision mediump float;
	varying vec2 vUv;
	uniform sampler2D uTexture;
	void main(){
		gl_FragColor = texture2D(uTexture, vUv);
	}
`
