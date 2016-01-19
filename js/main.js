var aboutPopUp;
function closePopup(){
	aboutPopUp.remove();
}
var color = d3.scale.quantize()
				.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
d3.json("data/nepalDistricts.geojson", nepalMap);
function nepalMap(nepal){
var canvas = d3.select("#map")
				.attr("preserveAspectRatio", "xMinYMin meet")
				.append("svg")
				.attr("class", "easyMap")
				.attr("viewBox","0 0 804 621")
				.classed("svg-content-responsive", true); //making the responsive map

var group = canvas.selectAll("g")
					.data(nepal.features)
					.enter()
					.append("g");

var projection = d3.geo.mercator()
					.scale(6000)
					.center([84.985593872070313, 28.465876770019531]);

var geoPath = d3.geo.path()
				.projection(projection);

//plotting the map

var plotDistricts = group.append("path")
			.attr("d", geoPath)
			.attr("fill", "#ccc")
			.attr("stroke", "white")
			.attr("stroke-width", "1px")
			.attr("district", function (d){
				return d.properties.DISTRICT;
			})
			.on("click", mouseClick)
			.on("mouseover", mouseOver)
			// .on("mousemove", mouseMove)
			.on("mouseout", mouseOut);

d3.json("data/choropleth.json", getList);

function getList(data){
	color.domain([0,15]);
	var result = data.map(function (d){
		// console.log(d["district-name"]);
		return d["district-name"];
	});

	d3.selectAll("path").each(function (district){

			//to get the pointer of this district
			var value = d3.select(this);
			// console.log(value.attr("district"));
			var valueAttribute = value.attr("district");
			var districtName = valueAttribute.charAt(0).toUpperCase() + valueAttribute.slice(1).toLowerCase();
			// var districtName = value.attr("district").charAt(0).toUpperCase()+value.attr("district").slice(1).toLowerCase();
			// console.log(districtName);
			var compareResult = result.indexOf(districtName);
			// console.log(compareResult,districtName);
			incCompareRes = compareResult + 1;
			// console.log(incCompareRes);
			if(compareResult > -1){
				value.attr("fill", function (){
						return color(incCompareRes);
				});
			}
			else {
				value.attr("fill", "#ccc");
			}
		});
}


var bodyNode = d3.select("body").node();
var toolTipDiv;

function mouseClick(nepal){
	aboutPopUp = d3.select("body #map")
					.append("div")
					.attr("class","popUp");
	var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase() + nepal.properties.DISTRICT.slice(1).toLowerCase();
}

// function mouseOver(nepal){
// 	toolTipDiv = d3.select("body")
// 					.append("div")
// 					.attr("class", "tooltip");
// }

function mouseOver(nepal){
	toolTipDiv = d3.select("body")
					.append("div")
					.attr("class", "tooltip");
	var districtName = nepal.properties.DISTRICT.charAt(0).toUpperCase() + nepal.properties.DISTRICT.slice(1).toLowerCase();
	var absoluteMousePos = d3.mouse(bodyNode);
	toolTipDiv
			.style("opacity", 0.8)
			.style('left', (absoluteMousePos[0]) + 'px')
			.style('top', (absoluteMousePos[1]) + 'px')
			.style('z-index', 1001)

	d3.json("data/choropleth.json", accessValue);

	var content;

	function accessValue(data){
		// console.log(districtName);
		var result = data.filter(function (d){
			// console.log(d["district-name"]);
			return d["district-name"] == districtName;
		});


		if(result.length === 0){
			content = 	"<div id= 'popUpWrapper'>"
							+ "<div id='popUpTitle'>"
							+ "<h3>Project in Nepal</h3>"
							+ "</div>"

							+ "<div id='popUpContent'>"
								+ "<span class='toolTipTitle'><b>"
								+ districtName +"</b><br><br>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ "No project installed"
								+ "</span>"
								+ "<br>"
							+ "</div>"
						+ "</div>"
					;
		}
		else{
			var dName = result.map(function (d){
				return d["district-name"];
			});
			// console.log(dName);

			var projectName = result.map(function (d){
				return d["project-name"];
			});
			// console.log(projectName);

			var info = result.map(function (d){
				return d['info'];
			});
			// console.log(info);

			var unAgencies = result.map(function (d){
				return d["un-agencies"];
			});
			// console.log(unAgencies);

			var startDate = result.map(function (d){
				return d["start-date"];
			});
			// console.log(startDate);

			var endDate = result.map(function (d){
				return d["end-date"];
			});
			// console.log(endDate);

			var budget = result.map(function (d){
				return d["budget"];
			});
			// console.log(budget);

			content = 	"<div id= 'popUpWrapper'>"
							+ "<div id='popUpTitle'>"
							+ "<h3>Projects in Nepal</h3>"
							+ "</div>"

							+ "<div id='popUpContent'>"
								+ "<span class='toolTipDistrict'><b>"
								+ districtName +"</b><br><br>"
								+ "</span>";
				dName.forEach(function (d,i){

					content = content
								+ "<span class='toolTipColumn'>"
								+ "<b>UN Agencies: </b>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ unAgencies[i] + "<br>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ "<b>Start Date: </b>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ startDate[i] + "<br>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ "<b>End Date: </b>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ endDate[i] + "<br>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ "<b>Budget: </b>"
								+ "</span>"

								+ "<span class='toolTipColumn'>"
								+ budget[i] + "<br>"
								+ "</span>"
								+ "<br>"
							+ "</div>"
						+ "</div>"
				});
				content = content + "</div>" + "</div>";
		}
		toolTipDiv.html(content);
	}
}

function mouseOut(){
	toolTipDiv.remove();
}
var legendWidth = 140, legendHeight = 400;

			var key = d3.select("#mapLegend")
						.append("svg")
						.attr("width", legendWidth)
						.attr("height", legendHeight);

			var legend = key.append("defs")
							.append("svg:linearGradient")
							.attr("id", "gradient")
							.attr("x1", "100%")
							.attr("y1", "0%")
							.attr("x2", "100%")
							.attr("y2", "100%")
							.attr("spreadMethod", "pad");

			legend.append("stop")
					.attr("offset", "0%")
					.attr("stop-color", "#006D2C")
					.attr("stop-opacity", 1);

			legend.append("stop")
					.attr("offset", "100%")
					.attr("stop-color", "#EDF8E9")
					.attr("stop-opacity", 1);

			key.append("rect")
				.attr("width", legendWidth - 100)
				.attr("height", legendHeight - 100)
				.style("fill", "url(#gradient)")
				.attr("transform", "translate(0,10)");

			var minDomain = 0;
			var y = d3.scale.linear()
						.range([300, 0])
						.domain([minDomain, 4]);

			var yAxis = d3.svg.axis()
							.scale(y)
							.orient("right");

			key.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(41,10)")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 30).attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("axis title");
}