

var moving = false;
//var playButton = d3.select("#play-button");
var timeFormat;
var defaultDate;

function loadTimeSlider()
{
  d3.selectAll(".time-slider").remove();


  if(document.getElementById('r3').checked || document.getElementById('r4').checked)
  { 
    var dataTime = d3.range(0, 164).map(function(d) {
       return new Date(1850 + d, 0, 1);});
    timeFormat = d3.timeFormat('%Y');
    defaultDate = new Date(1850, 0, 1)
  }
  else
  {
    var dataTime = d3.range(0, 264).map(function(d) {
      return new Date(1750 + d, 0, 1);});
    timeFormat = d3.timeFormat('%Y %m'); 
    defaultDate = new Date(1750, 0, 1);
  }
  
  //The slider for the map
  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 * 24 * 31)
    .width(900)
    .tickFormat(timeFormat)
    .tickValues('')
    .default(defaultDate)
    .on('onchange', val => {
      d3.select('p#value-time').text("in " + d3.timeFormat('%Y %m')(val));
      loadMap(val);
    });
  
  //Box for the slider
  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 1000)
    .attr('height', 75)
    .attr("class", "time-slider")
    .append('g')
    .attr('transform', 'translate(15,17)');
  
  gTime.call(sliderTime);
  
  d3.select('p#value-time').text("in " + d3.timeFormat('%Y %m')(sliderTime.value()));
}

