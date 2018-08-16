var vertexSource =  ' attribute vec4 aPosition;\n'
 + ' attribute vec2 aUv;\n'
 + ' uniform float uScale;\n'
 + ' varying vec2 vUv;\n'
 + ' void main(){\n '
 + '  vUv = aUv;\n'
 + ' gl_Position = vec4(aPosition.x * uScale,aPosition.y * uScale,aPosition.z,1.0);\n' // 设置顶点位置
 + '}'; 
var fragmentSource=  ' precision mediump float;\n '
 + ' varying vec2 vUv;\n'
 + ' uniform sampler2D uTexture;\n'
 + ' void main(void){\n'
 + 'gl_FragColor = texture2D(uTexture, vUv);\n' // 设置颜色
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
      var aPosition =  utils.getVariableLocation(gl,program,"aPosition",true);
      var aUv = utils.getVariableLocation(gl,program,"aUv",true);
      // 启用attribute变量使用缓冲区
       gl.enableVertexAttribArray(aPosition);
       gl.enableVertexAttribArray(aUv);

       // 获取uniform变量的存储位置
     var uTexture =  utils.getVariableLocation(gl,program,"uTexture",false);
     var uScale = utils.getVariableLocation(gl,program,"uScale",false);
    var vertices = new Float32Array([
          -0.5,0.5,
          -0.5,-0.5,
          0.5,0.5,
          0.5,-0.5,
      ]);
      var vertexBuffer = utils.initVertexBufferObject(gl,vertices,2,aPosition);
      var uvs = new Float32Array([
            0.0,1.0, // 左上角
            0.0,0.0, // 左下角
            1.0,1.0, // 右上角
            1.0,0.0, // 右上角
      ]);
      var uvBuffer = utils.initVertexBufferObject(gl,uvs,2,aUv);
      
      function loadTexture(gl,src,uTexture){
            var image = new Image();
            image.src = src;
            image.onload = function (argument) {
                
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                var texture0 = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0); // 激活gl.TEXTURE0
                gl.bindTexture(gl.TEXTURE_2D, texture0);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

                 var texture1 = gl.createTexture();
                 gl.activeTexture(gl.TEXTURE1); // 激活gl.TEXTURE1
                 gl.bindTexture(gl.TEXTURE_2D, texture1);
                 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

                 var texture2 = gl.createTexture();
                 gl.activeTexture(gl.TEXTURE2); // 激活gl.TEXTURE2
                 gl.bindTexture(gl.TEXTURE_2D, texture2);
                 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                 gl.generateMipmap(gl.TEXTURE_2D);

                 draw();
            }
      }
      loadTexture(gl,'./images/box.png');

      var scale = 1.0,filterMode = 0;
      function draw(){
          gl.uniform1f(uScale,scale);
          gl.uniform1i(uTexture, filterMode);
          gl.clear(gl.COLOR_BUFFER_BIT);//清空
          gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      }

      var scaleEle = document.getElementById('scale');
      var filterModeEle = document.getElementById('filterMode');
      scaleEle.addEventListener('change',function(){
           scale = scaleEle.value;
           draw();
      });
      filterModeEle.addEventListener('change',function(){
           filterMode = filterModeEle.value;
           draw();
      });
}

