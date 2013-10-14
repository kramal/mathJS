
var JSMathExt = {};

JSMathExt.numberGenerate = function(str) {
	if (!arguments.callee.id) {
		arguments.callee.id = parseInt(10000*Math.random());
	}
	return str+arguments.callee.id++;
};

JSMathExt.matrix = function(){
	var rowSize = arguments[0]
		,colSize = arguments[1]
		,data = arguments[2]
		,_size = arguments.length;
		
	this.isSystemEquation = false;
	this.diagonalized = false; 
	this.idPrefix = 'mathjs-';
	this.id = 0;
	this._accuracy = 0.000000001;
	this.domID = 'mathjs-matrix_place_id';
	//self-executable function where defined methods of matrix
	( function( me ){
			
		me.id = JSMathExt.numberGenerate(me.idPrefix);
			
		/**
		 * Presents matrix as string.
		 * @return {String} returns string
		 */
		me.print = function(){
			var me = this , str = "";
			
			if( me.data.length == 0 )return null;
			for( var i=0 ; i < me.rowSize; i++ ){
				for( var j=0; j < me.colSize; j++ )
					str += me.data[i][j]+" ";
				str += "\n";
			}
			return str;
		};
		
		me.toString = function(){
			return me.print();
		}
		
		/**
		 * Adds a row to matrix.
		 * @param {Array} row Row that will be added 
		 * @param {Integer} place The place of row
		 */
		me.addRow = function(row,place){
			var place = parseInt(arguments[1])
				,row = arguments[0]
				,me = this;
			try{
				if( !(row instanceof Array) ){
					throw("Row is not array");
				}
			}catch(e){
				row = [];
			}finally{
				if(row.length < me.rowSize){
					row = me._stretchVectorBy( row,this.rowSize);
				}
				
				if( place ){
					me.data.splice( place,0,row );
					me.rowSize++;
				}else{
					me.data.push( row );
					me.rowSize++;
				}
			}
		};
		
		/**
		 * Adds a column to matrix.
		 * @param {Array} col Column that will be added 
		 * @param {Integer} place The place of column
		 */
		me.addCol = function(col,place){
			var place = parseInt(arguments[1])
				,col = arguments[0]
				,me = this;
			
			try{
				if( !(col instanceof Array) ){
					throw("Column is not array");
				}
			}catch(e){
				col = new Array();
			}finally{
				if(col.length < me.colSize){
					col = me._stretchVectorBy( col,me.colSize);
				}
				
				if( place ){
					me.transpon();
					me.data.splice( place,0,col );
					me.rowSize++;
				}else{
					me.transpon();
					me.data.push( col );
					//me.colSize++;
					me.rowSize++;
				}
				me.transpon();
			}
		};
		
		/**
		 * Removes column at specified place.
		 * @param {Integer} number Number of column
		 */  
		me.removeColAt = function(number){
			
			var place = parseInt( arguments[0] )
				,columns = []
				,me = this;
					
			me.transpon();	
			if( place || place == 0 ){
				me.data.splice( place,1 );
			}else{
				me.data.splice( me.colSize-1,1 );
			}
			me.rowSize--;
			me.transpon();	
		};
		
		/**
		 * Removes row at specified place.
		 * @param {Integer} number Number of row
		 */ 
		me.removeRowAt = function(){
			var place = parseInt( arguments[0] )
				,columns = []
				,me = this;
					
			if( place ){
				me.data.splice( place,1 );
			}else{
				me.data.splice( me.rowSize-1,1 );
			}
			me.rowSize--;
		};
		
		/**
		 * gets row at specified place.
		 * @param {Integer} k Number of row
		 * @return {Array} the row
		 */ 
		me.getRowAt = function(k){
			var ar = []
				,k = (function(numb){
					var k = numb;
					if(k-k == 0)return k;
					console.log('Error in getRowAt: argument is not number ');
					return 0;
				})(arguments[0]);
			
			for(var i = 0; i < this.colSize; i++){
				ar[i] = this.data[k][i];
			}
			return ar;
		};
		
		/**
		 * Replaces a row at k-th position to row
		 * @param {Array} row the row that will be placed 
		 * @param {Integer} k number of the row that will be replaced
		 */
		me.replaceRowAt = function(row,k){
			for( var i = 0; i < this.colSize; i++ ){
				this.data[k][i] = row[i];
			}
		}  
		
		/**
		 * Returns k-th column of the matrix .
		 * @param {Integer} k The number of column
		 * @return {Array} the column
		 */
		me.getColAt = function(k){
			var ar = []
				,k = (function(numb){
					var k = numb;
					if(k-k == 0)return k;
					console.log('Error in getColAt: argument is not number ');
					return 0;
				})(arguments[0]);
			
			for( var i = 0; i < this.rowSize; i++ ){
				ar[i] = this.data[i][k];
			}
			
			return ar;
		};
		
		/**
		 * Replaces a column at k-th position to column
		 * @param {Array} col the column that will be placed 
		 * @param {Integer} k number of the column that will be replaced
		 */
		me.replaceColAt = function(col,k){
			for( var i = 0; i < this.rowSize; i++ ){
				this.data[i][k] = col[i];
			}
		};
		
		/**
		 * Computes scalar magnitude of two vectors
		 * @param {Array} m1 the vector 
		 * @param {Array} m2 the vector
		 */
		me.scalar = function(m1,m2){
			var val = 0;
			for(var i = 0; i < m1.length; i++)val +=(m1[i]*m2[i]);
			return val;
		};
		
		/**
		 * Checks matrix to have NxN size
		 * @return {Bool} true if matrix NxN
		 */
		me.isQuad = function(){
			if(this.colSize == this.rowSize)return true;
			return false;
		};
		
		/**
		 * Converse given matrix to system of linear equation by adding column
		 * @param {Array} col the column that will be added
		 * @example: let we have  a matrix
		 * [ 1, 2;
		 *   3, 4]
		 * let we want to make it system of equation by addind column [9,9], so
		 * [ 1, 2 , 9;
		 *   3, 4 , 9]
		 */
		me.makeSystem = function(col){
			if( this.isSystemEquation ){
				console.log("System of Linear Equation has been made earlier");
				return false;
			}
			var place = parseInt(arguments[1])
				,col = arguments[0]
				,me = this;
			
			try{
				if( !(col instanceof Array) ){
					throw("Column is not array");
				}
			}catch(e){
				col = new Array();
			}finally{
				if(col.length < me.colSize){
					col = me._stretchVectorBy( col,me.colSize);
				}
				me.transpon();
				me.data.push( col );
				me.rowSize++;
				me.transpon();
				this.isSystemEquation = true;
			}
		};
		
		/**
		 * Diagonalize the matrix or system
		 * @example: there is system
		 * [ 1, 2 , 3;
		 *   3, 4 , 7]
		 * after diagonalizing we have
		 * [ 1, 0, 1;
		 *   0, -2, -2]
		 */
		me.diagonalize = function(){
			var me = this
				, doit = function(){
					var cols = me.colSize
						,rows = me.rowSize
						,del = 0 , k = 0 , swap = [];
					for(;k<rows-1;k++)
					for(var i = 0; i<rows-k-1; i++){
						var tb = me.data[rows-i-1][k]
							,as = me.data[k][k];
						if( as == 0 || tb == 0 ){
							continue;
						}
						del = tb / as;
						for(var j = 0; j<cols; j++){
							me.data[rows-i-1][j] = me.data[rows-i-1][j] - del*me.data[k][j];
							if( Math.abs(me.data[rows-i-1][j]) < me._accuracy )me.data[rows-i-1][j]=0;
						}
						
					};
					//if a[i][k] and a[i][p] is equal(k>p) then swap rows
					for( var i = 1;i < rows; i++ ){
						if( me.data[i][i] == 0 ){
							console.log(i+','+i+' = '+me.data[i][i]);
							for(var j=i+1;j<rows;j++){
								if( me.data[j][i] != 0){
									console.log(i+','+i+' = '+me.data[j][i]);
									me.swapRows(i,j);
									doit();
									break;
								}
							}
							break;
						}
					}
					me.print();
					
					if( cols-rows == 1 || me.isSystemEquation ){
						for(k = cols-2; k>=1;k--)
						for(var i = k; i>=1; i--){
							var tb = me.data[i-1][k]
								,as = me.data[k][k];
							if( as == 0 || tb == 0 )continue;
							del = tb / as;
							for(var j = 0; j<cols; j++){
								me.data[i-1][j] = me.data[i-1][j] - del*me.data[k][j];
								if( Math.abs(me.data[i-1][j]) < this._accuracy )me.data[i-1][j]=0;
							}
						};
					}else{
						for(k = cols-1; k>=1;k--)
						for(var i = k; i>=1; i--){
							var tb = me.data[i-1][k]
								,as = me.data[k][k];
				
							if( as == 0 || tb == 0 )continue;
							del = tb / as;
							for(var j = 0; j<cols; j++){
								me.data[i-1][j] = me.data[i-1][j] - del*me.data[k][j];
								if( Math.abs(me.data[i-1][j]) < this._accuracy )me.data[i-1][j]=0;
							}
						};
					}
					me.diagonalized = true;
					
				};
			doit();
			me._normalize();
			
			
		};
		//sets element to i,j place
		me.setEl = function(el,k,p){
			//if(el && k && p){
				this.data[k][p]=el;
			//}
		}
			
		/**
		 * Gets resolution of system equation
		 * @return {Array} resolution
		 * @warning: before matrix must be diagonalized by diagonalize()
		 */
		me.getResolve = function(){
			if( this.diagonalized ){
				var solve = [];
				for(var i = 0; i < me.rowSize; i++){
					solve.push( me.data[i][me.colSize-1]/me.data[i][i] );
				}
				return solve;
			}
			console.log("Matrix is not System of Linear Equations or not diagonalized");
		};
		
		/**
		 * Inner function
		 * @return {Number} number of elements in matrix
		 */
		me._prodSize = function(){
			return this.colSize * this.rowSize;
		};
		
		/**
		 * Inner function : stretch vector to relevant size
		 * @param {Array} vector array that will be stretched
		 * @param {Number} size relevant size
		 * @param {Array} stub elements that will be added to vector
		 * @return {Array} stretched vector
		 */
		me._stretchVectorBy = function(vector,size,stub){
			vector = arguments[0];
			stub = stub || [];
			for(var i = 0;i<size;i++)vector.push( (stub[i] || 0) );
			return vector;
		};
		
		/**
		 * Multiplication of matrix
		 * @param {Matrix} matr matrix
		 * @return {Matrix} resulting matrix
		 */
		me.multiply = function(matr){
			var matr = arguments[0] || matr//other matrix
				,me = this//this matrix 
				,res = new JSMathExt.matrix(me.colSize,me.colSize);
			
			if( (matr instanceof JSMathExt.matrix) ){
				if( me.isQuad() && matr.isQuad() ){
					//if matrixes are quadratic then check them to be equal size
					if( me._prodSize() == matr._prodSize() ){
						for(var i = 0; i < me.rowSize; i++){
							for(var j = 0; j < me.colSize; j++){
								res.data[i][j] = me.scalar(me.getRowAt(i),matr.getColAt(j));
								if( Math.abs(res.data[i][j]) < this._accuracy ) res.data[i][j] = 0;
							}
						}
						
						return res;
					}else{
						throw("Matrixes have not equal size");
					}
				}else{
					throw("Matrix is not quadratic ");
				}
				
			}else{
				var number = matr;
				console.log(number);
				for(var i = 0; i < me.rowSize; i++){
					for(var j = 0; j < me.colSize; j++){
						me.data[i][j] *= number;
					}
				}
			}
			return me;
		};
		
		/**
		 * Gets submatrix
		 * @param {Integer} n line number
		 * @param {Integer} m column number
		 */
		me.sub = function(n,m){
			var data = []
				,matr = null
				,n = parseInt(arguments[0]) || n
				,m = parseInt(arguments[1]) || m;
			
			for(var i = 0; i < this.rowSize; i++){
				for( var j =0; j < this.colSize; j++){
						if(i != n && j!= m) data.push(this.data[i][j]);
					
				}
			} 
			matr = new JSMathExt.matrix(this.rowSize-1,this.colSize-1,data);
			return matr;
		};
		
		/**
		 * Transponizes a matrix
		 */
		me.transpon = function(){
			var me = this
				,columns = []
				,rows = me.rowSize
				,cols = me.colSize;
			for( var i=0; i < cols; i++ ){
				columns.push( me.getColAt(i) );
			}
			me.data = columns;
			me.rowSize = cols;
			me.colSize = rows;
		};
		
		/**
		 * Swaps rows p to k, k to p
		 * @param {Integer} p row number
		 * @param {Integer} k row number
		 */
		me.swapRows = function(p,k){
			var me = this
				,rows = me.rowSize;
			if( (p+k)/2 >= 0 && (p+k)/2 < rows){
				var from = me.getRowAt(p)
					,to = me.getRowAt(k);
				me.replaceRowAt(to,p);
				me.replaceRowAt(from,k);
				
			}
		};
		
		/**
		 * Swaps column p to k, k to p
		 * @param {Integer} p column number
		 * @param {Integer} k column number
		 */
		me.swapCols = function(p,k){
			var me = this
				,cols = me.colSize;
			if( (p+k)/2 >= 0 && (p+k)/2 < cols ){
				var from = me.getColAt(p)
					,to = me.getColAt(k);
				me.replaceColAt(to,p);
				me.replaceColAt(from,k);
				
			}
		}
		
		/**
		 * Returns determinant of matrix (with recursion)
		 * @return {Number} determinant
		 */
		me.detR = function(){
			var me = this
				,rows = me.rowSize
				,cols = me.colSize
				,sum = 0;
			if( me.isQuad() ){
				if( rows == 1 )return me.data[0][0];
				if( rows == 2 ){
					
					var d1 = me.data[0][0]*me.data[1][1];
					var d2 = me.data[0][1]*me.data[1][0];
					return d1-d2;
					
				}else{
					for(var i=0;i<me.colSize;i++){
						sum += ( (i%2 == 1)?-1:1 )*( me.sub(0,i).detR() )*me.data[0][i];
					}
					return sum;
				}
			}
		}
		
		/**
		 * Gets algebraic suppplement
		 * @param {Integer} r row    number
		 * @param {Integer} c column number
		 * @return {Matrix} algebraic suppplement
		 */
		me.algebSupplement = function(r,c){
			var data = []
				,matr = null
				,n = parseInt(arguments[0]);
			
			for(var i = 0; i < this.rowSize; i++){
				for( var j =0; j < this.colSize; j++){
					if(i != c && j!= r){
						data.push(this.data[i][j]);
					}
				}
			} 
			
			matr = new JSMathExt.matrix(this.rowSize-1,this.colSize-1,data);
			return matr;
		};
		
		/**
		 * Return back(counter) matrix
		 * @return {Matrix} back(counter) matrix
		 */
		me.obrat = function(){
			var me = this
				,rows = me.rowSize
				,cols = me.colSize
				,det = me.detR()
				,data = [];
			if( me.isQuad() ){
				for( var i = 0; i<rows; i++ ){
					for( var j = 0; j<cols; j++ ){
						var el =  ( ( (i+j)%2 == 1 )?-1:1 )*me.algebSupplement(i,j).detR() ;
						if( Math.abs(el) < this._accuracy ){
							console.log('OK');
							data.push(0);
						}else{
							data.push(el);
						}
					}
				}
				
				var matr = new JSMathExt.matrix(me.rowSize,me.colSize,data);
				matr.multiply(1/det);
				matr._normalize();
				return matr;
			}
		};
		
		/**
		 * Inner function:
		 * Sets accuracy to matrix elements
		 */
		me._normalize = function(){
			var cols = this.colSize
				,rows = this.rowSize
				,res = this;
			for( var i = 0; i < rows; i++ ){
				for( var j = 0; j < cols; j++ ){
					if( Math.abs(res.data[i][j]) < this._accuracy ) res.data[i][j] = 0; 
				}
			}
		};
		
		/**
		 * Render matrix as HTML
		 */
		me.render = function(directives){
			var cols = this.colSize
				,rows = this.rowSize
				,table_menu = document.createElement('table')
				,table_matrix = document.createElement('table')
				,div = document.createElement('form')
				,dom 	= 	( directives ? directives.dom : null )//id of element to write there matrix
				,msg 	= 	( directives ? directives.msg : null )//message to matrix
				,save 	= 	( directives ? directives.save : null )//save previuos printed matrix
				,matrix = this
				,tr = null
				,td = null;
				
			div.id = me.id;
			
			//creating menu table
			tr = document.createElement('tr');
			td = document.createElement('td');

		};
	})(this); 
	
	/**
	 * Creates matrix from given arguments
	 */
	if( _size == 0 ){
		this.rowSize = rowSize || 3;
		this.colSize = colSize || 3;
		this.data = [[9,1,2],[3,4,5],[6,7,8]] || data;
		
	}else if( _size == 1 ){
		if( !rowSize.length ){
			this.rowSize = this.colSize = rowSize;
			this.data = [];
			var row = [];
			for(var i = 0; i < rowSize; i++ ){
				for(var j = 0; j < rowSize; j++ ){
					row[j] = parseInt(rowSize*Math.random());	
				}
				this.data[i] = row;
				row = [];
			}
		}else{
			var matr = rowSize
				,rows = matr.length
				,cols = (function(){
					var max_col = matr[0].length;
					for(var i = 0; i<matr.length; i++){
						if(max_col < matr[i].length)max_col = matr[i].length;
					}
					return max_col;
				})(matr)
				,row = [];
				
			this.data = [];
			this.rowSize = rows;
			this.colSize = cols;	
			if( Math.abs(rows-cols) == 1 )this.isSystemEquation = false;
			for(var i=0; i < rows; i++){
				for(var j=0; j < cols; j++){
					row[j] = (matr[i][j] || 0);
				}
				this.data[i] = row;
				row = [];
			}
		}
		
	}else if( _size == 2 ){
		if( !rowSize.length ){
			this.rowSize = rowSize;
			this.colSize = colSize;
			this.data = [];
			if( Math.abs(rowSize-colSize) == 1 )this.isSystemEquation = true;
			var row = [];
			for(var i = 0; i < rowSize; i++ ){
				for(var j = 0; j < colSize; j++ ){
					row[j] = parseInt(rowSize*colSize*Math.random());	
				}
				this.data[i] = row;
				row = [];
			}
		}else{
			//here matrix presents systems of linear equations
			var matr = rowSize
				,rows = matr.length
				,cols = (function(){
					var max_col = matr[0].length;
					for(var i = 0; i<matr.length; i++){
						if(max_col < matr[i].length)max_col = matr[i].length;
					}
					return max_col;
				})(matr)
				,row = [];
			
			this.data = [];
			this.rowSize = rows;
			this.colSize = cols;	
			
			for(var i=0; i < rows; i++){
				for(var j=0; j < cols; j++){
					row[j] = (matr[i][j] || 0);
				}
				this.data[i] = row;
				row = [];
			}
			this.addCol(colSize);
			cols++;
			if( Math.abs(rows-cols) == 1 ){
				this.isSystemEquation = true;
			}
		}
	
	}else{
		this.rowSize = rowSize ;
		this.colSize = colSize ;
		this.data = []; //data;
		if( Math.abs(rowSize-colSize) == 1 )this.isSystemEquation = true;
		var count = (data.join().split(",")).length
			,mustBe = rowSize*colSize;
		
		if(count < mustBe){
			throw({msg:"There are too little elements must be: "+mustBe+" , real: "+count , msg_id:0});
		}else if(count > mustBe){
			throw({msg:"There are too more elements must be: "+mustBe+" , real: "+count , msg_id:1});
		}else{
			var row = [];
				
			for(var i = 0; i < rowSize; i++ ){
				for(var j = 0; j < colSize; j++ ){
					row[j] = parseInt( data.shift() );	
				}
			this.data[i] = row;
			row = [];
			}
		}
	};
};

var M = JSMathExt.matrix ;
if(Math)Math.matrix = M;
