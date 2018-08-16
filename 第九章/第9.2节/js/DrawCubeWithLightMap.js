var vertexSource =  ' attribute vec4 aPosition;\n'
 + ' attribute vec2 aUv;\n'
 + ' attribute vec2 aUv1;\n'//定义光照贴图纹理坐标
 + ' varying vec2 vUv;\n' 
 + ' varying vec2 vUv1;\n'//定义光照贴图纹理坐标
  + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' void main(){\n '
 + '   vUv = aUv;\n'
 + '   vUv1 = aUv1;\n' //把attribute变量赋值给varying变量
 + '   gl_Position = uProjectMatrix * uViewMatrix * aPosition;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  'precision mediump float;\n '
 + ' varying vec2 vUv;\n'
 + ' varying vec2 vUv1;\n'//定义光照贴图纹理坐标
 + ' uniform sampler2D uTexture;\n'
 + ' uniform sampler2D uLightMap;\n'// 定义光照贴图采样器
 + ' void main(void){\n'
 + '    vec4 color1 = texture2D(uTexture, vUv);\n'
 + '    vec4 color2 = texture2D(uLightMap, vUv1);\n'//获取光照贴图的颜色
 + '    gl_FragColor = color1 * color2;\n' // 融合光照贴图和颜色贴图
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
     var aUv = utils.getVariableLocation(gl,program,'aUv',true);
     var aUv1 = utils.getVariableLocation(gl,program,'aUv1',true); 
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aUv);
       gl.enableVertexAttribArray(aUv1);
       // 获取uniform变量的存储位置

      var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
      var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
      var  uTexture = utils.getVariableLocation(gl,program,'uTexture',false);
      var  uLightMap = utils.getVariableLocation(gl,program,'uLightMap',false);

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
      var vertexUVBuffer = utils.initVertexBufferObject(gl,verticesUvs);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 5 ,0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aUv,2,gl.FLOAT,false,floatSize * 5 ,floatSize * 3); // 把缓冲区分配给attribute变量  aUv
      gl.vertexAttribPointer(aUv1,2,gl.FLOAT,false,floatSize * 5 ,floatSize * 3); // 把缓冲区分配给attribute变量 aUv1 
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

      window.imageLoadedCount = 0;
      loadTexture(gl,'./images/brick.jpg',uTexture,0,draw);//加载颜色贴图
      loadTexture(gl,'./images/lightmap.gif',uLightMap,1,draw); // 加载光照贴图

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
      }

}

function loadTexture(gl,src,textureLoc,slot,callback){
      var image = new Image();
      image.src = src;
      image.onload = function (argument) {
          var texture = gl.createTexture(); // 创建贴图对象
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.activeTexture(gl.TEXTURE0 + slot); // 激活
          gl.bindTexture(gl.TEXTURE_2D, texture);//绑定贴图目标
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);//上传贴图数据
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // 指定贴图参数
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // 指定贴图参数
          gl.uniform1i(textureLoc, slot);// 指定贴图单元

          imageLoadedCount ++;
          if(imageLoadedCount == 2){// 判断两张贴图是否全部加载完
            callback && callback();
          }
      }
}