var vertexSource =  ' attribute vec4 aPosition;\n'
 + ' uniform mat4 uViewMatrix;\n'
 + ' uniform mat4 uProjectMatrix;\n'
 + ' void main(){\n '
 + ' gl_Position = uProjectMatrix * uViewMatrix * aPosition;\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + 'uniform vec4 uColor;\n'
 + ' void main(void){\n'
 + 'gl_FragColor = uColor;\n' // 设置颜色
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
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       // 获取uniform变量的存储位置
     var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
     var uProjectMatrix = utils.getVariableLocation(gl,program,'uProjectMatrix',false);
     var uColor = utils.getVariableLocation(gl,program,'uColor',false);

     var vertices = new Float32Array([
          -10,5,0.0,
          -10,-5,0.0,
          0,5,0.0,
          0,-5,0.0,
          -10,5,-5.0,
          -10,-5,-5.0,
          0,5,0.-5,
          0,-5, -5,
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,3,aPosition);  
      var radius = 20,angle = 0;
      gl.enable(gl.DEPTH_TEST);
      function draw(){
            var viewMatrix = mat4.create();
            mat4.lookAt(viewMatrix,[radius * Math.sin(angle),0,radius * Math.cos(angle)],[0.0,0,0],[0,1,0]);
            gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
            var projectMatrix = mat4.create();
            mat4.ortho(projectMatrix,-25,25,-25,25,0.1,1000);
            gl.uniformMatrix4fv(uProjectMatrix,false,projectMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//清空
            gl.uniform4f(uColor,1.0,0.0,0.0,1.0);
            gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

            gl.uniform4f(uColor,1.0,1.0,0.0,1.0);
            gl.drawArrays(gl.TRIANGLE_STRIP,4,4);
            angle += 0.1;
      }
      setInterval(function(){
          draw();
      },100);

}