var worldTempData = [];
var tempData = [];
var cityTempData = [];
var yearlyTemp = [];
var yearlyTempUnc = [];
var yearlyCountryTemp = [];
var mapData = [];
var meanTempDataCountry = [];
var monthlyAverages = [];
var monthlyCountryAverages = [];
var dataLoaded = false;
var currentYear = 1750;
var reference;
var sum = 0;
var counter = 0;
var years = [];
var toggleScatter = document.getElementById("toggle-scatter-plot");
var toggleLine = document.getElementById("toggle-line-chart");

var loadText = document.getElementById("load-text");

//Function to load the data and format the varaibles
function loadData()
{
	console.log("jhe");

	d3.csv("data/GlobalLandTemperaturesByCountry.csv").then(function(tempDataIn){
		
		tempDataIn.forEach(function(d){
			d.AverageTemperature = parseFloat(d3.format(".3f")(d.AverageTemperature));
			d.AverageTemperatureUncertainty = parseFloat(d3.format(".3f")(d.AverageTemperatureUncertainty));
	
			//The values of Antarctica are a bit messed up and Åland isn't a country...
			if(!(d.Country == 'Antarctica') && !(d.Country == 'Åland'))
				tempData.push(d)
		});
		loadText.innerHTML = "Loading map data...";

		d3.json("data/world_countries.json").then(function(mapDataIn){

			mapData = mapDataIn;
			loadText.innerHTML = "Loading monthly world data...";

			d3.csv("data/GlobalTemperatures.csv").then(function(worldTempDataIn){
				
				
				worldTempDataIn.forEach(function(d){
					d.dt = d3.timeParse("%Y-%m-%d")(d.dt);

					if(d.AverageTemperature != undefined && d.AverageTemperature != '')
						d.AverageTemperature = parseFloat(d.AverageTemperature);
					
					else
						d.AverageTemperature = 0;
					
					worldTempData.push(d);
				});
				loadText.innerHTML = "Loading yearly world data...";

				d3.csv("data/AvgWorldYearly.csv").then(function(yearlyWorldData){
					

					yearlyWorldData.forEach(function(d){
						d.value = parseFloat(d3.format(".3f")(d.value));
						d.valueUnc = parseFloat(d3.format(".3f")(d.valueUnc));

						yearlyTemp.push(d);
					});
					loadText.innerHTML = "Loading yearly country data...";

					d3.csv("data/AvgCountryYearly.csv").then(function(yearlyCountryData){
						

						yearlyCountryData.forEach(function(d){
							d.value = parseFloat(d3.format(".3f")(d.value));
	
							yearlyCountryTemp.push(d);
						});
							loadText.innerHTML = "Loading monthly city data...";
							
							d3.csv("data/GlobalLandTemperaturesByCity.csv").then(function(cityTempDataIn){
							
	
							cityTempDataIn.forEach(function(d){
								if(d.AverageTemperature != 0)
									d.AverageTemperature = parseFloat(d3.format(".3f")(d.AverageTemperature));
								else
									d.AverageTemperature = parseFloat(d3.format(".3f")(d.AverageTemperature));
	
								cityTempData.push(d);
							});

							d3.csv("data/Avg1960-1990PerCountry.csv").then(function(periodCountryDataIn){

								periodCountryDataIn.forEach(function(d){
									meanTempDataCountry.push(d);
								});


								d3.csv("data/Avg1900-1999MonthlyWorld.csv").then(function(periodWorldMonthlyDataIn){

									periodWorldMonthlyDataIn.forEach(function(d){
										d.value = parseFloat(d3.format(".3f")(d.value));
										monthlyAverages.push(d);
									});

									d3.csv("data/Avg1990-1999MonthlyCountries.csv").then(function(periodCountryMonthlyDataIn){

										periodCountryMonthlyDataIn.forEach(function(d){
											d.value = parseFloat(d3.format(".3f")(d.value));
											if(d.country != "")
												monthlyCountryAverages.push(d);
										});
		
										console.log(monthlyCountryAverages)
										loadMap();
										loadLineGraph();
										loadHeatMap(true, null,  false);
										document.getElementById("content").style.display = "block";
										document.getElementById("loading").style.display = "none";
									});	
								});	
							});	
						});
					});
				});
				
			});
			
		});
		
	});
}


//adds all the average land temperatures per year instead of month
//for(var i = 0; i < worldTempData.length-1; i++)
//{
//	var currentDate = worldTempData[i].dt;
//	var nextDate = worldTempData[i+1].dt;
//	currentDate = d3.timeFormat("%Y")(currentDate);
//	nextDate = d3.timeFormat("%Y")(nextDate)
//	if(currentDate != nextDate)
//	{
//		sum += worldTempData[i].AverageTemperatureUncertainty;
//		yearlyTempUnc[counter] = sum/12;
//		counter += 1;
//		//console.log(sum + ' ' + currentDate);
//		sum = 0;
//		years.push(currentDate);
//
//	}
//	else
//	{
//		//If we don't have a value take the value for the smae month next year
//		if(worldTempData[i].AverageTemperatureUncertainty == '')
//		{
//			worldTempData[i].AverageTemperatureUncertainty = worldTempData[i+12].AverageTemperatureUncertainty;
//		}
//
//		sum += worldTempData[i].AverageTemperatureUncertainty;
//	}
//}	
//for(var i = 0; i < yearlyTempUnc.length; i++)
//{
//	console.log(yearlyTemp[i].value +", " + yearlyTempUnc[i] + ', ' + years[i]);
//}