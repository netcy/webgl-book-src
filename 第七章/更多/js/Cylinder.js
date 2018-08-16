var Cylinder = function (radiusTop,radiusBottom,height,widthSegments,heightSegments) {
      this.radiusTop = radiusTop;
      this.radiusBottom = radiusBottom;
      this.height = height;
	this.widthSegments = widthSegments || 20;
	this.heightSegments = heightSegments || 1;
	this.verticesArray = [];
	this.indicesArray = [];
	this.createVerticesColorsIncies();
}

Cylinder.prototype.createVerticesColorsIncies = function() {
	var PI2 = Math.PI*2;
	var  widthSegments = this.widthSegments,
            heightSegments = this.heightSegments,
            radiusTop = this.radiusTop,
            radiusBottom = this.radiusBottom,
            height = this.height,
            verticesArray = this.verticesArray,
            indicesArray = this.indicesArray;
            
      var i,j,radius;
      verticesArray.push(0,height/2,0,0,0,0);
      for(j = 0; j <= heightSegments; j ++){
            var radius = (j * radiusBottom  + (heightSegments - j) * radiusTop ) / heightSegments;
            for(i = 0;i <= widthSegments; i ++){
                 var u = i / widthSegments;
                 var v = j / heightSegments;
                 var x = radius * Math.cos(u * PI2);
                 var y =  ((heightSegments - j) * height / 2  + j * (-height/2)) / heightSegments;
                 var z = radius * Math.sin(u * PI2);
                 var r = u, g = v, b = v;
                 verticesArray.push(x,y,z,r,g,b);
             }
       } 
       verticesArray.push(0,-height/2,0,1,1,1);

      for(j = 0; j <= heightSegments + 1; j ++){
          for(i = 0;i < widthSegments; i ++){
               var index =  (j - 1) * (widthSegments + 1) + i  + 1;
               if( j == 0){
                  var i0 = 0,i1 =  i + 1,i2 = i + 2;
                  indicesArray.push(i0,i1,i2);
               }else if(j == heightSegments + 1){
                 var i0 = index ,i1 = index +1,i2 = verticesArray.length/6 - 1;
                 indicesArray.push(i0,i1,i2);
               }else{
                      var i0 = index,i1 = index + 1,i2 =  index + widthSegments  + 1 ,i3 = index + widthSegments + 2;
                      indicesArray.push(i0,i3,i1);
                      indicesArray.push(i0,i3,i2);
               }
           }
      }
      console.log(verticesArray);
      console.log(indicesArray);
};

Cylinder.prototype.getVerticesArray = function (){
	return this.verticesArray;
}

Cylinder.prototype.getIndicesArray = function(){
	return this.indicesArray;
}
