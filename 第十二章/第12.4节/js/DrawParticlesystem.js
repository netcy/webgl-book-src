function load(){
     var gl = window.gl= utils.getWebGLContext('webgl');
     if(gl == null){
       console.log("Get WebGL Context fail");
       return;
     }
     gl.clearColor(0.0,0.0,1.0,1.0);//设置背景色为蓝色
     gl.clear(gl.COLOR_BUFFER_BIT);//清空
     var program = utils.buildProgram(gl,particleVS,particleFS); // 创建着色器程序 
     // 获取attribute变量的存储位置
     // utils.getVariableLocation = function(gl,program,name,attribute){
      var aPosition =  utils.getVariableLocation(gl,program,'aPosition',true);
      var aPointSize =  utils.getVariableLocation(gl,program,'aPointSize',true);
      var aColor = utils.getVariableLocation(gl,program,'aColor',true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aPointSize);  
       gl.enableVertexAttribArray(aColor);  
       // 获取uniform变量的存储位置
      var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
      var uProjectionMatrix = utils.getVariableLocation(gl,program,'uProjectionMatrix',false);
    
      var verticeArray =  []
      var particleRange = 5,particleCount = 2000;
      for(var i = 0;i < particleCount;i ++){
          var x = Math.random() * particleRange/2 - 0.5 * particleRange/2;
          var y = Math.random() * particleRange * 2 - 0.5 * particleRange * 2 - 20;
          var z = Math.random() * particleRange /2- 0.5 * particleRange/2;
          var r = Math.random() *0.01 + 0.01,g = Math.random() *0.01 + 0.01,b = Math.random() *0.01 + 0.01;
          var pointSize = Math.random() * 2+ 1;
          verticeArray.push(x,y,z,pointSize,r,g,b);
      }
      var vertices = new Float32Array(verticeArray);
      var floatSize = vertices.BYTES_PER_ELEMENT;
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 7 ,floatSize * 0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aPointSize,1,gl.FLOAT,false,floatSize * 7 ,floatSize * 3); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,floatSize * 7 ,floatSize * 4); // 把缓冲区分配给attribute变量  

      var radius = 50,angle = 0;
      // gl.enable(gl.DEPTH_TEST); 
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),20,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
           var projectMatrix = mat4.create();
            mat4.perspective(projectMatrix,Math.PI/4,1,0.1,1000);
            gl.uniformMatrix4fv(uProjectionMatrix,false,projectMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空           
            gl.drawArrays(gl.POINTS,0,particleCount);
            updateParticle();
      }
      setInterval(draw,30);

      function updateParticle(){
          for(var i = 0;i < verticeArray.length;i += 7){
              var xOffset = Math.random() * 0.02;
              var yOffset= Math.random() * 0.1 + 0.1;
              verticeArray[i] += (i % 2 == 0) ? xOffset : (-xOffset);
              verticeArray[i + 1] += yOffset; 
              if(verticeArray[i + 1] > 20 * Math.random() - 8){ // 重新初始化，表示原来的粒子消亡，新粒子产生。
                  verticeArray[i] = Math.random() * particleRange/2- 0.5 * particleRange/2;
                  verticeArray[i + 1] = Math.random() * particleRange*2 - 0.5 * particleRange*2 - 20;
                  verticeArray[i + 3]  = Math.random() * 2+ 1;
                  verticeArray[i + 4]  = Math.random() *0.01 + 0.01;
                  verticeArray[i + 5] = Math.random() *0.01 + 0.01;
                  verticeArray[i + 6] = Math.random() *0.01+ 0.01;
              }
          }
          var vertices = new Float32Array(verticeArray);
          gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); //绑定缓冲区
          gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW); //给缓冲区填充数据 
           gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 7 ,floatSize * 0); // 把缓冲区分配给attribute变量  
          gl.vertexAttribPointer(aPointSize,1,gl.FLOAT,false,floatSize * 7 ,floatSize * 3); // 把缓冲区分配给attribute变量  
          gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,floatSize * 7 ,floatSize * 4); // 把缓冲区分配给attribute变量  
      }
}