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

      var sphere = new Sphere(10,20,10);
      var verticesArray = sphere.getVerticesArray(),indicesArray = sphere.getIndicesArray();

      var verticesColors = new Float32Array(verticesArray); 
      var floatSize = verticesColors.BYTES_PER_ELEMENT;
      var vertexColorBuffer = utils.initVertexBufferObject(gl,verticesColors);
      gl.vertexAttribPointer(aPosition,3,gl.FLOAT,false,floatSize * 6 ,0); // 把缓冲区分配给attribute变量  
      gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,floatSize * 6 ,floatSize * 3); // 把缓冲区分配给attribute变量  
      var indices = new Uint8Array(indicesArray);
      var indexBuffer = gl.createBuffer(); // 创建缓冲区
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer); //绑定缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW); //给缓冲区填充数据

      var radius = 50,angle = 0;
      gl.enable(gl.DEPTH_TEST); 
      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),0,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
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