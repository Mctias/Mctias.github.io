var dateParse = d3.timeParse("%Y-%m-%d");
var yearFormat = d3.timeFormat("%Y");
var monthFormat = d3.timeFormat("%m");
var yearMonthFormat = d3.timeFormat("%Y-%m");
var yearMonthDayFormat = d3.timeFormat("%Y-%m-%d");

function calcWorldAvgYearly(startYear, endYear, data)
{
	var sum = 0;
	var numberOfYears;

	for(var i = 0; i < data.length; i++)
	{
		if(data[i].year >= startYear && data[i].year <= endYear)
		{
			sum += data[i].value;
			numberOfYears = i;

		}
	}

	var result = sum/numberOfYears;
	console.log(sum)
	return result;
}

function calcCountryAvgYearly(startYear, endYear, data)
{
	var sum = 0;
	var numberOfYears = endYear - startYear;

	for(var i = 0; i < data.length-1; i++)
	{

		var currentDate = data[i].year;
		//console.log(data[i+1].country)

		if((currentDate >= startYear) && (currentDate <= endYear))
		{
			sum += data[i].value;

			if(data[i+1].year > endYear)
			{
				console.log(data[i].country + "," + (sum/numberOfYears))
				sum = 0;
			}
		}
	}
}

function calcMonthlyAvg(startYear, endYear, data)
{	
	var jan = 0;
		feb = 0;
		mar = 0;
		apr = 0;
		may = 0;
		jun = 0;
		jul = 0;
		aug = 0;
		sep = 0;
		oct = 0;
		nov = 0;
		dec = 0;
	var numberOfYears = endYear - startYear;

	console.log(numberOfYears)

	for(var i = 0; i < data.length; i++)
	{
		var currentYear = yearFormat(data[i].dt);
		var currentMonth = monthFormat(data[i].dt);
		var factor = numberOfYears;

		if((currentYear >= startYear) && (currentYear <= endYear))
		{
			if(currentMonth == "01")
				jan += data[i].AverageTemperature;

			else if(currentMonth == "02")
				feb += data[i].AverageTemperature;

			else if(currentMonth == "03")
				mar += data[i].AverageTemperature;

			else if(currentMonth == "04")
				apr += data[i].AverageTemperature;

			else if(currentMonth == "05")
				may += data[i].AverageTemperature;

			else if(currentMonth == "06")
				jun += data[i].AverageTemperature;

			else if(currentMonth == "07")
				jul += data[i].AverageTemperature;

			else if(currentMonth == "08")
				aug += data[i].AverageTemperature;

			else if(currentMonth == "09")
				sep += data[i].AverageTemperature;

			else if(currentMonth == "10")
				oct += data[i].AverageTemperature;

			else if(currentMonth == "11")
				nov += data[i].AverageTemperature;

			else if(currentMonth == "12")
				dec += data[i].AverageTemperature;

			else
				return;
		}

	}
	
	console.log("01," + jan / factor  + "\n" +
				"02," + feb / factor + "\n" +
				"03," + mar / factor + "\n" +
				"04," + apr / factor + "\n" +
				"05," + may / factor + "\n" +
				"06," + jun / factor + "\n" +
				"07," + jul / factor + "\n" +
				"08," + aug / factor + "\n" +
				"09," + sep / factor + "\n" +
				"10," + oct / factor + "\n" +
				"11," + nov / factor + "\n" +
				"12," + dec / factor + "\n");
 
} 

function calcMonthlyAvgPerCountry(startYear, endYear, data)
{	
	var jan = 0;
		feb = 0;
		mar = 0;
		apr = 0;
		may = 0;
		jun = 0;
		jul = 0;
		aug = 0;
		sep = 0;
		oct = 0;
		nov = 0;
		dec = 0;

	var numberOfYears = endYear - startYear;

	var monthResult = [];
	var countryResult = [];

	for(var i = 0; i < data.length; i++)
	{
		var currentYear = yearFormat(dateParse(data[i].dt));
		var currentMonth = monthFormat(dateParse(data[i].dt));

		if((currentYear >= startYear) && (currentYear <= endYear))
		{
			if(currentMonth == "01")
				jan += data[i].AverageTemperature;

			else if(currentMonth == "02")
				feb += data[i].AverageTemperature;

			else if(currentMonth == "03")
				mar += data[i].AverageTemperature;

			else if(currentMonth == "04")
				apr += data[i].AverageTemperature;

			else if(currentMonth == "05")
				may += data[i].AverageTemperature;

			else if(currentMonth == "06")
				jun += data[i].AverageTemperature;

			else if(currentMonth == "07")
				jul += data[i].AverageTemperature;

			else if(currentMonth == "08")
				aug += data[i].AverageTemperature;

			else if(currentMonth == "09")
				sep += data[i].AverageTemperature;

			else if(currentMonth == "10")
				oct += data[i].AverageTemperature;

			else if(currentMonth == "11")
				nov += data[i].AverageTemperature;

			else if(currentMonth == "12")
				dec += data[i].AverageTemperature;


			if(yearMonthFormat(dateParse(data[i].dt)) == endYear + "-12")
			{
				console.log(
				data[i].Country + "," + "01," + jan / numberOfYears  + "\n" +
				data[i].Country + "," + "02," + feb / numberOfYears + "\n" +
				data[i].Country + "," + "03," + mar / numberOfYears + "\n" +
				data[i].Country + "," + "04," + apr / numberOfYears + "\n" +
				data[i].Country + "," + "05," + may / numberOfYears + "\n" +
				data[i].Country + "," + "06," + jun / numberOfYears + "\n" +
				data[i].Country + "," + "07," + jul / numberOfYears + "\n" +
				data[i].Country + "," + "08," + aug / numberOfYears + "\n" +
				data[i].Country + "," + "09," + sep / numberOfYears + "\n" +
				data[i].Country + "," + "10," + oct / numberOfYears + "\n" +
				data[i].Country + "," + "11," + nov / numberOfYears + "\n" +
				data[i].Country + "," + "12," + dec / numberOfYears + "\n");

 
				jan = 0; 
				feb = 0;
				mar = 0;
				apr = 0;
				may = 0;
				jun = 0;
				jul = 0;
				aug = 0;
				sep = 0;
				oct = 0;
				nov = 0;
				dec = 0;
			}
		}

	}
	
	
 
} 