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
	var program = utils.buildProgram(gl,vertexSource,fragmentSource); // 创建着色器程序
     
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
    
    //定义坐标数据
    var vertices = new Float32Array([
          0.1,0.0,0.2,0.0,0.3,0.0,0.4,0.0,0.5,0.0,
      ]);
     var vertexBuffer = gl.createBuffer(); // 创建顶点坐标缓冲对象
     gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);  //绑定缓冲区
     gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW); //给缓冲区填充数据
     gl.vertexAttribPointer(aPosition,2,gl.FLOAT,false,0,0); // 把缓冲区分配给attribute变量
     gl.enableVertexAttribArray(aPosition);
     // initVertexBufferObject(gl,vertices,2,aPosition); 

     //定义顶点尺寸数据
     var sizes = new Float32Array([
             10.0,10.5,11.0,11.5,12.0
      ]);
     var sizeBuffer = gl.createBuffer();// // 创建顶点尺寸缓冲对象
     gl.bindBuffer(gl.ARRAY_BUFFER,sizeBuffer);  //绑定缓冲区
     gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.STATIC_DRAW); //给缓冲区填充数据
     gl.vertexAttribPointer(aPointSize,1,gl.FLOAT,false,0,0); // 把缓冲区分配给attribute变量
     gl.enableVertexAttribArray(aPointSize);
      // initVertexBufferObject(gl,sizes,1,aPointSize);

     gl.drawArrays(gl.POINTS,2,3);
}

function initVertexBufferObject(gl,vertices,size,location){
    var vertexBuffer = gl.createBuffer(); // 创建缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); //绑定缓冲区
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW); //给缓冲区填充数据
    gl.vertexAttribPointer(location,size,gl.FLOAT,false,0,0); // 把缓冲区分配给attribute变量
    gl.enableVertexAttribArray(location); // 启用attribute变量使用缓冲区
}



