function load(){
      var gl = window.gl= utils.getWebGLContext('webgl');
      if(gl == null){
        console.log("Get WebGL Context fail");
        return;
      }
     var textureProgram = utils.buildProgram(gl,textureVS,textureFS);
     utils.getProgramVariableLocations(gl,textureProgram,['aPosition','aUv','uTexture','uModelMatrix','uViewMatrix','uProjectMatrix']);
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
      var vertexUvBuffer = utils.initVertexBufferObject(gl,verticesUvs);
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
      function loadTexture(gl,src){
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
          }
      }
      loadTexture(gl,'./images/fence.png');
      var radius = 50,angle = 0;
      gl.enable(gl.DEPTH_TEST); 
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      function draw(){
            var viewMatrix = mat4.create(),modelMatrix = mat4.create();
            var projectMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),0,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);

            createFramebufferObject(gl,512,512);  // 创建并设置帧缓冲对象
            gl.viewport(0,0,512,512);
            gl.clearColor(1.0,.0,.0,1.0);//设置背景色为蓝色
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空  
             // 绘制贴图的立方体
            gl.useProgram(textureProgram);   
            gl.enableVertexAttribArray(textureProgram.aPosition);
            gl.enableVertexAttribArray(textureProgram.aUv);
            gl.vertexAttribPointer(textureProgram.aPosition,3,gl.FLOAT,false,floatSize * 5 ,0); // 把缓冲区分配给attribute变量  
            gl.vertexAttribPointer(textureProgram.aUv,2,gl.FLOAT,false,floatSize * 5 ,floatSize * 3); // 把缓冲区分配给attribute变量  

            gl.uniformMatrix4fv(textureProgram.uModelMatrix,false,modelMatrix);
            gl.uniformMatrix4fv(textureProgram.uViewMatrix,false,viewMatrix);
            gl.uniformMatrix4fv(textureProgram.uProjectMatrix,false,projectMatrix);
            gl.uniform1i(textureProgram.uTexture, 1);
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);

            gl.bindFramebuffer(gl.FRAMEBUFFER,null); // 取消帧缓冲对象的绑定
            gl.viewport(0,0,300,300);
            gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空  
            //绘制四边形
           gl.useProgram(textureProgram);   
            gl.enableVertexAttribArray(textureProgram.aPosition);
            gl.enableVertexAttribArray(textureProgram.aUv);
            gl.vertexAttribPointer(textureProgram.aPosition,3,gl.FLOAT,false,floatSize * 5 ,0); // 把缓冲区分配给attribute变量  
            gl.vertexAttribPointer(textureProgram.aUv,2,gl.FLOAT,false,floatSize * 5 ,floatSize * 3); // 把缓冲区分配给attribute变量  
            // mat4.fromTranslation(modelMatrix,[-10,0,0]); 
            // gl.uniformMatrix4fv(textureProgram.uModelMatrix,false,modelMatrix);
            mat4.lookAt(viewMatrix,[0,-20,radius],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(textureProgram.uViewMatrix,false,viewMatrix);
            gl.uniformMatrix4fv(textureProgram.uProjectMatrix,false,projectMatrix);
            gl.uniform1i(textureProgram.uTexture, 0);
            gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_BYTE,0);

            angle += 0.1;
      }
      setInterval(draw,100);

      function createFramebufferObject(gl,width,height){
             var framebuffer = gl.createFramebuffer();    //  创建帧缓冲对象
             var texture = gl.createTexture();  //  创建贴图对象
             gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
             gl.activeTexture(gl.TEXTURE0);  //  激活gl.TEXTURE0
             gl.bindTexture(gl.TEXTURE_2D, texture);  // 绑定贴图对象
             // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
             //  为贴图对象创建一块空白的内存区域
             gl.texImage2D(gl.TEXTURE_2D,0, gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // 设置贴图参数
             framebuffer.texture = texture; // 保存纹理对象

             var depthBuffer =  gl.createRenderbuffer(); // 创建渲染缓冲对象
             //把渲染缓冲对象绑定到目标gl.RENDERBUFFER
             gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer); 
             //设置渲染缓冲对象的数据存储格式
             gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,width,height);

             // 把帧缓冲对象绑定到目标gl.FRAMEBUFFER
             gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
             // 把贴图对象指定为帧缓冲区的颜色关联对象
             gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
             // 把渲染缓冲对象指定指定为帧缓冲对象的深度关联对象
             gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);

             var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
             if(status !== gl.FRAMEBUFFER_COMPLETE){
                  console.log("Create framebuffer error,status is " + status);
                  return null;
             }
             return framebuffer;
      }
}