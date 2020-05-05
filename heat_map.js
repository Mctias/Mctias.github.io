//Inspired and heavily influenced by https://codepen.io/amashamdan/pen/NRWjRB... Thanks!



var removeHeatMapButton = document.getElementById("close-heat-map");

//Standard margin praxis
var heatMapWidth = 1200,
	heatMapHeight = 540;
	heatMapPadding = 70;

//Append the svg to our div
var heatMapSvg = d3.select("#heat_map") 
	.append("svg")
	.attr("width", heatMapWidth)
	.attr("height", heatMapHeight)
	.attr("id", "heatMapSvg")
	.style("background-color", "#E6E6FA")
	.attr("transform", 
		"translate(" + (margin.left + 200) +"," + (margin.top * 5) +")");

var heatMapColors;
var observedCountries = [];

var imageLegend = document.getElementById("image-legend");

function loadHeatMap(firstLoad, country, isDisplayingCountry, sliderData)
{

	//Clear the data and remove all the previously drawn heat maps
	var heatMapData = [];
	removeHeatMap();

	removeHeatMapButton.style.visibility = "visible";
	imageLegend.style.visibility = "visible";

	var place = " the world";
	var number = 1;


	//The values for a country
	//We take the average value - the average values for the time period calculated before
	if(isDisplayingCountry)
	{
		heatMapData = tempData;
		place = country;
		number = 5;
		heatMapColor = d3.scaleSequential(d3.interpolatePlasma)
			.domain(d3.extent([-5, 5]));

		heatMapData = heatMapData.filter(filterCriteria);
		if(!observedCountries.includes(country))
		{
			for(i in heatMapData)
			{
				heatMapData[i].dt = d3.timeParse("%Y-%m-%d")(heatMapData[i].dt);
			}
			for(var i = 0; i < heatMapData.length; i++)
			{
				for(var j = 0; j < monthlyCountryAverages.length; j++)
				{
					if(heatMapData[i].Country == monthlyCountryAverages[j].country && monthFormat(heatMapData[i].dt) == monthlyCountryAverages[j].month && heatMapData[i].AverageTemperature != 0)
					{
						heatMapData[i].AverageTemperature -= monthlyCountryAverages[j].value;
					}	
				}
			
			}
		}
		
	}
	else
	{
		worldTempData.forEach(function(d){
			if(yearFormat(d.dt) >= 1850)
				heatMapData.push(d)
		});
		
		heatMapColor = d3.scaleSequential(d3.interpolatePlasma)
			.domain(d3.extent([-1, 1]));
	}

	//The values the world
	//We take the average value - the average values for the time period calculated before
	//Only on the first load otherwise the values will keep decreasing
	if(firstLoad)
	{
		for(var i = 0; i < heatMapData.length; i++)
		{
			currentMonth = monthFormat(heatMapData[i].dt);
			if(heatMapData[i].AverageTemperature != 0)
			{
				if(currentMonth == "01")
					heatMapData[i].AverageTemperature -= monthlyAverages[0].value;
	
				else if(currentMonth == "02")
					heatMapData[i].AverageTemperature -= monthlyAverages[1].value;
	
				else if(currentMonth == "03")
					heatMapData[i].AverageTemperature -= monthlyAverages[2].value;
	
				else if(currentMonth == "04")
					heatMapData[i].AverageTemperature -= monthlyAverages[3].value;
	
				else if(currentMonth == "05")
					heatMapData[i].AverageTemperature -= monthlyAverages[4].value;
	
				else if(currentMonth == "06")
					heatMapData[i].AverageTemperature -= monthlyAverages[5].value;
	
				else if(currentMonth == "07")
					heatMapData[i].AverageTemperature -= monthlyAverages[6].value;
	
				else if(currentMonth == "08")
					heatMapData[i].AverageTemperature -= monthlyAverages[7].value;
	
				else if(currentMonth == "09")
					heatMapData[i].AverageTemperature -= monthlyAverages[8].value;
	
				else if(currentMonth == "10")
					heatMapData[i].AverageTemperature -= monthlyAverages[9].value;
	
				else if(currentMonth == "11")
					heatMapData[i].AverageTemperature -= monthlyAverages[10].value;
	
				else if(currentMonth == "12")
					heatMapData[i].AverageTemperature -= monthlyAverages[11].value;
	
				else	
					console.log("Something went wrong with the first load of the heat map");
			}	
		}
	}

	//We need the min and max year as variables for the heading
	var maxYear  = d3.max(heatMapData, function(d){ return yearFormat(d.dt)});
	var minYear = d3.min(heatMapData, function(d){ return yearFormat(d.dt)});

	if(country && !observedCountries.includes(country))
		observedCountries.push(country);




	//The x-axis is a linear scale between 1750 and 2014
	var xScale = d3.scaleLinear()
		.domain(d3.extent(heatMapData, function(d) { return yearFormat(d.dt); }))
		.range([heatMapPadding, heatMapWidth - heatMapPadding]);

	
	var xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(25);

	heatMapSvg.append("g")
		.attr("class", "xAxis")
		.attr("transform", "translate(0, "+ (heatMapHeight - heatMapPadding) +")")
		.call(xAxis);

	//The y-axis is a linear axis with twelve months
	var yScale = d3.scaleTime()
		.domain([new Date(0, 0, 1), new Date(0, 11, 31)])
		.range([heatMapPadding, heatMapHeight - heatMapPadding]);

	var yAxis = d3.axisLeft()
		.scale(yScale)
		//.ticks(d3.timeMonths())
		.tickFormat(d3.timeFormat("%b"));

	heatMapSvg.append("g")
		.attr("class", "yAxis")
		.attr("transform", "translate(" + heatMapPadding + ", 0)")
		.call(yAxis)
		.selectAll(".tick text")
		.attr("y", ((heatMapHeight - 2*heatMapPadding)/12) / 2);

	//We append the rectangles
	heatMapSvg.selectAll("rect")
		.data(heatMapData)
		.enter()
		.append("rect")
			.attr("x", function(d, i){
				return xScale(yearFormat(d.dt))
			})
			.attr("y", function(d){ return heatMapPadding + (monthFormat(d.dt) - 1) * ((heatMapHeight - 2*heatMapPadding) / 12); })
			.attr("width", (heatMapWidth - 2*heatMapPadding) / (maxYear - minYear))
			.attr("height", (heatMapHeight - 2*heatMapPadding) / 12)
			.style("fill", function(d){
				if(d.AverageTemperature != 0.00)
					return heatMapColor(d.AverageTemperature);
				else
					return 'black';
			})
			.attr("class", function(d){return "heatMapRect"})
		.on("mouseover", onHeatMapMouseOver)
		.on("mouseleave", onHeatMapMouseLeave);
		
	heatMapSvg.append("text")
		.attr("class", "heatMapText")
		.attr("x", (heatMapWidth / 2) - 325)
		.attr("y", 50 )
		.style("fill", "black")
		.style("font-size", "24px")
		.text("Heatmap of the monthly temperatures " + minYear + "-" + maxYear + " in " + place);


	heatMapSvg.append("text")
		.attr("class", "heatMapText")
		.attr("x", (45))
		.attr("y", heatMapHeight - 15)
		.style("fill", "black")
		.style("font-size", "12px")
		.text("Low (-" + number + " °C)");


	heatMapSvg.append("text")
		.attr("class", "heatMapText")
		.attr("x", (heatMapWidth - 110))
		.attr("y", heatMapHeight - 15)
		.style("fill", "black")
		.style("font-size", "12px")
		.text("High (" + number + " °C)");



	function onHeatMapMouseOver(d)
	{
		d3.select(this)
			.style("fill", "black");

		//Show a tooltip when we hover over a country
		tooltip.transition()
			.duration(200)
			.style('opacity', 0.9);
	
		tooltip.html(yearMonthFormat(d.dt) + "<br>" + "Average temperature: "+ d3.format(".3f")(d.AverageTemperature) + " °C")
			.style('left', (d3.event.pageX) + 'px')
			.style('top', (d3.event.pageY - 28) + 'px');

	}

	function onHeatMapMouseLeave(d)
	{
		d3.select(this)
			.style("fill", function(d){
				if(d.AverageTemperature != 0)
					return heatMapColor(d.AverageTemperature); 
				else
					return "black";

			});

		tooltip.transition()
			.duration(200)
			.style('opacity', 0);
	}

	function filterCriteria(d)
	{
		return (d.Country === country );
	}
	//drawHeatMapLegend();
}

function removeHeatMap()
{
	d3.selectAll(".yAxis").remove();
	d3.selectAll(".xAxis").remove();
	d3.selectAll(".heatMapRect").remove();
	//d3.selectAll(".heatMapGradient").remove();
	d3.selectAll(".heatMapText").remove();
	removeHeatMapButton.style.visibility = "hidden";
	imageLegend.style.visibility = "hidden";
}

