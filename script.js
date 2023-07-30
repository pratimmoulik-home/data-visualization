function saveFuelType(myString) {
  localStorage.setItem('FuelType', myString)
}



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
console.log(data)
const averagesByFuelType = data.reduce((acc, item) => {
  if (!acc[item.FuelType]) {
    acc[item.FuelType] = {
      totalMPG: 0,
      count: 0,
    };
  }
  acc[item.FuelType].totalMPG += item.AverageHighwayMPG;
  acc[item.FuelType].count++;
  return acc;
}, {});


// Convert averages to an array of objects
const averageHighwayMPGByFuelType = Object.entries(averagesByFuelType).map(([fuelType, { totalMPG, count }]) => ({
  FuelType: fuelType,
  AverageHighwayMPG: totalMPG / count,
}));

console.log(averageHighwayMPGByFuelType)
const margin = { top: 20, right: 140, bottom: 30, left: 80 };
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleBand()
  .domain(averageHighwayMPGByFuelType.map(d => d.FuelType))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(averageHighwayMPGByFuelType, d => d.AverageHighwayMPG)])
  .range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

var xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);



g.append("g")
  .attr("class", "y axis")
  .call(yAxis);



g.selectAll(".bar")
  .data(averageHighwayMPGByFuelType)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.FuelType))
  .attr("y", d => yScale(d.AverageHighwayMPG))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.AverageHighwayMPG))
  .attr("fill", function(d) {
     if(d.FuelType=="Electricity") {
        return "green"
     }
     else if(d.FuelType=="Diesel") {
       return "yellow"
     }
     else {
       return "red";
     }
  })

  svg.append("line")
    .attr("x1", 450)
    .attr("y1", 30)
    .attr("x2", 550)
    .attr("y2", 150)
    .attr("stroke", "red")
    .attr("stroke-width", 2);
