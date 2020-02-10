var scatterSvg = d3.select("#country-line-chart")
	.append("svg")
	.attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
	.attr("width", chartWidth + chartMargin.left + chartMargin.right)
	.append("g")
	.attr("transform", 
		"translate(" + chartMargin.left +"," + chartMargin.top +")");


function loadScatterPlot(country)
{
	removeAll();

	toggleLine.style.visibility = "visible";
	removeButton.style.visibility = "visible";

	var filteredData = yearlyCountryTemp.filter(filterCriteria);

	var x = d3.scaleLinear()
		.domain(d3.extent(filteredData, function(d){ return d.year }))
		.range([0, chartWidth]);

	color = d3.scaleSequential(d3.interpolateRdYlBu)
				.domain(d3.extent(filteredData, function(d){ return d.value }).reverse());
				
	countryChartSvg.append("g")
		.attr("class", "scatterX")
		.attr("transform","translate(0," + chartHeight + ")")
		.call(d3.axisBottom(x))
		.append("text")
		.attr("x", chartWidth / 2)
		.attr("y", 35 )
		.style("fill", "black")
		.style("font-size", "14px")
		.text("Year");

    var y = d3.scaleLinear()
    	.domain([d3.min(filteredData, function(d){ return d.value }), d3.max(filteredData, function(d){ return d.value })])
    	.range([chartHeight, 0]);
    
    countryChartSvg.append("g")
    	.attr("class", "scatterY")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
      	.attr("y", -50)
      	.attr("x", -175)
      	.attr("dy", "1em")
      	.style("text-anchor", "middle")  
      	.style("fill", "black")
      	.style("font-size", "14px")
		.text("Temperature in °C");

    countryChartSvg.append("g")
    	.selectAll("dot")
    	.data(filteredData)
    	.enter()
    	.append("circle")
    		.attr("cx", function(d){ return x(d.year)})
    		.attr("cy", function(d){ return y(d.value)})
    		.attr("r", 3)
    		.style("fill", function(d){ return color(d.value)})
    		.attr("class", function(d){return "scatterDot"})
    		.style("stroke", "black")
    		.style("stroke-width", 0.5)
    	.on("mouseover", scatterHover)
    	.on("mouseout", scatterLeave);

    countryChartSvg.append("text")
		.attr("class", "scatterName")
		.attr("x", chartWidth / 2)
		.attr("y", 7)
		.style("fill", "black")
		.style("font-size", "18px")
		.text(country);

	function filterCriteria(d)
	{
		return d.country === country;
	}

	function scatterHover(d)
	{
		d3.select(this)
			.transition()
			.duration(200)
			.attr("r", 6)

		tooltip.transition()
			.duration(200)
			.style("opacity", 0.9);
	
		tooltip.html("Year: " +  d.year +"<br>" +" Average temperature: " + d.value + " °C")
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
	}

	function scatterLeave(d)
	{
		d3.select(this)
			.transition()
			.duration(200)
			.attr("r", 3)


		tooltip.transition()
			.duration(200)
			.style("opacity", 0);
	}
}
