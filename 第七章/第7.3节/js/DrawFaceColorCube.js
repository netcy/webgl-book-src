var vertexSource =  ' attribute vec4 aPosition;\n'
+  'attribute vec4 aColor;\n'
+ 'varying vec4 vColor;\n'
 + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' void main(){\n '
 + ' vColor = aColor;\n'
 + ' gl_Position = uProjectMatrix * uViewMatrix * aPosition ;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + 'varying vec4 vColor;\n'
 + ' void main(void){\n'
 + 'gl_FragColor = vColor;\n' // 设置颜色
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
     // utils.getVariableLocation = function(gl,program,name,attribute){
      var aPosition =  utils.getVariableLocation(gl,program,'aPosition',true);// gl.getAttribLocation(program,'aPosition');
      var aColor = utils.getVariableLocation(gl,program,'aColor',true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aColor);
       // 获取uniform变量的存储位置
     var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
     var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
  

      var verticesColors = new Float32Array([
           // 前面四个顶点
             -10,  10,  10, 1,0,0,//v0  红色
           	-10, -10,  10, 1,0,0,// v1 红色
              10,  10,  10,  1,0,0,// v2 红色
              10,  -10, 10,  1,0,0,// v3 红色
           // 右面四个顶点
             10,10,10, 0,1,0,//v4 绿色
             10,-10,10, 0,1,0,//v5 绿色
             10,10,-10, 0,1,0,//v6 绿色
             10,-10,-10, 0,1,0,//v7 绿色
           // 上面四个顶点
             -10,10,-10,0,1,1,//v8 青色
             -10,10,10,0,1,1,//v9 青色 
             10,10,-10,0,1,1,//v10 青色 
             10,10,10,0,1,1,//v11 青色 
           // 下面四个顶点
              -10,-10,10,1,1,1,//v12 白色
             -10,-10,-10,1,1,1,//v13 白色
             10,-10,10,1,1,1,//v14 白色 
             10,-10,-10,1,1,1,//v15 白色
           // 左面的四个顶点
           	-10,10,-10,1,1,0,//v16 黄色
           	-10,-10,-10,1,1,0,//v17 黄色
           	-10,10,10,1,1,0,//v18黄色
           	-10,-10,10,1,1,0,//v19 黄色
           // 后面的四个顶点
           	10,10,-10,1,0,1,//v20 红蓝
           	10,-10,-10,1,0,1,//v21 红蓝
           	-10,10,-10,1,0,1,//v22 红蓝
           	-10,-10,-10,1,0,1,//v23 红蓝
      ]);
      
      var floatSize = verticesColors.BYTES_PER_ELEMENT;
      var vertexColorBuffer = utils.initVertexBufferObject(gl,verticesColors);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 6 ,0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,floatSize * 6 ,floatSize * 3); // 把缓冲区分配给attribute变量  
      var indices = new Uint8Array([
            0,1,2 ,2,1,3, // 前
            4,5,6,6,5,7, //右
            8,9,10,10,9,11, //上
            12,13,14,14,13,15, // 下
            16,17,18,18,17,19,//左
             20,21,22,22,21,23,//后
      ]);
      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据

      var radius = 50,angle = 0;
      gl.enable(gl.DEPTH_TEST); 
      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空           
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);

            angle += 0.1;
      }
      setInterval(function(){
          draw();
      },100);
}