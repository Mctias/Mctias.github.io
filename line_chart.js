//Standard margin praxis
var margin = {top: 10, right: 30, bottom: 70, left: 60},
	chartWidth = 920 - margin.left + margin.right,
	chartHeight = 400 - margin.top - margin.bottom;

//Appends the svg
var mainChartSvg = d3.select("#line-graph")
	.append("svg")
	.attr("height", chartHeight + margin.top + margin.bottom)
	.attr("width", chartWidth + margin.left + margin.right)
	.append("g")
	.attr("transform", 
		"translate(" + margin.left +"," + margin.top +")");

//Hide/Show unc
var showUnc = document.getElementById("c2");



function loadLineGraph()
{	
	removeTrendPlot();
	

	//Hide/Show the line
	var lineSelection = document.getElementById("c1").checked;
	document.getElementById("hide-unc").style.visibility = "visible";
	showUnc.style.visibility = "visible";

	

	//X-axis
	var x = d3.scaleLinear()
		.domain(d3.extent(yearlyTemp, function(d) { return d.year; }))
		.range([0, chartWidth]);

	var  bisectDate = d3.bisector(function(d) { return d.year; }).left;
		
	mainChartSvg.append("g")
		.attr("class", "x")
		.attr("transform", "translate(0," + chartHeight + ")")
		.call(d3.axisBottom(x))
		.append("text")
		.attr("x", chartWidth / 2)
		.attr("y", 35 )
		.style("fill", "black")
		.style("font-size", "14px")
		.text("Year");

	//Y-axis
	var y = d3.scaleLinear()
		.domain([4, d3.max(yearlyTemp, function(d){ return +d.value; })])
		.range([chartHeight, 0]);

	mainChartSvg.append("g")
		.attr("class", "y")
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

	var line = d3.line()
		.x(function(d){ return x(d.year) })
		.y(function(d) { return y(d.value)});

	var upperUncBound = d3.area()
		.x(function(d){ return x(d.year) })
		.y0(function(d){ return y(d.value + d.valueUnc) })
		.y1(function(d){ return y(d.value)});

	var lowerUncBound = d3.area()
		.x(function(d){ return x(d.year)})
		.y0(function(d) { return y(d.value)})
		.y1(function(d){ return y(d.value - d.valueUnc)});

	//Append the path of the line
	mainChartSvg.append("path")
		.datum(yearlyTemp)
		.attr("class", function(d){return "area-unc"})
		.style("fill", "red")
		.style("opacity", 0.4)
		.attr("d", upperUncBound)
		.attr("clip-path", "url(#rect-clip)");

	mainChartSvg.append("path")
		.datum(yearlyTemp)
		.attr("class", function(d){return "area-unc"})
		.style("fill", "red")
		.style("opacity", 0.4)
		.attr("d", lowerUncBound)
		.attr("clip-path", "url(#rect-clip)")

	
	mainChartSvg.append("path")
		.datum(yearlyTemp)
		.attr("class", function(d){return "line"})
		.style("fill", "none")
		.style("opacity", 1)
		.attr("stroke", "#4b4b4b")
		.attr("stroke-width", 1.8)
		.attr("d", line);



	var focus = mainChartSvg.append("g")
		.attr("class", "focus")
		.style("display", "none");

	focus.append("line")
		.attr("class", "x-hover-line hover-line")
		.attr("y1", 0)
		.attr("y2", chartHeight)
		.style("stroke", "black");

	focus.append("circle")
		.attr("r", 6)
		.style("stroke", "blue")
		.attr("stroke-width", 1.5)
		.style("fill", "white");

	mainChartSvg.append("rect")
		.attr("transform", "translate(" + (margin.left - 60) + "," + (margin.top - 10) + ")")
		.attr("class", "overlay")
		.attr("width", chartWidth )
		.attr("height", chartHeight)
		.style("opacity", 0)
		.on("mouseover", function(){ focus.style("display", null); })
		.on("mouseout", function(){ focus.style("display", "none"); tooltip.style("opacity", 0); })
		.on("mousemove" , mousemove);


	//The focus should follow the mouse
	function mousemove(d)
	{
		var x0 = x.invert(d3.mouse(this)[0]),
			i=bisectDate(yearlyTemp, x0, 1),
			d0 = yearlyTemp[i - 1]
			d1 = yearlyTemp[i]
			d = x0 - d0.year > d1.year - x0 ? d1:d0;
		focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
		//focus.select("text")
		//	.text(function(){ return (d.value + " " + d.year); });
		focus.select(".x-hover-line")
			.attr("y2", chartHeight - y(d.value));
		focus.select(".y-hover-line")
			.attr("x2", chartWidth + chartWidth);

		d3.select(this)
			.style("fill", "black");

		//Show a tooltip when we hover over the line
		tooltip.transition()
			.duration(200)
			.style("opacity", 0.9);
	
		if(showUnc.checked)
		{
			tooltip.html("Year: " +  d.year +"<br>" +" Average temperature: " + d.value + " °C"
					+"<br>" + "Average temperature uncertainty: " + d.valueUnc + " °C" )
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		}	
		else
		{
			tooltip.html("Year: " +  d.year +"<br>" +" Average temperature: " + d.value + " °C")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		}
	}


	if(!lineSelection)
	{
		removeTrendPlot();
	}

	if(!showUnc.checked)
	{
		d3.selectAll(".area-unc").remove();
	}	
		
}
function removeTrendPlot()
{
	//Deletes tha graph so we don"t draw another over it
	d3.selectAll(".line").remove();
	d3.selectAll(".area-unc").remove();
	d3.selectAll(".x").remove();
	d3.selectAll(".y").remove();
	d3.selectAll(".focus").remove();
	d3.selectAll(".overlay").remove();
	document.getElementById("hide-unc").style.visibility = "hidden";
	showUnc.style.visibility = "hidden";
}


