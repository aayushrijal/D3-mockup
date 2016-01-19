// for line graph
var colors = d3.scale.category10();
	var widthOfLineGraph = 500;
	var heightOfLineGraph = 350;

	var svgLineGraph = d3.select("#lineGraph")
				.append("svg")
				.attr("class","lineGraph")
				.attr("id", "visualization");

	var visLineGraph = d3.select("#visualization"),
				margin = {
					top: 20, right:20, bottom:20, left: 50
				};

	var xScaleLineGraph = d3.scale.ordinal().rangeRoundBands([0,widthOfLineGraph - 50], 0);

	var yScaleLineGraph = d3.scale.linear()
				.range([heightOfLineGraph - margin.top, margin.bottom]);

	var xAxisLineGraph = d3.svg.axis()
					.orient("bottom")
					.scale(xScaleLineGraph)
					.ticks(2);

	var yAxisLineGraph = d3.svg.axis()
					.orient("left")
					.scale(yScaleLineGraph);

	d3.json("data/line.json", function (error, data){
		data.forEach(function (d){
			d.year = d.year;
			d.sale = +d.sale;
			d.targets= +d.targets;
		});

		xScaleLineGraph.domain(data.map(function (d) { return d.year; }));
		yScaleLineGraph.domain([1,4]);

		visLineGraph.append("svg:g")
			.attr("class","axis")
			.attr("transform", "translate(" + (margin.left) + "," + (heightOfLineGraph - margin.bottom)+ ")")
			.call(xAxisLineGraph);

		visLineGraph.append("svg:g")
			.attr("class","axis")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(yAxisLineGraph);

		var lineGen = d3.svg.line()
					.x(function (d) {
						return xScaleLineGraph(d.year);
					})
					.y(function (d) {
						return yScaleLineGraph(d.sale);
					});
					// .interpolate("basis");
		visLineGraph.append('svg:path')
			.attr('d', lineGen(data))
			.attr("transform", "translate(" + (margin.left + 60) + ",0)")
			.attr("stroke", "teal")
			.attr("stroke-width", 2)
			.attr("fill", "none");

		var targetLineGraph = d3.svg.line()
					.x(function (d) {
						return xScaleLineGraph(d.year);
					})
					.y(function (d) {
						return yScaleLineGraph(d.targets);
					});

		visLineGraph.append('svg:path')
			.attr('d', targetLineGraph(data))
			.attr("transform", "translate(" + (margin.left + 60) + ",0)")
			.attr("stroke", "red")
			.style("stroke-dasharray", ("6, 3"))
			.attr("stroke-width", 2)
			.attr("fill", "none");

		visLineGraph.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			.filter(function (d) {
				return d.sale;
			})
			.attr("r", 5)
			.attr("fill", "red")
			.attr("cx", function (d){
				return xScaleLineGraph(d.year) + (margin.left + 60);
			})
			.attr("cy", function (d){
				return yScaleLineGraph(d.sale);
			});
	});