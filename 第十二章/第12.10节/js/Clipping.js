var vertexSource =  ' attribute vec4 aPosition;\n'
 +  'attribute vec2 aUv;\n'
 + 'varying vec2 vUv;\n'
 + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' void main(){\n '
 + ' vUv = aUv;\n'
 + ' gl_Position = uProjectMatrix * uViewMatrix * aPosition ;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + '  varying vec2 vUv;\n'
 + ' uniform sampler2D uTexture;\n'
 + ' void main(void){\n'
 + '        gl_FragColor =  texture2D(uTexture,vUv);\n' // 设置颜色
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
      var aUv = utils.getVariableLocation(gl,program,'aUv',true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aUv);
       // 获取uniform变量的存储位置
     var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
     var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
     var uTexture = utils.getVariableLocation(gl,program,'uTexture',false);
     var stencilVerticesUvs = new Float32Array([
          -0.5,0.5,0,0,1,//v0
          -0.5,-0.5,0,0,0,//v1
          0.5, 0.5,0,1,1,//v2
          0.5,-0.5,0,1,0,//v3
      ]);
  
      var verticesUvs = new Float32Array([
           // 前面四个顶点
             -10,  10,  10, 0,1,//v0  
            -10, -10,  10, 0,0,// v1 
              10,  10,  10,  1,1,// v2
              10,  -10, 10,  1,0,// v3
           // 右面四个顶点
             10,10,10, 0,1,//v4 
             10,-10,10, 0,0,//v5
             10,10,-10, 1,1,//v6 
             10,-10,-10, 1,0,//v7
           // 上面四个顶点
             -10,10,-10,0,1,//v8 
             -10,10,10,0,0,//v9  
             10,10,-10,1,1,//v10 
             10,10,10,1,0,//v11 
           // 下面四个顶点
              -10,-10,10,0,1,//v12 
             -10,-10,-10,0,0,//v13 
             10,-10,10,1,1,//v14 
             10,-10,-10,1,0,//v15
           // 左面的四个顶点
            -10,10,-10,0,1,//v16
            -10,-10,-10,0,0,//v17
            -10,10,10,1,1,//v18
            -10,-10,10,1,0,//v19
           // 后面的四个顶点
            10,10,-10,0,1,//v20 
            10,-10,-10,0,0,//v21
            -10,10,-10,1,1,//v22
            -10,-10,-10,1,0,//v23
      ]);
      
      var floatSize = verticesUvs.BYTES_PER_ELEMENT;
      var stencilVertexUVBuffer = utils.initVertexBufferObject(gl,stencilVerticesUvs);
      var vertexUVBuffer = utils.initVertexBufferObject(gl,verticesUvs);
      var stencilIndices = new Uint8Array([
           0,1,2,2,1,3,
      ]);
      var indices = new Uint8Array([
            0,1,2 ,2,1,3, // 前
            4,5,6,6,5,7, //右
            8,9,10,10,9,11, //上
            12,13,14,14,13,15, // 下
            16,17,18,18,17,19,//左
             20,21,22,22,21,23,//后
      ]);
      var stencilIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,stencilIndexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,stencilIndices,gl.STATIC_DRAW); //给缓冲区填充数据
      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据
      
      function loadTexture(gl,src,uTexture){
          var image = new Image();
          image.src = src;
          image.onload = function (argument) {
              var texture = gl.createTexture();
              gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
              gl.activeTexture(gl.TEXTURE1); // 激活gl.TEXTURE1
              gl.bindTexture(gl.TEXTURE_2D, texture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.uniform1i(uTexture, 1);
              draw();
          }
      }

      loadTexture(gl,'./images/fence.png',uTexture);
      var radius = 50,angle = 0;
      gl.enable(gl.DEPTH_TEST); 
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      function draw(){
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);//清空
              drawStencilBuffer(); 
              gl.clear(gl.DEPTH_BUFFER_BIT );//清空
              drawCube();
              angle += 0.1;
      }

      function enableStencilWrite(){
            gl.enable(gl.STENCIL_TEST);
            gl.stencilFunc(gl.ALWAYS, 1, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
            gl.stencilMask(0xFF);
            gl.colorMask(false, false, false, false);
      }

      function enableStencilTest(){
            gl.stencilFunc(gl.EQUAL, 1, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            gl.stencilMask(0x00);
            gl.colorMask(true, true, true, true);
      }
      
      function drawStencilBuffer(){
            enableStencilWrite();
            gl.bindBuffer(gl.ARRAY_BUFFER,stencilVertexUVBuffer); //绑定缓冲区
            gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 5 ,0); // 把缓冲区分配给attribute变量  
            gl.vertexAttribPointer(aUv,2,gl.FLOAT,false,floatSize * 5 ,floatSize * 3); // 把缓冲区分配给attribute变量  
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,stencilIndexBuffer); //绑定缓冲区

            var viewMatrix = mat4.create(),projectMatrix = mat4.create();
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);
            gl.drawElements(gl.TRIANGLES,stencilIndices.length,gl.UNSIGNED_BYTE,0);
      }

      function drawCube(){
            enableStencilTest();
            gl.bindBuffer(gl.ARRAY_BUFFER,vertexUVBuffer); //绑定缓冲区
            gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 5 ,0); // 把缓冲区分配给attribute变量  
            gl.vertexAttribPointer(aUv,2,gl.FLOAT,false,floatSize * 5 ,floatSize * 3); // 把缓冲区分配给attribute变量  
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区

           var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);   
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);
      }
      setInterval(draw,200);
}