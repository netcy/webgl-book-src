var Sphere = function (radius,widthSegments,heightSegments) {
	this.radius = radius || 50;
	this.widthSegments = widthSegments || 20;
	this.heightSegments = heightSegments || 10;
	this.verticesArray = [];
	this.indicesArray = [];
	this.createVerticesColorsIncies();
}

Sphere.prototype.createVerticesColorsIncies = function() {
	var PI = Math.PI,PI2 = Math.PI*2;
	var  widthSegments = this.widthSegments,
            heightSegments = this.heightSegments,
            radius = this.radius,
            verticesArray = this.verticesArray,
            indicesArray = this.indicesArray;
      for(j = 0; j <= heightSegments; j ++){
            var ii = widthSegments;
            if(j == 0 || j == heightSegments){
               ii = 0;
            }
            for(i = 0;i <= ii; i ++){
                 var u = i / widthSegments;
                 var v = j / heightSegments;
                 var x = radius * Math.sin(v* PI ) * Math.cos(u * PI2);
                 var y = radius  * Math.cos(v * PI );
                 var z = radius * Math.sin(v * PI ) * Math.sin(u * PI2);
                 var r = u, g = v, b = v;
                 verticesArray.push(x,y,z,r,g,b);
             }
       } 

      for(j = 0; j < heightSegments; j ++){
          for(i = 0;i < widthSegments; i ++){
               var index =  (j - 1) * (widthSegments + 1) + i  + 1;
               if( j == 0){
                  var i0 = 0,i1 =  i + 2,i2 = i + 1;
                  indicesArray.push(i0,i1,i2);
               }else if(j == heightSegments -1){
                 var i0 = index ,i1 = index +1,i2 = verticesArray.length/6 - 1;
                 indicesArray.push(i0,i1,i2);
               }else{
                      var i0 = index,i1 = index + 1,i2 =  index + widthSegments  + 1 ,i3 = index + widthSegments + 2;
                      indicesArray.push(i0,i3,i1);
                      indicesArray.push(i0,i3,i2);
               }
           }
      }
};

Sphere.prototype.getVerticesArray = function (){
	return this.verticesArray;
}

Sphere.prototype.getIndicesArray = function(){
	return this.indicesArray;
}
