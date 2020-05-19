import Vue from 'vue'

export default {
	
	install(Vue, options){

		// SORTUS               V2.0
		// ES UN SORT. ORDENA ALFABETICO, NUMERICO Y FECHAS.
		//
		// COMO FUNCIONA: RECIBE LA MATRIZ PRINCIPAL CON RENGLONES Y COLUMNAS
		// A ORDENAR COMO OBJETO. Y RECIBE OTRO ARRAY CON LOS NOMBRES (string) DE LAS
		// COLUMNAS QUE SE ORDENARÁN CON EL SIGUIENTE FORMATO:
		//
		//    ORDENARÁ LA PRIMER COLUMNA DE ESTE ARRAY Y ASI SUCESIVAMENTE
		//    CADA COLUMNA PUEDE TERMINAR HASTA CON 2 CARACTERES ADICIONALES,
		//    EL PRIMERO SERÁ UN SIGNO SEÑALANDO EL ORDEN (+ ASCENDENTE O - DESCENDENTE)
		//    EL SEGUNDO PODRÁ SER UNA LETRA (A ALFANUMERIC, N NUMERIC, D DATE).
		//    SI SE OMITEN EL DEFAULT SERÁ ASCENDENTE Y ALFANUMERICO.
		//
		// EJEMPLOS:
		// (articulo, talla, peso) ORDENARÁ PRIMERO POR ARTICULO, DESPÚES POR TALLA Y
		//                         LUEGO POR PESO. TODOS ALFABETICAMENTE Y ASCENDENTE
		// (peso+, articulo-)      ORDENARA PRIMERO POR PESO ASCENDENTE, DESPUÉS POR 
		//                         ARTÍCULO DESCENDENTEMENTE.
		// (talla+N, articulo)     ORDENARÁ PRIMERO POR TALLA ASCENDENTE Y NUMERICAMENTE
		//                         Y DESPÚES POR ARTÍCULO ASCENDENTE ALFABETICAMENTE.
		// (talla-N, uso+D)        ORDENARÁ PRIMERO POR TALLA DESCENDENTE Y NUMERICAMENTE
		//                         Y DESPÚES POR USO ASCENDENTE Y TOMARÁ ESTE CAMPO COMO FECHA.
		// (talla+n, articulo-, uso-d) ORDENARÁ PRIMERO POR TALLA ASCENDENTE NUMERICO,
		//                         DESPUÉS POR ARTÍCULO DESCENDENTE ALFABETICO Y POR ÚLTIMO
		//                         POR USO DESCENDENTE Y TOMARÁ ESTE CAMPO COMO FECHA.
		//
		// 
		// SORTUS_TOTALS
		// Es la parte que regresa los totales de las columnas recibidas
		// COMO FUNCIONA; RECIBE LA MATRIZ PRINCIPAL CON RENGLONES Y COLUMNAS
		// A TOTALIZAR COMO OBJETO. Y RECIBE OTRO ARRAY CON LOS NOMBRES (STRING) DE LAS
		// COLUMNAS QUE SE TOTALIZARAN CON EL SIGUIENTE FORMATO
		//     
		//    TOTALIZARA LA PRIMER COLUMNA DE ESTE ARRAY Y ASI SUCESIVAMENTE
		//    CADA COLUMNA. PODRA TERMINAR CON UN * PARA INDICAR QUE ESTA COLUMNA
		//    SE SUMARA EN LUGAR DE SOLO CONTAR LOS RENGLONES.
		//
		// EJEMPLOS:
		// (nombre, ciudad, venta) CONTARA CUANTOS REGISTROS HAY DE CADA UNA DE ESTAS COL
		// 
		// (existencia*, codigo)   SUMARA LAS CANTIDADES DE existencia Y DESPUES CONTARA CUANTOS
		//                         codigo HAY.
	    // 
		// Author: Ing: Guillermo Gerardo Ugalde Vergara  2018 - 2020     

		// variables globales
	    var columna = '';
		var direccion = '+';
		var tipo = 'A';

		var matriz = [];
		var columnasAordenar = [];

		var matrizT = [];
		var columnasAtotalizar = [];

		Vue.prototype.$sortus = function (matrizPrincipal, columnasQueSeOrdenaran) {
			var x,y,x1,y1;
			var renglon;

			if(!matrizPrincipal || matrizPrincipal == "") {
				console.log("SORTUS parameter1 not present");
				return "SORTUS Parameter 1 not present";
			}
			if(!columnasQueSeOrdenaran || columnasQueSeOrdenaran == "") {
				console.log("SORTUS parameter2 not present");
				return "SORTUS Parameter 2 not present";
			}

			// LA MATRIZ A ORDENAR LLEGA COMO OBJETO
			matriz = matrizPrincipal; // es necesaria para manejarla local
			columnasAordenar = columnasQueSeOrdenaran;// es necesaria para manejarla local
			
			desglosar(columnasAordenar[0]) // pasa el primer elemento

			// delRenglonNum, alRenglonNum, enColNum,indiceCol
			sortusInicia(0, matriz.length - 1, columna, 0);			
		
			return matriz;  // regresa matriz ya ordenada
			
  		}

		Vue.prototype.$sortusTotals = function (matrizRecibida, columnasQueSeTotalizaran) {
			// sortus-totals suma el importe de las columnas especificadas 
			// en el arreglo columnasQueSeTotalizaran sobre la matrizRecibida

			// Valida si existen los 2 parametros
			if(!matrizRecibida || matrizRecibida == "") {
				console.log("SortusTotals parameter1 not present");
				return "SortusTotals Parameter 1 not present";
			}
			if(!columnasQueSeTotalizaran || columnasQueSeTotalizaran == "") {
				console.log("SortusTotals parameter2 not present");
				columnasQueSeOrdenaran = ["0"];// le da un valor por default columna 0
			}

			var columnasConTotales = [];

			for (var indice in columnasQueSeTotalizaran){// recorre el arreglo que trae los nombres de las col que se totalizaran
				
				var nombreDeLaColumna = columnasQueSeTotalizaran[indice];// es el nombre de la col que se totalizara
				var sumaCol = 0;
				var sumar = false;

				// checa si se sumara o se contara esta columna
				if(nombreDeLaColumna.includes("*")){
					nombreDeLaColumna = nombreDeLaColumna.replace("*","");
					sumar = true;
				}

				// recorre la matriz. Empieza por los renglones
				for(var indice in matrizRecibida){					
					var renglon = matrizRecibida[indice];

					// recorremos un renglon, los campos
					for(var columnaDelRenglon in renglon){

						if(columnaDelRenglon == nombreDeLaColumna){// checa si es columna a totalizar
							
							var contenido = renglon[columnaDelRenglon];

							// checa si se contara o se sumara
							if(sumar){
								sumaCol = sumaCol + Number(contenido);
							}
							else sumaCol = sumaCol + 1;
						}
					}					
				}

				// agrega el total de la columna al arreglo de totales de columnas
				columnasConTotales.push(sumaCol);
				sumaCol = 0;
			}

			// regresa el arreglo con los totales

			return columnasConTotales;			
  		}


		function desglosar(elemento){
		    // Separa la columna y decide si es ascendente o descendente y si es fecha, numero o alfabetico el ordenamiento
		    // cada vez que se llama 
		    // cambia las variables globales columna, direccion y tipo
		    
		    columna = '';
		    direccion = '+';
		    tipo = 'A';

		    if ( !elemento.includes("+") && !elemento.includes("-") )
			{  // solo hay caracteres
		       	columna = elemento;
		       	direccion = '+';   // + ASCENDENTE
		       	tipo = 'A';        // Alfabetico o Numerico o Date
		    }
		    else{ // escanea para saber cual es la parte antes del mas o menos
		    	var n = 0;

		    	if (elemento.includes('+')) {
		    		n = elemento.indexOf('+');
		      	}
		    	if (elemento.includes("-")) {
		    		n = elemento.indexOf("-");
		    	}

		        columna = elemento.substring(0, n );
		        direccion = elemento.substring(n, n+1);

		        if (n + 1 == elemento.length){
		    		tipo = 'A'
		    	}
		    	else{
		    		tipo = elemento.slice(-1);
		    	}		    		
		    }
		}

		function sortusInicia(delRenglon, alRenglon, enLaColumnaNum, indiceCol){
			// se lama cada vez que se requiere ordenar registros

		    desglosar(columnasAordenar[indiceCol])

			sortusOrdena (delRenglon, alRenglon, columna, direccion, tipo);
			sortusIguales(delRenglon, alRenglon -1 , columna, indiceCol);
		
		}

	 	function sortusOrdena(desde1, alRenglon, en_columna1, dir1, tipo1){
	    	var ordenando = 1;
	        var cambio = "";
			var el_renglon1 = 0;
			var uno, dos = '';

		    while (ordenando == 1) {

		        cambio = "NO";
		        el_renglon1 = Number(desde1);

		        while (Number(el_renglon1) <= Number(alRenglon) -1) {

					uno = matriz[el_renglon1][en_columna1];

		            try{    	
						dos = matriz[el_renglon1 + 1][en_columna1];
		            }	
		            catch(error){
		                dos = uno;
		            }

		            if (tipo.toUpperCase() == 'A' || ( !tipo.toUpperCase() == 'D' && !tipo.toUpperCase() == 'N') ) {
			            // ES ALFABETICO
			            
			            if (direccion.includes('-')){ // ES ORDEN DESCENDENTE 
	 						if  (uno.toUpperCase() < dos.toUpperCase()){ // hace el intercambio
	                       		//matriz[el_renglon1][en_columna1] = dos;
	                    		//matriz[el_renglon1 + 1][en_columna1] = uno;
	                    		var renglonMomentaneo = matriz[el_renglon1];	
	                    		matriz[el_renglon1]	=  matriz[el_renglon1 + 1];
	                    		matriz[el_renglon1 + 1]	=  renglonMomentaneo;
			                	cambio = "SI";		            
							}
			            }else{ // ES ORDEN ASCENDENTE
	 						if  (uno.toUpperCase() > dos.toUpperCase()){ // hace el intercambio
	                       		//matriz[el_renglon1][en_columna1] = dos;
	                    		//matriz[el_renglon1 + 1][en_columna1] = uno;	 							
	                    		var renglonMomentaneo = matriz[el_renglon1];	
	                    		matriz[el_renglon1]	=  matriz[el_renglon1 + 1];
	                    		matriz[el_renglon1 + 1] =  renglonMomentaneo;
			                	cambio = "SI";		            
							}		            	
			            }
			        }

			        if (tipo.toUpperCase() == 'N'){
			            // ES NUMERICO EL ORDEN DE LA COLUMNA.

			            if (direccion.includes('-')){ // ES ORDEN DESCENDENTE 
	 						if  (Number(uno) < Number(dos)){ // hace el intercambio
	                       		//matriz[el_renglon1][en_columna1] = dos;
	                    		//matriz[el_renglon1 + 1][en_columna1] = uno;	
	                    		var renglonMomentaneo = matriz[el_renglon1];	
	                    		matriz[el_renglon1]	=  matriz[el_renglon1 + 1];
	                    		matriz[el_renglon1 + 1] =  renglonMomentaneo;	                    			                	
			                	cambio = "SI";		            
							}
			            }else{       // ES ORDEN ASCENDENTE
	 						if  (Number(uno) > Number(dos)){ // hace el intercambio
	                       		//matriz[el_renglon1][en_columna1] = dos;
	                    		//matriz[el_renglon1 + 1][en_columna1] = uno;		 
	                    		var renglonMomentaneo = matriz[el_renglon1];	
	                    		matriz[el_renglon1]	=  matriz[el_renglon1 + 1];
	                    		matriz[el_renglon1 + 1] =  renglonMomentaneo;	                    		               	
			                	cambio = "SI";		            
							}		            	
			            }
			        }

			        if (tipo.toUpperCase() == 'D'){
			            // ES FECHAS (viene en formato AAAA-MM-DD HH:MM:SS)
			            var fecha1 = new Date(uno);
			            var fecha2 = new Date(dos);

			            var fech1 = fecha1.getTime(); // a milisegundos
						var fech2 = fecha2.getTime(); // a milisegundos

			            if (direccion.includes('-')){ // ES ORDEN DESCENDENTE 
	 						if  (fech1 < fech2) { // hace el intercambio
	                       		// matriz[el_renglon1][en_columna1] = dos;
	                    		// matriz[el_renglon1 + 1][en_columna1] = uno;
	                    		var renglonMomentaneo = matriz[el_renglon1];	
      				       		matriz[el_renglon1]	=  matriz[el_renglon1 + 1];
	                    		matriz[el_renglon1 + 1] =  renglonMomentaneo;	                    		            	
			                	cambio = "SI";		            
							}
			            }else{ // ES ORDEN ASCENDENTE
	 						if  (fech1 > fech2) { // hace el intercambio
	                       		//matriz[el_renglon1][en_columna1] = dos;
	                    		//matriz[el_renglon1 + 1][en_columna1] = uno;
	                    		var renglonMomentaneo = matriz[el_renglon1];	
	                    		matriz[el_renglon1]	=  matriz[el_renglon1 + 1];
	                    		matriz[el_renglon1 + 1] =  renglonMomentaneo;	                    				                	
			                	cambio = "SI";		            
							}		            	
			            }
			        }

		            el_renglon1 = Number(el_renglon1) + 1;

		        }    

		        if (cambio == "NO"){
		            ordenando = 0; 
		        }
		    }
		    	    
		}


		function sortusIguales(desde_renglon, hasta_renglon, en_columna, indiceCol)
		{
		    var hay_iguales ='no';
		    var iguales = 1;
		    var el_primer_igual = 'si';
		    var igual_hasta, igual_desde = 0;
		    var cont_renglon = Number(desde_renglon);
		    var este, x, y, siguiente, existe = 0;

		    while (cont_renglon <= Number(hasta_renglon) + 1) {
		        // lee los elementos a comparar como iguales
		        try{
					x = matriz[Number(cont_renglon)];
					este = x[en_columna];
		        }
		        catch(err){
		        	este = 'fuera del limite';
		        }

		        try{
					y = matriz[Number(cont_renglon) + 1];
					siguiente = y[en_columna];
		        }
		        catch(err){
		            siguiente = 'ya fin';
		        }

		        if (este == siguiente){
		            hay_iguales ='si';
		            iguales = iguales + 1;

		            if (el_primer_igual == 'si'){
		                igual_desde = Number(cont_renglon);
		                el_primer_igual = 'no';
		            }
		        }

		        if (este != siguiente && hay_iguales == 'si'){
		            igual_hasta = Number(igual_desde) + Number(iguales) -1;

		            try{	   
		                desglosar(columnasAordenar[indiceCol + 1]);
       	                existe = matriz[0][Number(columna + 1)];
		            }
		            catch(err){
		                existe = 'no';
		            }

		            if (existe != 'no'){
       	                desglosar(columnasAordenar[indiceCol + 1]);
		                sortusInicia(Number(igual_desde), Number(igual_hasta), columna, indiceCol + 1);
		            }

		            iguales = 1;
		            el_primer_igual = 'si';
		            hay_iguales = 'no';
		        }

		        cont_renglon = Number(cont_renglon) +1;
		        
		    }
		}

	}
}
