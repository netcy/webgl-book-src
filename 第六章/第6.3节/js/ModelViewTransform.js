var vertexSource =  ' attribute vec4 aPosition;\n'
 + 'uniform mat4 uModelMatrix;\n'
 + ' uniform mat4 uViewMatrix;\n'
 + ' void main(){\n '
 + ' gl_Position = uViewMatrix * uModelMatrix * aPosition;\n' // 设置顶点位置
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
      var aPosition =  utils.getVariableLocation(gl,program,'aPosition',true);

      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);

       // 获取uniform变量的存储位置
     var uModelMatrix = utils.getVariableLocation(gl,program,'uModelMatrix',false);
     var uViewMatrix = utils.getVariableLocation(gl,program,'uViewMatrix',false);
     var uColor = utils.getVariableLocation(gl,program,'uColor',false);
     var vertices = new Float32Array([
          -0.5,0.5,0.0, 
          -0.5,-0.5,0.0,
          0.5,0.5,0.0,  
          0.5,-0.5, 0.0, 
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,3,aPosition);  
  
      var eyeX = 0,eyeY=0,targetX=0,targetY=0;
      $('input').change(function(event){
            eyeX = $('#eyeX').val();
            eyeY = $('#eyeY').val();
            targetX = $('#targetX').val();
            targetY = $('#targetY').val();
            draw();
      });

      var modelMatrix = mat4.create();
      var viewMatrix = mat4.create();
      function draw(){
          mat4.lookAt(viewMatrix,[eyeX,eyeY,0.5],[targetX,targetY,0],[0,1,0]);
          gl.uniformMatrix4fv(uViewMatrix,false,viewMatrix);
          mat4.fromRotation(modelMatrix,Math.PI/4,[0,0,1]);
          gl.uniformMatrix4fv(uModelMatrix,false,modelMatrix);
          gl.uniform4f(uColor,1.0,0.0,0.0,1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);//清空
          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      }
      draw();  
}