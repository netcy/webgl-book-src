function load(){
  var gl = window.gl= utils.getWebGLContext('webgl');
  if(gl == null){
    console.log("Get WebGL Context fail");
    return;
  }
     gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
      gl.clear(gl.COLOR_BUFFER_BIT);//清空
     var program = utils.buildProgram(gl,billboardVS,billboardFS); // 创建着色器程序 
     // 获取attribute变量的存储位置
      var aPosition =  utils.getVariableLocation(gl,program,'aPosition',true);// gl.getAttribLocation(program,'aPosition');
      var aUv = utils.getVariableLocation(gl,program,'aUv',true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aUv);
       // 获取uniform变量的存储位置
     var uModelViewMatrix = utils.getVariableLocation(gl,program,'uModelViewMatrix',false);
     var uProjectionMatrix = utils.getVariableLocation(gl,program,'uProjectionMatrix',false);
     var uScale = utils.getVariableLocation(gl,program,'uScale',false);
     var uTexture = utils.getVariableLocation(gl,program,'uTexture',false);
  
      var verticesUvs = new Float32Array([
           -1,-1,0,0, // 第一个顶点
           1,-1, 1,0,
           1,1,1,1,
           -1,1,0,1
      ]); 
      var floatSize = verticesUvs.BYTES_PER_ELEMENT;
      var vertexUVBuffer = utils.initVertexBufferObject(gl,verticesUvs);
      gl.vertexAttribPointer(aPosition,2,gl.FLOAT,false,floatSize * 4 ,0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aUv,2,gl.FLOAT,false,floatSize * 4 ,floatSize * 2); // 把缓冲区分配给attribute变量  
       var indices = new Uint8Array([
          0,1,2,
          0,2,3
      ]);
      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据

      var radius = 50,angle = 0;
      // gl.enable(gl.DEPTH_TEST); 
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

       function loadTexture(gl,src,uTexture){
          var image = new Image();
          image.src = src;
          image.onload = function (argument) {
              var texture = gl.createTexture();
              gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
              gl.activeTexture(gl.TEXTURE0); // 激活gl.TEXTURE1
              gl.bindTexture(gl.TEXTURE_2D, texture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          }
      }
      loadTexture(gl,'./images/tree.png',uTexture);

      function draw(){
            var modelMatrix = mat4.create(),viewMatrix = mat4.create(),modelViewMatrix = mat4.create();
            mat4.fromTranslation(modelMatrix,[10,0,0]);
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            mat4.mul(modelViewMatrix,viewMatrix,modelMatrix)
            gl.uniformMatrix4fv(uModelViewMatrix,false,modelViewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);
            gl.uniformMatrix4fv(uProjectionMatrix,false,projectMatrix);
            gl.uniform2f(uScale,10,10);
            gl.uniform1i(uTexture,0)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空           
            gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);
            angle += 0.1;
      }
      setInterval(draw,100);
}