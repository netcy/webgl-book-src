var vertexSource =  ' attribute vec4 aPosition;\n'
 + 'uniform vec2 uOffset;\n'
 + 'attribute vec4 aColor;\n'
 + 'varying vec4 vColor;\n'
 + ' void main(){\n '
 + '  vColor = aColor;\n'
 + '  gl_PointSize = 10.0;\n'
 + ' gl_Position = vec4(aPosition.x + uOffset.x,aPosition.y + uOffset.y,aPosition.z,aPosition.w);\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + ' varying vec4 vColor;\n'
 + ' void main(void){\n'
 + '  gl_FragColor = vColor;\n' // 设置颜色
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
      var aColor =  gl.getAttribLocation(program,'aColor');
      if(aColor < 0){
        console.log("Get attribute variable aColor's location fail");
         return;
      }
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aColor);

       // 获取uniform变量的存储位置
     var uOffset = gl.getUniformLocation(program,'uOffset');
       if(uOffset == null){
          console.log("Failed get unifrom variable uOffset's location");
          return;
     }     
      var vertices = new Float32Array([
          -0.9,0.9,-0.9,0.3,-0.3,0.9
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,2,aPosition);
      var colors = new Float32Array(
          [1.0,0.0,0.0,1.0, 
           0.0,1.0,0.0,1.0,   
           1.0,1.0,0.0,1.0]
       );
      var colorBuffer = utils.initVertexBufferObject(gl,colors,4,aColor);
      gl.drawArrays(gl.POINTS,0,3);

       gl.uniform2f(uOffset,1,0); // 给uniform变量uOffset赋值1,0
       gl.drawArrays(gl.LINE_LOOP,0,3);

       gl.uniform2f(uOffset,0,-1);
       gl.drawArrays(gl.TRIANGLES,0,3);
}



