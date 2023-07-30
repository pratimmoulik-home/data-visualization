const data0 = getData();
const data = [];
for(let i = 5; i < data0.length; i += 5) {
  data.push({
    Make: data0[i],
    FuelType: data0[i+1],
    EngineCylinders: data0[i+2],
    AverageHighwayMPG: data0[i+3],
    AverageCityMPG: data0[i+4]
  })
}





const margin = { top: 20, right: 20, bottom: 30, left: 70 };
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("body")
     .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .attr("style", "position: absolute; top: 100px; left: 400px")
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var xScale = d3.scaleLinear().domain([0, d3.max(data, d=> d.EngineCylinders)]).range([0, width]);
var yScale = d3.scaleLinear().domain([0, d3.max(data, d=>d.AverageHighwayMPG)]).range([height, 0]);

// Add X axis to the SVG canvas
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(xScale));

  // Add Y axis to the SVG canvas
svg.append("g")
.call(d3.axisLeft(yScale));

const xAxisGrid = d3.axisBottom(xScale)
  .tickSize(-350)
  .tickFormat("");

const yAxisGrid = d3.axisLeft(yScale)
    .tickSize(-340)
    .tickFormat("");

svg.append("g")
.attr("class", "x axis-grid")
.attr("transform", "translate(0, 350)")
.call(xAxisGrid);

svg.append("g")
.attr("class", "x axis-grid")
.attr("transform", "translate(0, 0)")
.call(yAxisGrid);





function updateScatterplot(selection1, selection2) {
  var filteredData = data

  if(selection1 !== "All") {
     filteredData = data.filter(item => item.FuelType === selection1)
  }
  if(selection2 !== "All") {
    filteredData = filteredData.filter(item => item.Make === selection2)
  }
  console.log(filteredData)
  d3.selectAll("circle").remove();
  svg.selectAll("circle").data(filteredData).enter().append("circle").attr("cx", function (d) {
      return xScale(d.EngineCylinders);
    }).attr("cy", function (d) {
      return yScale(d.AverageHighwayMPG);
    }).attr("r", 5) // Adjust the radius as per your preference
    .attr("fill", function(d) {
      if(d.FuelType=="Electricity") {
        return "green"
      }
      else if(d.FuelType=="Diesel") {
        return "yellow"
      }
      else {
        return "red"
      }
    });
}

updateScatterplot("All", "All");

document.getElementById("dropdown").addEventListener("change", function() {
    var second_val = document.getElementById("second-dropdown").value
    const selectedOption = this.value;
    updateScatterplot(selectedOption, second_val);
});

document.getElementById("second-dropdown").addEventListener("change", function() {
    var second_val = document.getElementById("dropdown").value
    const selectedOption = this.value;
    updateScatterplot(second_val, selectedOption);
});
