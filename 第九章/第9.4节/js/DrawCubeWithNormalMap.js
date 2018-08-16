var vertexSource =  ' attribute vec4 aPosition;\n'
 +  'attribute vec4 aColor;\n'
 +  'varying vec4 vColor;\n'
 + ' attribute vec2 aUv;\n'
 + ' varying vec2 vUv;\n'
 + ' varying vec3 vPosition;\n'
  + ' attribute vec3 aNormal;\n' // 定义attribute变量：法线向量
 + ' varying vec3 vNormal;\n'  // 定义varying变量：法线向量
 + ' attribute vec3 aTangent;\n' // 定义attribute变量：切线向量 
 + ' varying vec3 vTangent;\n' // 定义varying变量：切线向量 
 + ' attribute vec3 aBinormal;\n' // 定义attribute 变量：副法线向量
 + ' varying vec3 vBinormal;\n' // 定义varying变量：副法线向量
 + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' void main(){\n '
 + '    gl_Position = uProjectMatrix * uViewMatrix * aPosition ;\n' // 设置顶点位置
 + '    vPosition = vec3(aPosition);\n'
 + '    vColor = aColor;\n'
 + '    vUv = aUv;\n'
 + '   vNormal = aNormal;\n' // 把attribute变量的值赋给varying变量
 + '   vTangent = aTangent;\n' // 把attribute变量的值赋给varying变量
 + '   vBinormal = aBinormal;\n' // 把attribute变量的值赋给varying变量
 // + '    vColor = vec4(ambient + diffuse * normalDotDirection,aColor.a);\n'
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + ' uniform vec3 uLightColor;\n' // 光线颜色
 + ' uniform vec3 uLightPosition;\n' //  点光源位置
 + ' uniform vec3 uAmbientLightColor;\n'
 + ' uniform sampler2D uNormalMap;\n'// 定义法线贴图采样器
 + ' varying vec3 vNormal;\n'// 定义varying变量：法线向量
 + ' varying vec2 vUv;\n'
 + ' varying vec3 vTangent;\n'// 定义varying变量：切线向量 
 + ' varying vec3 vBinormal;\n'// 定义varying变量：副法线向量
 + ' varying vec3 vPosition;\n'
 + ' varying vec4 vColor;\n'
 + ' void main(void){\n'
 + '    vec3 tNormal = texture2D(uNormalMap,vUv).rgb;' // 获取法线贴图的像素值
 + '    vec3 normal = normalize(tNormal * 2.0 - 1.0);\n' // 把获取的像素转换成法线向量
 + '   mat3 tbn = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\n'// 通过切线、副法线、法线组成tbn矩阵
 + '   vec3 finalNormal = tbn * normal;\n'// 把法线向量从切线空间变换到模型空间
 + '    vec3 lightDirection = normalize(uLightPosition - vPosition);\n'
 + '    float normalDotDirection = max(dot(finalNormal,lightDirection),0.0);\n'
 + '    vec3 diffuse = uLightColor * vec3(vColor);\n'
 + '    vec3 ambient = uAmbientLightColor * vec3(vColor);\n'
 + '    gl_FragColor = vec4(ambient + diffuse * normalDotDirection,vColor.a);\n' // 设置颜色
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
      var  aUv = utils.getVariableLocation(gl,program,'aUv',true);

      var aNormal = utils.getVariableLocation(gl,program,'aNormal',true);// 获取aNormal变量地址
      var aTangent = utils.getVariableLocation(gl,program,'aTangent',true);// 获取aTangent变量地址
      var aBinormal = utils.getVariableLocation(gl,program,'aBinormal',true);// 获取aBinormal变量地址

      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aColor);
       gl.enableVertexAttribArray(aUv);

       gl.enableVertexAttribArray(aNormal);
       gl.enableVertexAttribArray(aTangent);
       gl.enableVertexAttribArray(aBinormal);
       // 获取uniform变量的存储位置
     var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
     var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
     var uLightColor = utils.getVariableLocation(gl,program,'uLightColor',false);
     var uLightPosition = utils.getVariableLocation(gl,program,'uLightPosition',false);
     var uAmbientLightColor = utils.getVariableLocation(gl,program,'uAmbientLightColor',false);
     var uNormalMap = utils.getVariableLocation(gl,program,'uNormalMap',false); // 获取法线贴图的变量地址

     var verticesColorsUvs = new Float32Array([
           // 前面四个顶点
             -10,  10,  10, 1,0,0, 0,1,//v0  红色 
            -10, -10,  10, 1,0,0,0,0,// v1 红色
              10,  10,  10,  1,0,0,1,1,// v2 红色
              10,  -10, 10,  1,0,0,1,0,// v3 红色
           // 右面四个顶点
             10,10,10, 0,1,0, 0,1,//v4 绿色 
             10,-10,10, 0,1,0,0,0,//v5 绿色
             10,10,-10, 0,1,0,1,1,//v6 绿色
             10,-10,-10, 0,1,0,1,0,//v7 绿色
           // 上面四个顶点
             -10,10,-10,0,1,1, 0,1,//v8 青色 
             -10,10,10,0,1,1, 0,0,//v9 青色 
             10,10,-10,0,1,1,1,1,//v10 青色 
             10,10,10,0,1,1, 1,0,//v11 青色
           // 下面四个顶点
              -10,-10,10,1,1,1,0,1,//v12 白色
             -10,-10,-10,1,1,1,0,0,//v13 白色
             10,-10,10,1,1,1,1,1,//v14 白色 
             10,-10,-10,1,1,1,1,0,//v15 白色
           // 左面的四个顶点
            -10,10,-10,1,1,0,0,1,//v16 黄色  
            -10,-10,-10,1,1,0,0,0,//v17 黄色
            -10,10,10,1,1,0,1,1,//v18黄色
            -10,-10,10,1,1,0,1,0,//v19 黄色
           // 后面的四个顶点
            10,10,-10,1,0,1,0,1,//v20 红蓝 
            10,-10,-10,1,0,1,0,0,//v21 红蓝
            -10,10,-10,1,0,1,1,1,//v22 红蓝
            -10,-10,-10,1,0,1,1,0,//v23 红蓝
      ]);

      var normalTangentBinormals = new Float32Array([ // 定义TBN矩阵数据
              // 前面四个顶点
              0,0,1,1,0,0,0,1,0, 0,0,1,1,0,0,0,1,0,   0,0,1,1,0,0,0,1,0, 0,0,1,1,0,0,0,1,0,
              //右面四个顶点
              1,0,0,0,0,-1,0,1,0,  1,0,0,0,0,-1,0,1,0,  1,0,0,0,0,-1,0,1,0,  1,0,0,0,0,-1,0,1,0, 
              // 上面四个顶点
              0,1,0,1,0,0,0,0,-1, 0,1,0,1,0,0,0,0,-1, 0,1,0,1,0,0,0,0,-1, 0,1,0,1,0,0,0,0,-1, 
              // 下面四个顶点
              0,-1,0,1,0,0,0,0,1, 0,-1,0,1,0,0,0,0,1, 0,-1,0,1,0,0,0,0,1, 0,-1,0,1,0,0,0,0,1, 
              //左面四个顶点
              -1,0,0,0,0,1,0,1,0,  -1,0,0,0,0,1,0,1,0,  -1,0,0,0,0,1,0,1,0,  -1,0,0,0,0,1,0,1,0, 
              // 后面四个顶点
              0,0,-1,1,0,0,0,-1,0, 0,0,-1,1,0,0,0,-1,0,   0,0,-1,1,0,0,0,-1,0, 0,0,-1,1,0,0,0,-1,0,
        ]);

     var indices = new Uint8Array([
            0,1,2 ,2,1,3, // 前
            4,5,6,6,5,7, //右
            8,9,10,10,9,11, //上
            12,13,14,14,13,15, // 下
            16,17,18,18,17,19,//左
             20,21,22,22,21,23,//后
      ]);

      var floatSize = verticesColorsUvs.BYTES_PER_ELEMENT;
      var vertexColorUvBuffer = utils.initVertexBufferObject(gl,verticesColorsUvs);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 8 ,0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,floatSize * 8 ,floatSize * 3); // 把缓冲区分配给attribute变量 
      gl.vertexAttribPointer(aUv,2,gl.FLOAT,false,floatSize * 8 ,floatSize * 6); // 把缓冲区分配给attribute变量 

      var normalTangentBinormalBuffer = utils.initVertexBufferObject(gl,normalTangentBinormals);
      gl.vertexAttribPointer(aNormal,3,gl.FLOAT,false,floatSize *9,0);// 把缓冲区分配给attribute变量 
      gl.vertexAttribPointer(aTangent,3,gl.FLOAT,false,floatSize *9,floatSize * 3);// 把缓冲区分配给attribute变量 
      gl.vertexAttribPointer(aBinormal,3,gl.FLOAT,false,floatSize *9,floatSize * 6);// 把缓冲区分配给attribute变量 
    
      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据

      var radius = 50,angle = 0;
      var lightColor = [1.0,1.0,1.0],lightPosition = [15,15,15],ambientLightColor = [0.3,0.3,0.3];
      gl.enable(gl.DEPTH_TEST); 

      loadTexture(gl,'./images/brick_normal.jpeg',uNormalMap); // 加载法线贴图

      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);
            gl.uniform3fv(uLightColor,lightColor);
            gl.uniform3fv(uLightPosition,lightPosition);
            gl.uniform3fv(uAmbientLightColor,ambientLightColor)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空           
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);

            angle += 0.1;
      }
      setInterval(function(){
          draw();
      },500);
}
function loadTexture(gl,src,uTexture){
      var image = new Image();
      image.src = src;
      image.onload = function (argument) {
          var texture = gl.createTexture();// 创建贴图对象
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.activeTexture(gl.TEXTURE1); // 激活gl.TEXTURE1
          gl.bindTexture(gl.TEXTURE_2D, texture);//绑定贴图目标
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);//上传贴图数据
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);// 指定贴图参数
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);// 指定贴图参数
          gl.uniform1i(uTexture, 1);// 指定贴图单元
      }
}