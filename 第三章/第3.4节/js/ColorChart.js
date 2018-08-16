var vertexSource =  ' attribute vec4 aPosition;\n'
 + ' void main(){\n '
 + ' gl_Position = aPosition;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n'
 + ' uniform float uWidth;\n'
 + ' uniform float uHeight;\n'
 + ' void main(void){\n'
 +  'float x = gl_FragCoord.x-uWidth/2.0,y= gl_FragCoord.y-uHeight/2.0;\n'
 +  'float degree =  degrees(atan(y,x)) + 180.0;\n'
 + ' float r = sqrt(x * x +  y* y);\n'
 + 'if (r > 60.0 && r < 68.0 && (mod(degree,20.0) > 2.0 && mod(degree,20.0) < 18.0) && degree < 300.0){\n'
 + '  gl_FragColor = vec4(1.0,0.0,1.0,1.0);\n' // 设置颜色
  + '}else if (r > 60.0 && r < 68.0 && (mod(degree,20.0) > 2.0 && mod(degree,20.0) < 18.0) && degree > 300.0){\n'
 + '  gl_FragColor = vec4(0.5,0.0,0.5,1.0);\n' // 设置颜色
 + '}else if(r > 56.0 && r < 58.0 ){\n'
 + '  gl_FragColor = vec4(1.0,0.0,1.0,1.0);\n' // 设置颜色
 + '}else if(r > 70.0 && r < 72.0 ){\n'
 + '  gl_FragColor = vec4(1.0,0.0,1.0,1.0);\n' // 设置颜色
 + '}else{\n'
 + ' discard;\n' // 丢弃片元
  + '}\n'
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
     var uWidth = gl.getUniformLocation(program,'uWidth');
     if(uWidth == null){
          console.log("Failed get unifrom variable uWidth's location");
          return;
     }
     var uHeight = gl.getUniformLocation(program,'uHeight');
     if(uHeight == null){
          console.log("Failed get unifrom variable uHeight's location");
          return;
     }
   
      var vertices = new Float32Array([
          -0.5,0.5,-0.5,-0.5,0.5,0.5,0.5,-0.5,
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,2,aPosition);

      gl.uniform1f(uWidth,gl.drawingBufferWidth); //给uniform变量uWidth赋值为缓冲区宽度
      gl.uniform1f(uHeight,gl.drawingBufferHeight); //给uniform变量uHeight赋值为缓冲区高度
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}




