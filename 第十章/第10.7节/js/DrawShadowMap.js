function load(){
    var gl = window.gl= utils.getWebGLContext('webgl');
    if(gl == null){
      console.log("Get WebGL Context fail");
      return;
    }
     // 创建阴影贴图着色器程序
     var shadowMapProgram = utils.buildProgram(gl,shadowMapVS,shadowMapFS);
     // 创建正常场景着色器程序
     var normalProgram = utils.buildProgram(gl,normalVS,normalFS);
     // 获取阴影贴图着色器程序的变量地址并保存
     utils.getProgramVariableLocations(gl,shadowMapProgram,['aPosition','uMVPMatrixFromLight']);
     // 获取正常场景着色器程序的变量地址并保存
     utils.getProgramVariableLocations(gl,normalProgram,['aPosition','aColor','aNormal','uMVPMatrix','uMVPMatrixFromLight','uLightColor','uLightPosition','uAmbientLightColor','uShadowMap']);
      //创建立方体数据
        var verticesColorsNormals = new Float32Array([
           // 前面四个顶点
             -5,  5,  5, 1,0,0, 0,0,1,//v0  红色 法线向量 0,0,1
            -5, -5,  5, 1,0,0,0,0,1,// v1 红色
              5,  5,  5,  1,0,0,0,0,1,// v2 红色
              5,  -5, 5,  1,0,0,0,0,1,// v3 红色
           // 右面四个顶点
             5,5,5, 0,1,0, 1,0,0,//v4 绿色 法线向量 1,0,0
             5,-5,5, 0,1,0,1,0,0,//v5 绿色
             5,5,-5, 0,1,0,1,0,0,//v6 绿色
             5,-5,-5, 0,1,0,1,0,0,//v7 绿色
           // 上面四个顶点
             -5,5,-5,0,1,1, 0,1,0,//v8 青色 法线向量 0,1,0
             -5,5,5,0,1,1, 0,1,0,//v9 青色 
             5,5,-5,0,1,1,0,1,0,//v10 青色 
             5,5,5,0,1,1,0,1,0,//v11 青色 
           // 下面四个顶点
              -5,-5,5,1,1,1,0,-1,0,//v12 白色 法线向量 0,-1,0
             -5,-5,-5,1,1,1,0,-1,0,//v13 白色
             5,-5,5,1,1,1,0,-1,0,//v14 白色 
             5,-5,-5,1,1,1,0,-1,0,//v15 白色
           // 左面的四个顶点
            -5,5,-5,1,1,0,-1,0,0,//v16 黄色  法线向量 -1,0,0
            -5,-5,-5,1,1,0,-1,0,0,//v17 黄色
            -5,5,5,1,1,0,-1,0,0,//v18黄色
            -5,-5,5,1,1,0,-1,0,0,//v19 黄色
           // 后面的四个顶点
            5,5,-5,1,0,1,0,0,-1,//v20 红蓝 法线向量 0,0,-1
            5,-5,-5,1,0,1,0,0,-1,//v21 红蓝
            -5,5,-5,1,0,1,0,0,-1,//v22 红蓝
            -5,-5,-5,1,0,1,0,0,-1,//v23 红蓝
      ]);
      // 创建平面数据
      var verticesColorsNormals2 = new Float32Array([   // 平面
              -25,-10,25,1,1,1,0,1,0,//v12 白色 法线向量 0,-1,0
             -25,-10,-25,1,1,1,0,1,0,//v13 白色
             25,-10,25,1,1,1,0,1,0,//v14 白色 
             25,-10,-25,1,1,1,0,1,0,//v15 白色
      ]);
     var indices = new Uint8Array([
            0,1,2 ,2,1,3, // 前表面索引
            4,5,6,6,5,7, //右
            8,9,10,10,9,11, //上
            12,13,14,14,13,15, // 下
            16,17,18,18,17,19,//左
             20,21,22,22,21,23,//后
      ]);
     var indices2 = new Uint8Array([
            0,1,2,2,1,3,
      ]);
      
      var floatSize = verticesColorsNormals.BYTES_PER_ELEMENT;
      var verticesColorsNormalBuffer = utils.initVertexBufferObject(gl,verticesColorsNormals);
      var verticesColorsNormalBuffer2= utils.initVertexBufferObject(gl,verticesColorsNormals2);

      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      var indexBuffer2 = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer2); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices2,gl.STATIC_DRAW); //给缓冲区填充数据

      var radius = 40,angle = 0;
      var lightColor = [1.0,1.0,1.0],lightPosition = [0.01,80,0],ambientLightColor = [0.1,0.1,0.1];
      gl.enable(gl.DEPTH_TEST); 

       var viewMatrix = mat4.create(), projectMatrix = mat4.create();
       var mvpMatrix = mat4.create(),mvpMatrixFromLight = mat4.create();
       // 定义光源处的变换矩阵
       var viewMatrixFromLight = mat4.create(),
              projectMatrixFromLight = mat4.create();
      mat4.lookAt(viewMatrixFromLight,lightPosition,[0,0,0],[0,1,0]);
      mat4.perspective(projectMatrixFromLight,Math.PI / 2,1,1,100);
      mat4.mul(mvpMatrixFromLight,projectMatrixFromLight,viewMatrixFromLight);
      // 创建帧缓冲对象
      var framebuffer =  createFramebufferObject(gl,512,512);

      setInterval(draw,100);

      function draw(){ 
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            mat4.perspective(projectMatrix,Math.PI/2,1,1,200);
            mat4.mul(mvpMatrix,projectMatrix,viewMatrix);
            // 绑定帧缓冲对象
            gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
            gl.viewport(0,0,512,512);// 设置视口大小
            gl.clearColor(0.0,0.0,0.0,0.0);// 设置清空颜色为黑色
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空  
            drawShadowMap(); // 生成阴影贴图
            // 取消绑定帧缓冲对象
            gl.bindFramebuffer(gl.FRAMEBUFFER,null);
            gl.viewport(0,0,300,300);// 设置视口大小
            gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空  
            drawNormal(); // 绘制正常场景
            angle += 0.1;
      }

      function drawShadowMap(){
          gl.useProgram(shadowMapProgram);// 使用阴影贴图着色器程序
          // 设置光源处的镜头MVP矩阵
          gl.uniformMatrix4fv(shadowMapProgram.uMVPMatrixFromLight,false,mvpMatrixFromLight);
          gl.enableVertexAttribArray(shadowMapProgram.aPosition);

           gl.bindBuffer(gl.ARRAY_BUFFER,verticesColorsNormalBuffer); //绑定缓冲区
           gl.vertexAttribPointer(shadowMapProgram.aPosition,3,gl.FLOAT,false,floatSize * 9 ,0); // 把缓冲区分配给attribute变量  
           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);    
           gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);

           gl.bindBuffer(gl.ARRAY_BUFFER,verticesColorsNormalBuffer2); //绑定缓冲区
           gl.vertexAttribPointer(shadowMapProgram.aPosition,3,gl.FLOAT,false,floatSize * 9 ,0); // 把缓冲区分配给attribute变量  
           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer2); 
           gl.drawElements(gl.TRIANGLES,indices2.length,gl.UNSIGNED_BYTE,0);
      }

      function drawNormal(){
          gl.useProgram(normalProgram);// 使用正常着色器程序
          // 设置着色器程序uniform变量
          gl.uniform3fv(normalProgram.uLightColor,lightColor);
          gl.uniform3fv(normalProgram.uLightPosition,lightPosition);
          gl.uniform3fv(normalProgram.uAmbientLightColor,ambientLightColor)
          gl.uniformMatrix4fv(normalProgram.uMVPMatrix,false,mvpMatrix);
          gl.uniformMatrix4fv(normalProgram.uMVPMatrixFromLight,false,mvpMatrixFromLight);
          gl.uniform1i(normalProgram.uShadowMap, 0);

          gl.enableVertexAttribArray(normalProgram.aPosition);
          gl.enableVertexAttribArray(normalProgram.aColor);
          gl.enableVertexAttribArray(normalProgram.aNormal);

           gl.bindBuffer(gl.ARRAY_BUFFER,verticesColorsNormalBuffer); //绑定缓冲区
           // 把缓冲区分配给attribute变量  
           gl.vertexAttribPointer(normalProgram.aPosition,3,gl.FLOAT,false,floatSize * 9 ,0); 
           gl.vertexAttribPointer(normalProgram.aColor,3,gl.FLOAT,false,floatSize * 9 ,floatSize * 3); 
           gl.vertexAttribPointer(normalProgram.aNormal,3,gl.FLOAT,false,floatSize * 9 ,floatSize * 6); 

           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);    
           gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);


           gl.bindBuffer(gl.ARRAY_BUFFER,verticesColorsNormalBuffer2); //绑定缓冲区
           // 把缓冲区分配给attribute变量  
            gl.vertexAttribPointer(normalProgram.aPosition,3,gl.FLOAT,false,floatSize * 9 ,0); 
           gl.vertexAttribPointer(normalProgram.aColor,3,gl.FLOAT,false,floatSize * 9 ,floatSize * 3); 
           gl.vertexAttribPointer(normalProgram.aNormal,3,gl.FLOAT,false,floatSize * 9 ,floatSize * 6); 

           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer2); 
           gl.drawElements(gl.TRIANGLES,indices2.length,gl.UNSIGNED_BYTE,0);
      }

      function createFramebufferObject(gl,width,height){
             var framebuffer = gl.createFramebuffer(); //创建帧缓冲区对象
             var texture = gl.createTexture(); // 创建贴图对象
             gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
             gl.activeTexture(gl.TEXTURE0); // 激活gl.TEXTURE0
             gl.bindTexture(gl.TEXTURE_2D, texture);// 绑定贴图
             // 贴图创建空白区域
             gl.texImage2D(gl.TEXTURE_2D,0, gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
             framebuffer.texture = texture;//保存贴图

             var depthBuffer =  gl.createRenderbuffer();// 创建渲染缓冲区
             gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer); // 绑定渲染缓冲区
             // 设置渲染缓冲区格式为深度缓冲区格式
             gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,width,height);

             // 绑定帧缓冲区
             gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
             // 指定贴图为帧缓冲区颜色关联对象
             gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
             // 指定渲染缓冲区为帧缓冲区深度关联对象
             gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);
             // 检查帧缓冲区的状态
             var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
             if(status !== gl.FRAMEBUFFER_COMPLETE){
                  console.log("Create framebuffer error,status is " + status);
                  return null;
             }
             return framebuffer;
      }
}