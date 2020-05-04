//We get the country with the values from the clicker. We perform the average year temperatures operations here.

var countryDataArr = [];
var activeCountries = [];

//Standard margin praxis
var chartMargin = {top: 10, right: 30, bottom: 70, left: 60},
	chartWidth = 920 - chartMargin.left + chartMargin.right,
	chartHeight = 400 - chartMargin.top - chartMargin.bottom;

//Selecting the divs and appends the SVG
var countryChartSvg = d3.select("#country-line-chart")
	.append("svg")
	.attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
	.attr("width", chartWidth + chartMargin.left + chartMargin.right)
	.append("g")
	.attr("transform", 
		"translate(" + chartMargin.left +"," + chartMargin.top +")");

//Gets the remove button
var removeButton = document.getElementById("close-country-line-chart");
removeButton.style.visibility = "hidden";

var colorArray = ["#e41a1c","#377eb8","#4daf4a","#984ea3"];

function loadCountryLineChart(countryData)
{	
	//Deletes tha graph so we don't draw another over it
	removeAll(false);

	//We don'"'t want to draw a country that's already in the chart
	if(!(activeCountries.includes(countryData[0].country)))
	{
		activeCountries.push(countryData[0].country);
		//We don't wanna be able to add more
		if(countryDataArr.length > 3)
		{
			countryDataArr.shift();
			activeCountries.shift();
			countryDataArr.push(countryData);
			
		}
		else
		{
			countryDataArr.push(countryData);
		}
	}
		
	//Calculates the domain of both axis
	var lowestTemp = Number.POSITIVE_INFINITY;
	var highestTemp = Number.NEGATIVE_INFINITY;
	var tmp;
	for (var i=countryDataArr.length-1; i>=0; i--) 
	{
		for(var j = countryDataArr[i].length - 1; j>=0; j--){
			tmp = countryDataArr[i][j].value;
    		if (tmp < lowestTemp) lowestTemp = tmp;
    		if (tmp > highestTemp) highestTemp = tmp;
    	}
	}
    
	var lowestYear = Number.POSITIVE_INFINITY;
	var highestYear = Number.NEGATIVE_INFINITY;
	var tmp;
	for (var i=countryDataArr.length-1; i>=0; i--) 
	{
		for(var j = countryDataArr[i].length - 1; j>=0; j--){
			tmp = countryDataArr[i][j].year;
    		if (tmp < lowestYear) lowestYear = tmp;
    		if (tmp > highestYear) highestYear = tmp;
		}
    	
	}

	removeButton.style.visibility = "visible";

	//Filters the data so we get the data for the relevant country
	var filteredData = yearlyCountryTemp.filter(filterCriteria);

	//X-axis
	var x = d3.scaleLinear()
		.domain([lowestYear, highestYear])
		.range([0, chartWidth]);

	countryChartSvg.append("g")
		.attr("class", "countryX")
		.attr("transform","translate(0," + chartHeight + ")")
		.call(d3.axisBottom(x))
		.append("text")
		.attr("x", chartWidth / 2)
		.attr("y", 35 )
		.style("fill", "black")
		.style("font-size", "14px")
		.text("Year");


	//Y-axis
	var y = d3.scaleLinear()
		.domain([lowestTemp, highestTemp])
		.range([chartHeight, 0]);

	countryChartSvg.append("g")
		.attr("class", "countryY")
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


	//We define the line
	var line = d3.line()
		.x(function(d){ return x(d.year)  })
		.y(function(d){ return y(d.value) });

	//We draw the line in this function
	function drawLine()
	{	
		//Delete all the lines so that they are not drawn upon eachother
		d3.selectAll(".countryLine").remove();
		//Append the path
		for(var i = 0; i < countryDataArr.length; i++)
		{
			countryChartSvg.append("path")
				.datum(countryDataArr[i])
				.attr("class", function(d){return  "countryLine"})
				.attr("id", function(d){return activeCountries[0]})
				.attr("fill", "none")
				.attr("stroke", function(d){ return colorArray[i]})
				.attr("stroke-width", 2)
				.attr("d", line)
				.on("click", onLineClick)
				.on("mouseover", function(d)
					{
						d3.select(this)
							.style("opacity", 0.5);
					})
				.on("mouseout", function(d)
					{
						d3.select(this)
							.style("opacity", 1);
					});
		}
	}

	//Our filter critera
	function filterCriteria(d)
	{
		return d.country === countryDataArr[0];
	}

	//If we click a line we remove it
	function onLineClick(d)
	{
		d3.select(this).remove();

		for(var i = 0; i < activeCountries.length; i++)
		{
			if(activeCountries[i] == d[0].country)
			{
				activeCountries.splice(i, 1);
				countryDataArr.splice(i, 1);
			}
		}

		drawThisLegend();
		drawLine();

		if(activeCountries.length == 0)
			removeAll();
	}

	//Function to draw the legend
	function drawThisLegend()
	{
		d3.selectAll(".country-text").remove();
		for(var i = 0; i < activeCountries.length; i++)
		{
			countryChartSvg.append("text")
				.attr("class", "country-text")
				.attr("x", chartWidth / 6 * i)
				.attr("y", 385)
				.style("text-anchor", "middle") 
				.style("font-weight", "bold") 
				.style("font-size", "19px") 
      			.style("fill", function(d){ return colorArray[i]})
				.text(activeCountries[i]);
		}
		
	}

	
	drawLine();
	drawThisLegend();
}

//Function to remove all elements
function removeAll(isClosed)
{
	d3.selectAll(".countryLine").remove();
	d3.selectAll(".legendRect").remove();
	d3.selectAll(".country-text").remove();
	d3.selectAll(".countryX").remove();
	d3.selectAll(".countryY").remove();
	d3.selectAll(".countryName").remove();
	d3.selectAll(".countryFocus").remove();
	d3.selectAll(".countryChartOverlay").remove();
	d3.selectAll(".scatterY").remove();
	d3.selectAll(".scatterX").remove();
	d3.selectAll(".scatterDot").remove();
	d3.selectAll(".scatterName").remove();
	d3.selectAll(".background-rect").remove();
	d3.selectAll(".country-chart-text").remove();
	
	removeButton.style.visibility = "hidden";
	tooltip.style("opacity", 0);

	if(isClosed)
	{
		countryDataArr = [];
		activeCountries = [];
	}
}
