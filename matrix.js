var matrix = function(){
	var rowSize = arguments[0]
		,colSize = arguments[1]
		,data = arguments[2];
		
	this.rowSize = rowSize || 2;
	this.colSize = colSize || 2;
	this.data = [[1,2],[3,4]] || data;
	
	this.print = function(){
		var me = this;
		for(var i=0;i<me.rowSize;i++){
			for(var j=0;j<me.colSize;j++)
				console.log(me.data[i][j]+" ");
			console.log("\n");
		}
	}
}
