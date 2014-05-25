
window.Chart = function(context, data, options) {

	// The chart itself
	var chart = this;

	// The chart size
	var width	= context.canvas.width	= 1200;
	var height	= context.canvas.height	= 600;

	var paddingLeft		= 30;
	var paddingRight	= 20;
	var paddingTop		= 25;
	var paddingBottom	= 25;

	var top				= paddingTop;
	var bottom			= height - paddingBottom;

	var left			= paddingLeft;
	var right			= width - paddingRight;

	// Interval between values on Y axis
	var dataInterval	= 5;



	// Determine the maximum & minimum values of Y
	function getY() {

		var min = 0;
		var max = 0;

		// Loop through each data set
		for (var maxSet = 0; maxSet < data.dataSets.length; maxSet++ ) {
			// Loop through each data element
			for (var maxElement = 0; maxElement < data.dataSets[maxSet].data.length; maxElement++ ) {
				// If the element is greater than the maxmimum...
				if (data.dataSets[maxSet].data[maxElement] > max) {
					// Make it the new maximum
					max = data.dataSets[maxSet].data[maxElement];
				}
			}
		}

		// Minimum starts at the maximum -- we'll work our way down from there
		min = max;

		// Loop through each data set
		for (var minSet = 0; minSet < data.dataSets.length; minSet++ ) {
			// Loop through each data element
			for (var minElement = 0; minElement < data.dataSets[minSet].data.length; minElement++ ) {
				// If the element is lower than the minimum...
				if (data.dataSets[minSet].data[minElement] < min && data.dataSets[minSet].data[minElement] !== null) {
					// Make it the new minimum
					min = data.dataSets[minSet].data[minElement];
				}
			}
		}

		max = max + max % dataInterval;

		min = min - min % dataInterval;
		if (min < 0) { min = 0; }


		var offset = max - min;

		return {'min': min, 'max': max, 'offset': offset};
	}



	// Determine number of columns
	function getNumCols() {
		return data.labels.length - 1;
	}
	// Determine number of rows
	function getNumRows() {

		return Math.ceil( getY().offset / dataInterval );
	}


	// Determine the position of the given column
	function getColPosition(colNum) {
		return ( (right - left) / getNumCols() ) * colNum;
	}
	// Determine the position of the given row
	function getRowPosition(rowNum) {
		return ( (bottom - top) / getNumRows() ) * rowNum;
	}


	// Determine the height position for the given value
	function getHeightByValue(value) {

		return Math.ceil( (value * (bottom - top)) / getY().offset );

	}


	// Draws a border around the chart
	// 		If drawFullBox is true, draws around all 4 sides
	// 		Otherwise, draws only along the axes
	chart.drawBorder = function(drawFullBox) {

		context.strokeStyle = 'rgba(0,0,0,0.5)';
		context.lineWidth = 2;

		context.beginPath();

		context.moveTo( right, bottom );
		context.lineTo( left, bottom );
		context.lineTo( left, top );

		if (drawFullBox) {
			context.lineTo( right, top );
			context.lineTo( right, right );
		}

		context.stroke();
	};

	chart.drawGrid = function() {

		context.strokeStyle = 'rgba(150,150,150,0.2)';
		context.lineWidth = 1;
		context.beginPath();

		for (var column = 1; column < data.labels.length - 1; column++ ) {
			context.moveTo( left + getColPosition(column), top );
			context.lineTo( left + getColPosition(column), bottom );
		}

		for (var row = 1; row < getY().max / dataInterval; row++) {
			context.moveTo( left, bottom - getRowPosition(row) );
			context.lineTo( right, bottom - getRowPosition(row) );
		}

		context.stroke();

	};

	chart.drawLabels = function() {

		// X axis labels
		context.textAlign = 'center';

		for (var xLabel = 0; xLabel < data.labels.length; xLabel++) {
			context.fillText( data.labels[xLabel], left + getColPosition(xLabel), bottom + 20 );
		}

		// Y axis labels
		context.textAlign = 'right';
		context.textBaseLine = 'middle';

		for (var yLabel = 0; yLabel <= getY().max; yLabel++) {
			context.fillText( yLabel * dataInterval + getY().min, left - 10, 3 + bottom - getRowPosition(yLabel) );
		}

	};


	chart.drawLines = function() {

		context.lineWidth = 3;

		for (var i = 0; i < data.dataSets.length; i++ ) {

			context.beginPath();
			context.strokeStyle = data.dataSets[i].strokeColor;
			context.fillStyle = data.dataSets[i].fillColor;

			for (var j = 0; j < data.dataSets[i].data.length; j++ ) {

				if ( data.dataSets[i].data[j] !== null) {
					if ( j === 0 ) {
						context.moveTo( left + getColPosition(j), bottom - getHeightByValue( data.dataSets[i].data[j] - getY().min ) );
					} else {
						context.lineTo( left + getColPosition(j), bottom - getHeightByValue( data.dataSets[i].data[j] - getY().min ) );

						// context.bezierCurveTo(

						// 	left + getColPosition(j),
						// 	bottom - getHeightByValue( data.dataSets[i].data[j] - getY().min ),

						// 	left + getColPosition(j),
						// 	bottom - getHeightByValue( data.dataSets[i].data[j] - getY().min ),

						// 	left + getColPosition(j),
						// 	bottom - getHeightByValue( data.dataSets[i].data[j] - getY().min )
						// );
					}

					lastHadValue = j;
				}

			}

			context.stroke();

			context.lineTo( left + getColPosition(lastHadValue), bottom );
			context.lineTo( left, bottom );

			context.lineTo( left, bottom - getHeightByValue( data.dataSets[i].data[0] ) );

			context.fill();

		}
	};


	chart.drawPoints = function() {

		for (var i = 0; i < data.dataSets.length; i++ ) {

			context.strokeStyle = data.dataSets[i].pointStroke;
			context.fillStyle = data.dataSets[i].pointColor;
			context.lineWidth = 1;

			for (var j = 0; j < data.dataSets[i].data.length; j++ ) {

				if ( data.dataSets[i].data[j] !== null ) {
					context.beginPath();

					context.arc( left + getColPosition(j), bottom - getHeightByValue( data.dataSets[i].data[j] - getY().min ), 4, 0, 2*Math.PI );

					context.fill();
					context.stroke();
				}
			}
		}
	};


	// chart.debug = function() {
	// 	console.debug('Y Limits: {min: ' + getY().min + ', max: ' + getY().max + '}');
	// 	console.debug('Number of {rows: ' + getNumRows() + ', cols: ' + getNumCols() + '}');
	// }
	//

	chart.drawAll = function() {
		chart.drawBorder();
		chart.drawGrid();
		chart.drawLabels();
		chart.drawLines();
		chart.drawPoints();
	};

};