var margin = {top: 10, right: 30, bottom: 70, left: 60},
	width = 920 - margin.left + margin.right,
	height = 540 - margin.top - margin.bottom;

var currentCountry;
var colorMode;

//Color gradient
var color;

//Discrete colors 
var numberRange = [-20, -10, 0, 10, 20, 30];
var colorRange = ["#2b8cbe", "#a6bddb", "#ece7f2", "#fee8c8" , "#fdbb84" , "#e34a33"];

//Selects the map div and appends the svg
var mapSvg = d3.selectAll('#mapdiv')
	.append('svg')
	.attr('width', width )
	.attr('height', height );

mapSvg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 8])
    .on("zoom", zoomed));

//Background of the map
mapSvg.append('rect')
	.attr('class', 'background')
	.attr('width', width)
	.attr('height', height)
	.style('fill', "#E6E6FA");

var mapG = mapSvg.append('g');


//Projection for the map
var projection = d3.geoNaturalEarth()
	.scale(150)
	.center([0,20])
	.translate([width / 2, height / 2]);

//Path for the map
var geoPath = d3.geoPath()
	.projection(projection);

//div for the tooltip
var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 0);


//Loads the map depending on the selected mode and time
function loadMap(sliderInput){
	//If the map already has been drawn once remove so they are not drawn on each other (will lag otherwise)
	d3.selectAll('.country').remove();
	d3.selectAll('.choropleth-text').remove();

	
	//Time manipulation mode
	if(document.getElementById("menu").checked)
	{
		//Month input
		var monthSelection = document.getElementById('month_selection');
		var month = monthSelection.options[monthSelection.selectedIndex].value;
	
		//Year input
		var yearSelection = document.getElementById('year_selection');
		var year = yearSelection.options[yearSelection.selectedIndex].value;

		document.getElementById("time-slider-div").style.visibility = "hidden";
		document.getElementById("time-menu").style.visibility = "visible";
	}
	else
	{
		//Month input from slider
		var month = monthFormat(sliderInput);
	
		//Year input form slider
		var year = yearFormat(sliderInput);

		document.getElementById("time-slider-div").style.visibility = "visible";
		document.getElementById("time-menu").style.visibility = "hidden";
	}


	//Mode input
	if(document.getElementById('r1').checked)
		var mode = document.getElementById('r1').value;
	else if(document.getElementById('r2').checked)
		var mode = document.getElementById('r2').value;

	else if(document.getElementById('r3').checked)
		var mode = document.getElementById('r3').value;

	else if(document.getElementById('r4').checked)
		var mode = document.getElementById('r4').value;

	else
		var mode = "averagetempuncertainty";


	//Color mode input
	if(document.getElementById('cs1').checked)
		colorMode = 'unclassed';
	else
		colorMode = 'classed';

	//Clears all the values so they are not remebered when we update the map
	for(var i = 0 ; i < mapData.features.length; i++)
	{
		mapData.features[i].properties.tempData = undefined;
	}

	//The data will depend on the selected mode
	if(mode == 'averagetemp')
	{
		if(monthSelection)
			monthSelection.disabled = false;
		//The color domain depend on the min and max temperatures of the data
		if(colorMode == 'unclassed')
		{
			color = d3.scaleSequential(d3.interpolateRdYlBu)
				.domain(d3.extent(tempData, function(d){ return d.AverageTemperature }).reverse());
		}
		else
		{
			color = d3.scaleLinear()
				.range(colorRange);
			color.domain(numberRange)
		}

		//Adds the average temperature to the matching country
		for(var i = 0; i < tempData.length; i++)
		{
			if(tempData[i].dt == year + "-" + month + '-01')
			{
				var countryName = tempData[i].Country;
				
				for(var k = 0; k < mapData.features.length; k++)
				{
					if(mapData.features[k].properties.name == countryName)
					{
						mapData.features[k].properties.tempData = tempData[i].AverageTemperature;
						mapData.features[k].properties.avgUnc = tempData[i].AverageTemperatureUncertainty;
						break;
					}
				}
			}
		}
	}

	//The data will depend on the selected mode
	if(mode == 'averagetempdeviation')
	{
		//The color domain depend on the min and max temperatures of the data

		if(colorMode == 'unclassed')
		{
			color = d3.scaleSequential(d3.interpolateRdYlBu)
				.domain([5,-5]);
		}
		else
		{
			color = d3.scaleLinear()
				.range(colorRange);
			color.domain(numberRange)
		}
		
		if(monthSelection)
			monthSelection.disabled = false;

		//Adds the average temperature to the matching country
		for(var i = 0; i < tempData.length; i++)
		{
			if(tempData[i].dt == year + "-" + month + '-01')
			{
				var countryName = tempData[i].Country;
				
				for(var k = 0; k < mapData.features.length; k++)
				{
					if(mapData.features[k].properties.name == countryName)
					{
						for(var j = 0; j < monthlyCountryAverages.length; j++)
						{
							if(countryName == monthlyCountryAverages[j].country && month == monthlyCountryAverages[j].month)
							{
								mapData.features[k].properties.tempData = tempData[i].AverageTemperature - monthlyCountryAverages[j].value;
								mapData.features[k].properties.avgUnc = tempData[i].AverageTemperatureUncertainty;
								break;
							}	
						}
					}
				}
			}
		}
	}

	else if(mode == 'averagetempuncertainty')
	{
		//The color domain depend on the min and max temperatures of the data
		color = d3.scaleSequential(d3.interpolateReds)
			.domain(d3.extent([0, 1.88]));
		
		if(monthSelection)
			monthSelection.disabled = false;

		//Adds the average temperature uncertainty to the matching country
		for(var i = 0; i < tempData.length; i++)
		{
			if(tempData[i].dt == year + "-" + month + "-01")
			{
				var countryName = tempData[i].Country;
				
				for(var k = 0; k < mapData.features.length; k++)
				{
					if(mapData.features[k].properties.name == countryName)
					{
						mapData.features[k].properties.tempData = tempData[i].AverageTemperatureUncertainty;
						break;
					}
				}
			}
		}
	}

	else if(mode == 'averagetempdeviationyearly')
	{

		color = d3.scaleSequential(d3.interpolateRdYlBu)
				.domain(d3.extent([-2, 2]).reverse());

		if(monthSelection)
			monthSelection.disabled = true;

		for(var i = 0; i < yearlyCountryTemp.length; i++)
		{
			if(yearlyCountryTemp[i].year == year)
			{
				var countryName = yearlyCountryTemp[i].country;
				
				for(var k = 0; k < mapData.features.length; k++)
				{
					if(mapData.features[k].properties.name == countryName)
					{
						
						for(var j = 0; j < meanTempDataCountry.length; j++)
						{

							if(meanTempDataCountry[j].country == countryName)
								mapData.features[k].properties.tempData = yearlyCountryTemp[i].value - meanTempDataCountry[j].value; 
						}
					}
				}
			}
		}
		
	}

	else 
	{
		if(monthSelection)
			monthSelection.disabled = false;

		if(colorMode == 'unclassed')
		{
			color = d3.scaleSequential(d3.interpolateRdYlBu)
				.domain(d3.extent(yearlyCountryTemp, function(d){ return d.value }).reverse());
		}
		else
		{
			color = d3.scaleLinear()
				.range(colorRange);
			color.domain(numberRange)
		}

		//Adds the average temperature to the matching country
		for(var i = 0; i < yearlyCountryTemp.length; i++)
		{
			if(yearlyCountryTemp[i].year == year)
			{
				var countryName = yearlyCountryTemp[i].country;
				
				for(var k = 0; k < mapData.features.length; k++)
				{
					if(mapData.features[k].properties.name == countryName)
					{
						mapData.features[k].properties.tempData = yearlyCountryTemp[i].value;
						break;
					}
				}
			}
		}	
	}



	//draw the map
	mapG.selectAll('path')
		.data(mapData.features)
		.enter()
		.append('path')
		.attr('d', geoPath)
		.style('stroke', 'black')
		.style('stroke-width', 0.2)
		.style('fill', function(d){
			var value = d.properties.tempData;
			if(value != undefined && value != '')
				return color(value)
			else
				return 'grey';
		})
		.attr('class', function(d){return 'country'})
		.style('opacity', 0.9)
		.on('mouseover', onMouseover)
		.on('mouseout', onMouseout)
		.on('click', onMouseclick)
		.on('contextmenu', onContextMenu);

	mapSvg.append("text")
		.attr("class", "choropleth-text")
		.attr("x", 250)
		.attr("y", 20 )
		.style("fill", "black")
		.style("font-size", "24px")
		.text("Choropleth map of the world");


	drawLegend();

}

