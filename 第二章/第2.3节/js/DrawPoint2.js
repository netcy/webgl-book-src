var vertexSource =  ' attribute vec4 aPosition;\n'
+  'attribute float aPointSize;'
 + ' void main(){\n '
 + ' gl_Position = aPosition;\n' // 设置点位置
 + ' gl_PointSize = aPointSize;\n' // 设置点尺寸
 + '}'; 
var fragmentSource= 'void main(){\n'
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
	var program = buildProgram(gl,vertexSource,fragmentSource); // 创建着色器程序
     
     // 获取attribute变量的存储位置
     var aPosition =  gl.getAttribLocation(program,'aPosition');
      if(aPosition < 0){
     	  console.log("Get attribute variable aPositiona's location fail");
     	   return;
     }
     var aPointSize = gl.getAttribLocation(program,'aPointSize');
     if(aPointSize < 0){
     	  console.log("Get attribute variable aPointSize's location fail");
     	  return;
     }
     //给attribute变量赋值
     gl.vertexAttrib3f(aPosition,0.5,0.5,0.0);
     gl.vertexAttrib1f(aPointSize,10.0);

      gl.drawArrays(gl.POINTS, 0, 1);// 绘制点

}

function buildProgram(gl,vertexSource,fragmentSource){
	var vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexSource);
	var fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentSource);
	var program = gl.createProgram(); // 创建程序
	// 程序绑定着色器
      gl.attachShader(program,vertexShader);
      gl.attachShader(program,fragmentShader);
      // 链接程序
	gl.linkProgram(program)
	if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
  		var info = gl.getProgramInfoLog(program);
  		console.log("Could not initialise shader\n" + "VALIDATE_STATUS: " + gl.getProgramParameter(program, gl.VALIDATE_STATUS) + ", gl error [" + gl.getError() + "]");
  		throw 'Could not compile WebGL program. \n\n' + info;
	}
	// 使用程序
	gl.useProgram(program)
	return program;
}

function createShader(gl,type,source){
	var shader = gl.createShader(type); // 创建着色器对象
       gl.shaderSource(shader,source); // 将着色器源码写入对象
       gl.compileShader(shader); // 编译着色器
          if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        var info = gl.getShaderInfoLog(shader);
        console.log("Could not compile shader\n" + "error: " + info);
      throw 'Could not compile WebGL shader. \n\n' + info;
       }
       return shader;
}

