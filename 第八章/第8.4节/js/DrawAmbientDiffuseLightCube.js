var vertexSource =  ' attribute vec4 aPosition;\n'
 +  'attribute vec4 aColor;\n'
 + ' attribute vec3 aNormal;\n' // 法线向量
 + ' uniform vec3 uLightColor;\n' // 光线颜色
 + ' uniform vec3 uLightDirection;\n' // 平行光方向
  + ' uniform vec3 uAmbientLightColor;\n'
 + ' varying vec4 vColor;\n'
 + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' void main(){\n '
 + '    gl_Position = uProjectMatrix * uViewMatrix * aPosition ;\n' // 设置顶点位置
 + '    vec3 normal = normalize(aNormal);\n' // 对法线向量进行归一化
 + '    float normalDotDirection = max(dot(normal,uLightDirection),0.0);\n'
 + '    vec3 diffuse = uLightColor * vec3(aColor);\n'
 + '    vec3 ambient = uAmbientLightColor * vec3(aColor);\n'
 + '    vColor = vec4(ambient + diffuse * normalDotDirection,aColor.a);\n'
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
      var  aNormal = utils.getVariableLocation(gl,program,'aNormal',true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aColor);
       gl.enableVertexAttribArray(aNormal);
       // 获取uniform变量的存储位置
     var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
     var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
     var uLightColor = utils.getVariableLocation(gl,program,'uLightColor',false);
     var uLightDirection = utils.getVariableLocation(gl,program,'uLightDirection',false);
     var uAmbientLightColor = utils.getVariableLocation(gl,program,'uAmbientLightColor',false);

     var verticesColorsNormals = new Float32Array([
           // 前面四个顶点
             -10,  10,  10, 1,0,0, 0,0,1,//v0  红色 法线向量 0,0,1
            -10, -10,  10, 1,0,0,0,0,1,// v1 红色
              10,  10,  10,  1,0,0,0,0,1,// v2 红色
              10,  -10, 10,  1,0,0,0,0,1,// v3 红色
           // 右面四个顶点
             10,10,10, 0,1,0, 1,0,0,//v4 绿色 法线向量 1,0,0
             10,-10,10, 0,1,0,1,0,0,//v5 绿色
             10,10,-10, 0,1,0,1,0,0,//v6 绿色
             10,-10,-10, 0,1,0,1,0,0,//v7 绿色
           // 上面四个顶点
             -10,10,-10,0,1,1, 0,1,0,//v8 青色 法线向量 0,1,0
             -10,10,10,0,1,1, 0,1,0,//v9 青色 
             10,10,-10,0,1,1,0,1,0,//v10 青色 
             10,10,10,0,1,1,0,1,0,//v11 青色 
           // 下面四个顶点
              -10,-10,10,1,1,1,0,-1,0,//v12 白色 法线向量 0,-1,0
             -10,-10,-10,1,1,1,0,-1,0,//v13 白色
             10,-10,10,1,1,1,0,-1,0,//v14 白色 
             10,-10,-10,1,1,1,0,-1,0,//v15 白色
           // 左面的四个顶点
            -10,10,-10,1,1,0,-1,0,0,//v16 黄色  法线向量 -1,0,0
            -10,-10,-10,1,1,0,-1,0,0,//v17 黄色
            -10,10,10,1,1,0,-1,0,0,//v18黄色
            -10,-10,10,1,1,0,-1,0,0,//v19 黄色
           // 后面的四个顶点
            10,10,-10,1,0,1,0,0,-1,//v20 红蓝 法线向量 0,0,-1
            10,-10,-10,1,0,1,0,0,-1,//v21 红蓝
            -10,10,-10,1,0,1,0,0,-1,//v22 红蓝
            -10,-10,-10,1,0,1,0,0,-1,//v23 红蓝
      ]);

     var indices = new Uint8Array([
            0,1,2 ,2,1,3, // 前
            4,5,6,6,5,7, //右
            8,9,10,10,9,11, //上
            12,13,14,14,13,15, // 下
            16,17,18,18,17,19,//左
             20,21,22,22,21,23,//后
      ]);

      var floatSize = verticesColorsNormals.BYTES_PER_ELEMENT;
      var vertexColorNormalBuffer = utils.initVertexBufferObject(gl,verticesColorsNormals);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 9 ,0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,floatSize * 9 ,floatSize * 3); // 把缓冲区分配给attribute变量 
      gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,floatSize * 9 ,floatSize * 6); // 把缓冲区分配给attribute变量  
    
      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据

      var radius = 50,angle = 0;
      var lightColor = [1.0,1.0,1.0],lightDirection = [0,0,1],ambientLightColor = [0.5,0.5,0.5];
      gl.enable(gl.DEPTH_TEST); 
      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);
            gl.uniform3fv(uLightColor,lightColor);
            gl.uniform3fv(uLightDirection,lightDirection);
            gl.uniform3fv(uAmbientLightColor,ambientLightColor);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空           
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);

            angle += 0.1;
      }
      setInterval(function(){
          draw();
      },100);
}