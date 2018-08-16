var vertexSource =  ' attribute vec4 aPosition;\n'
  + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' varying vec3 vPosition;'
 + ' void main(){\n '
 + ' vPosition = vec3(aPosition);\n'
 + '   gl_Position = uProjectMatrix * uViewMatrix * aPosition;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + ' uniform samplerCube uCubeTexture;\n'// 定义立方体贴图采样器
 + ' varying vec3 vPosition;\n'
 + ' void main(void){\n'
 + '    gl_FragColor = textureCube(uCubeTexture,vPosition);\n' // 通过textureCube获取立方体贴图颜色
 + '}';

function load(){
  var gl = window.gl= utils.getWebGLContext('webgl');
  if(gl == null){
    console.log("Get WebGL Context fail");
    return;
  }
  gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
  var program = utils.buildProgram(gl,vertexSource,fragmentSource); // 创建着色器程序 
     // 获取attribute变量的存储位置
     var aPosition = utils.getVariableLocation(gl,program,'aPosition',true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       // 获取uniform变量的存储位置

      var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
      var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
      var  uCubeTexture = utils.getVariableLocation(gl,program,'uCubeTexture',false);// 获取立方体贴图变量地址

       var vertices = new Float32Array([
           // 前面四个顶点
             -1000,  1000,  1000,//v0  
            -1000, -1000,  1000,// v1 
              1000,  1000,  1000,// v2
              1000,  -1000, 1000,// v3
           // 右面四个顶点
             1000,1000,1000, //v4 
             1000,-1000,1000,//v5
             1000,1000,-1000,//v6 
             1000,-1000,-1000,//v7
           // 上面四个顶点
             -1000,1000,-1000,//v8 
             -1000,1000,1000,//v9  
             1000,1000,-1000,//v1000 
             1000,1000,1000,//v11 
           // 下面四个顶点
              -1000,-1000,1000,//v12 
             -1000,-1000,-1000,//v13 
             1000,-1000,1000,//v14 
             1000,-1000,-1000,//v15
           // 左面的四个顶点
            -1000,1000,-1000,//v16
            -1000,-1000,-1000,//v17
            -1000,1000,1000,//v18
            -1000,-1000,1000,//v19
           // 后面的四个顶点
            1000,1000,-1000,//v20 
            1000,-1000,-1000,//v21
            -1000,1000,-1000,//v22
            -1000,-1000,-1000,//v23
      ]);
      
      var floatSize = vertices.BYTES_PER_ELEMENT;
      var vertexUVBuffer = utils.initVertexBufferObject(gl,vertices);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,0 ,0); // 把缓冲区分配给attribute变量  
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
      var images = [   // 定义立方体贴图图片资源
            './images/right.png',
            './images/left.png', 
            './images/top.png', 
            './images/bottom.png', 
            './images/back.png',
            './images/front.png',
      ];
      loadCubeTexture(gl,images,uCubeTexture);// 加载立方体贴图


      var radius = 500,angle = 0;
      gl.enable(gl.DEPTH_TEST); 
      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,10000);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);
            
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空           
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);

            angle += 0.1;
      }

      setInterval(draw,100);
}

function loadCubeTexture(gl,srcs,uCubeTexture){
    var texture = gl.createTexture();// 创建贴图对象
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
    gl.activeTexture(gl.TEXTURE0);//激活贴图单元0
    gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);// 绑定贴图到目标gl.TEXTURE_CUBE_MAP
    for(var i = 0;i < 6; i ++){
         var image = new Image();
         image.src = srcs[i];
         loadCubeTextureFace(gl,image,texture,i);// 给立方体贴图每个面上传数据
    }
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);//设置贴图参数
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);//设置贴图参数
    gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);//设置贴图参数
    gl.texParameteri(gl.TEXTURE_CUBE_MAP ,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);//设置贴图参数
    gl.uniform1i(uCubeTexture,0);
}

function loadCubeTextureFace(gl,image,texture,index){
        image.onload = function(){// 上传贴图数据
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }
}