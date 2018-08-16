var vertexSource =  ' attribute vec4 aPosition;\n'
 + 'uniform vec2 uOffset;\n'
 + ' void main(){\n '
 + ' gl_Position = vec4(aPosition.x + uOffset.x,aPosition.y + uOffset.y,aPosition.z,aPosition.w);\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float; '
 + '\n uniform vec4 uColor;\n'
 + ' void main(void){\n'
 + '  gl_FragColor = uColor;\n' // 设置颜色
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
     gl.enableVertexAttribArray(aPosition);// 启用attribute变量使用缓冲区
     
     // 获取uniform变量的存储位置
     var uColor = gl.getUniformLocation(program,'uColor');
     if(uColor == null){
          console.log("Failed get unifrom variable uColor's location");
          return;
     }
     var uOffset = gl.getUniformLocation(program,'uOffset');
       if(uOffset == null){
          console.log("Failed get unifrom variable uOffset's location");
          return;
     }
    

      var vertices = new Float32Array([
          -0.9,0.9,-0.9,0.3,-0.3,0.9,-0.3,0.3,,-.2 + 1,.1
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,2,aPosition);


      gl.uniform4f(uColor,0,1,1,1); //给uniform变量uColor赋值为青蓝色
      gl.drawArrays(gl.TRIANGLES,0,4);

       gl.uniform4f(uColor,1,1,0,1);
       gl.uniform2f(uOffset,1,0); // 给uniform变量uOffset赋值1,0
       gl.drawArrays(gl.TRIANGLES,0,4);

       gl.uniform4f(uColor,1,0,1,1);
       gl.uniform2f(uOffset,0,-1);
       gl.drawArrays(gl.TRIANGLES,0,4);
}