//Mouse over map fucntion
function onMouseover(d){

	//Select all countries and reduce their opacity
	d3.selectAll('.country')
		.transition()
		.duration(200)
		.style('opacity', 0.2);

	//Select the marked country and increase the opacity
	d3.select(this)
		.transition()
		.duration(200)
		.style('opacity', 1)
		.style('stroke-width', 1);

	//Show a tooltip when we hover over a country
	tooltip.transition()
		.duration(200)
		.style('opacity', 0.9);

	tooltip.html(d.properties.name + '<br>' + 'Average temperature: ' + d.properties.tempData + ' °C'+ 
		'<br>'+ 'Average temperature uncertainty: ' + d.properties.avgUnc + ' °C')
		.style('left', (d3.event.pageX) + 'px')
		.style('top', (d3.event.pageY - 28) + 'px');
}

function onContextMenu()
{
	d3.event.preventDefault();

	console.log('right click');
}

//Reset when mouse out
function onMouseout(){

	d3.selectAll('.country')
		.transition()
		.duration(200)
		.style('opacity', 0.9)
		.style('stroke-width', 0.2);

	d3.select(this)
		.transition()
		.duration(200)
		.style('opacity', 0.9)
		.style('stroke-width', 0.2);

	tooltip.style('opacity', 0);
}

