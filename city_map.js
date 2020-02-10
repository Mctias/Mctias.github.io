
function loadCityMap()
{
	//draw the map
	mapG.selectAll('path')
		.data(mapData.features)
		.enter()
		.append("circle")
		.attr("cx", function(d){ return projection([+d.Longitude, +d.Latitude])[0]})
		.attr("cx", function(d){ return projection([+d.Longitude, +d.Latitude])[1]})
		.attr("r", 2)
		.style("fill", "r")
		.attr("class", function(d){return "city"})
		.style('opacity', 0.9);
}