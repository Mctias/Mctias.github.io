/*Label data */
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
var years = [];
for(var i = 1750; i < 2011; i++)
    i % 10 === 0 ? years.push(i) : years.push('');

/* Create the chart */
var chart = circularHeatChart()
    .segmentHeight(5)
    .innerRadius(20)
    .numSegments(12)
    .domain([50, 200])
    .range(['white', 'blue'])
    .segmentLabels(months)
    .radialLabels(years);

d3.select('#circular_heatmap')
    .selectAll('svg')
    .data([rainfallData])
    .enter()
    .append('svg')
    .call(chart);