function onMouseclick(d)
{
	d3.select(this)
		.style('stroke-width', 1.5);

	currentCountry = d.properties.name;

	//We get the data for the specigic country from the data and send it to the country line chart
	var filteredCountry = yearlyCountryTemp.filter(filterCriteria);
	loadCountryLineChart(filteredCountry);
	
	//loadScatterPlot(d.properties.name);
	loadHeatMap(false, currentCountry, true);
	
	function filterCriteria(d)
	{
		return d.country === currentCountry;
	}
}

function zoomed()
{
    mapG.attr("transform", d3.event.transform);
}

function drawLegend()
{
	//Removes the svg so they are not drawn upon eachother
	d3.selectAll("#legend-svg").remove();

	const legendWidth = 820;
	const legendHeigth = 20;
	const legendPadding = 40;

	var index1;
	var index2;

	//Selects the div, appends the svg and so on
	var legendSvg = d3.select("#map-legend")
		.append("svg")
		.attr("width", legendWidth + legendPadding + legendPadding)
		.attr("height", legendHeigth + legendPadding + legendPadding)
		.attr("id", "legend-svg");

	var defs = legendSvg.append("defs");
	//Mode input
	if(document.getElementById('r1').checked)
		var mode = document.getElementById('r1').value;
	else if(document.getElementById('r2').checked)
		var mode = document.getElementById('r2').value;

	else if(document.getElementById('r3').checked)
		var mode = document.getElementById('r3').value;

	else if(document.getElementById('r4').checked)
		var mode = document.getElementById('r4').value;

	else
		var mode = "averagetempuncertainty";



	//I don't know why i need this... but I do
	console.log(mode)
	if(mode == "averagetempuncertainty")
	{
		var legendGradient = defs.append("linearGradient")
			.attr("id", "linear-gradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "0%");

		index1 = 1;
		index2 = 0;
	}
	else
	{
		var legendGradient = defs.append("linearGradient")
			.attr("id", "linear-gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "0%");

		index1 = 0;
		index2 = 1;
	}
		
	
	let noOfSamples = 20;
	let dataRange = color.domain()[1] - color.domain()[0];
	let stepSize = dataRange / noOfSamples;

	console.log(color.domain()[1])

	for(var i = 0; i < noOfSamples; i++)
	{
		legendGradient.append("stop")
			.attr("offset", (i / (noOfSamples - 1)))
			.attr("stop-color", color(color.domain()[0] + (i * stepSize)));
	}

	var legendG = legendSvg.append("g")
		.attr("class", "legendLinear")
		.attr("transform", "translate(" + legendPadding + "," + legendPadding + ")");

	legendG.append("rect")
		.attr("id", "unclassed-legend")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", legendWidth)
		.attr("height", legendHeigth)
		.style("fill", "url(#linear-gradient)");

	legendG.append("text")
		.attr("id", "unclassed-legend")
		.text("Low (" + Math.round(color.domain()[index2]) + " °C)")
		.attr("x", 0)
		.attr("y", legendHeigth - 35)
		.style("font-size", "12px");

	legendG.append("text")
		.attr("id", "unclassed-legend")
		.text("High (" + Math.round(color.domain()[index1]) + " °C)")
		.attr("x", legendWidth)
		.attr("y", legendHeigth - 35)
		.style("text-anchor", "end")
		.style("font-size", "12px");

	if(colorMode == 'classed'){

	d3.selectAll("#unclassed-legend").remove();
		for(var colorV in colorRange)
		{
			legendG.append("rect")
				.attr('id', function(d){return 'classed-legend'})
				.attr("x", 600 + colorV*20)
				.attr("y", legendHeigth - legendPadding / 2)
				.attr("width", 20)
				.attr("height", legendHeigth)
				.attr("fill", function(){
					return(colorRange[colorV]);
				});


			legendG.append("text")
				.attr('id', function(d){return 'classed-legend'})
				.attr("x", 609 + colorV*20)
				.attr("y", legendHeigth + 10)
				.attr("text-anchor", "middle")
				.attr("font-size", "0.7em")
				.style("fill", "black")
				.text(function(){
					return numberRange[colorV];
				});

		}
	}
	else
		d3.selectAll("#classed-legend").remove();
}
