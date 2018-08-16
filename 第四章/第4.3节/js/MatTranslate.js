var vertexSource =  ' attribute vec4 aPosition;\n'
 + ' uniform mat4 uMatrix;\n'
 + ' void main(){\n '
 + ' gl_Position = uMatrix * aPosition;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + ' void main(void){\n'
 + 'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' // 设置颜色
 + '}';

function load(){
	var gl = window.gl= utils.getWebGLContext('webgl');
	if(gl == null){
		console.log("Get WebGL Context fail");
		return;
	}
	gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
      gl.clear(gl.COLOR_BUFFER_BIT);//清空
	var program = utils.buildProgram(gl,vertexSource,fragmentSource); // 创建着色器程序 
     // 获取attribute变量的存储位置
      var aPosition =  gl.getAttribLocation(program,'aPosition');
      if(aPosition < 0){
     	  console.log("Get attribute variable aPositiona's location fail");
     	   return;
      }
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);

       // 获取uniform变量的存储位置
     var uMatrix = gl.getUniformLocation(program,'uMatrix');
       if(uMatrix == null){
          console.log("Failed get unifrom variable uMatrix's location");
          return;
     }   

     var vertices = new Float32Array([
          -0.5,0.5,
          -0.5,-0.5,
          0.5,0.5,
          0.5,-0.5,
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,2,aPosition);  

      var translateMatrix = mat4.create();
      mat4.fromTranslation(translateMatrix,[0.4,0.4,0.0]);
      gl.uniformMatrix4fv(uMatrix,false,translateMatrix);

      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}