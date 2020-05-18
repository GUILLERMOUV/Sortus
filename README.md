# sortus
    // SORTUS     V1.0
    //
    // Sortus is a multiple keys sort js. Order by dates, numerically or alphabetically
		// Aditionally SortusTotals returns the columns totals that you ask.
		//
		// How Sortus works ?
		//     It get two parameters. The main array to sort and the order array.
		//     Sortus return an ordered array as request.
		// 
		//     Parameter 1:
		//     It's an object or array to order.
		//
		//     Parameter 2:
		//     It's an array with the name of the keys to order.
		//     This is the simple sintaxis for the second parameter;
		//         By example; ("name+A","birthday-D",edge+N) 
		//                  means order by name asc alphabetically then by
		//                                 birthday desc by Date, then by
		//                                 edge asc Numerically.
		//      Sintaxis:
		//      [keyName][+ or -][A (alphabetically) or N (numerically) or D (date)], [nextKey][+ or -]....
		//
		//      By default the order is ascending and alphabetically
		//
		// Some examples;
		//
		// (name, edge, birthday) Order by name, then by edge and then by birthday all them 
		//                        asc and alphabetically.
		// (edge+, name-)         Order by edge asc alphabetically, then by name desc alphabetically.
		// (edge+N, name)         Order by edge asc numerically then by name asc alphabetically.
		// (edge-N, birthday+D)   Order by edge desc numerically then by birthday asc by date.
		//
		// (edge+N, name, birthday-D, class, zipcode+N) Order by edge asc Numerically then by name asc
		//                          alphabetically then by birthday desc by date then by class asc 
		//                          alphabetically then by zipcode asc numerically.
		//
		// 
		// SORTUS_TOTALS
		// Aditionally SortusTotals return the column's totals
		// How sortusTotals works ?
		//     It get two parameters. The main array to sort and the totals array.
		//     SortusTotals return an array with the totals asked.
		// 
		//     Parameter 1:
		//     It's an object or array to totalize.
		//
		//     Parameter 2:
		//     It's an array with the name of the keys to totalize.
		//     This is the simple sintaxis for the second parameter;
		//         By example; ("description", "stock*") 
		//                  means count the rows in description. Add the content of every row in stock
		//                                 
		//      Sintaxis:
		//      [keyName][*],[keyName][*],[keyName][*].....
		//
		//      By default it will count the rows. If you put the asterisc then it add the amount.
		//       
		// Some SortusTotals examples:
		// 
		// (name, city, sales)     Return the number of rows in name, also return the number of rows in
		//                         city, also return the number of rows in sales.
		// 
		// (stock*, zipCode)      Return the addition of the stock, also return the number of 
    //                        rows in zipCode.
    //    
    // Author: Guillermo Gerardo Ugalde Vergara  2018 - 2020     
