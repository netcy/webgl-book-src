var vertexSource = 'void main(){\n'
 + ' gl_Position = vec4(0.0,0.0,0.0,1.0);\n' // 设置点位置
 + ' gl_PointSize = 20.0;\n' // 设置点尺寸
 + '}'; 
var fragmentSource= 'void main(){\n'
+ 'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' // 设置颜色
+ '}';

function load(){
	var gl = utils.getWebGLContext('webgl');
	if(gl == null){
		console.log("Get WebGL Context fail");
		return;
	}
	gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
	gl.clear(gl.COLOR_BUFFER_BIT);//清空
	buildProgram(gl,vertexSource,fragmentSource); // 创建着色器程序
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

