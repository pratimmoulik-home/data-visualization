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


function findPecentageOfElectricCars(make, dataset) {
  const totalCars = dataset.filter(car => car.Make === make).length;
  const electricCars = dataset.filter(car => car.Make === make && car.FuelType === 'Electricity').length;
  const percentage = (electricCars / totalCars) * 100;
  return percentage;
}

function fillByPercentElectric(make) {
   const percent = findPecentageOfElectricCars(make, data)
   if(percent < 10) {
      return "red";
   }
   else if(percent >= 10 && percent <20) {
     return "yellow"
   }
   else {
     return "green"
   }
}

const averagesByMake = data.reduce((acc, item) => {
  if (!acc[item.Make]) {
    acc[item.Make] = {
      totalMPG: 0,
      count: 0,
    };
  }
  acc[item.Make].totalMPG += item.AverageHighwayMPG;
  acc[item.Make].count++;
  return acc;
}, {});


// Convert averages to an array of objects
var averageHighwayMPGByMake = Object.entries(averagesByMake).map(([make, { totalMPG, count }]) => ({
  Make: make,
  AverageHighwayMPG: totalMPG / count,
}));

function descend(a,b) {
  return b.AverageHighwayMPG - a.AverageHighwayMPG
}

 averageHighwayMPGByMake= averageHighwayMPGByMake.sort(descend)

const margin = { top: 20, right: 20, bottom: 30, left: 70 };
const width = 1200 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom).attr("style", "overflow: visible");

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3.scaleBand()
  .domain(averageHighwayMPGByMake.map(d => d.Make))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(averageHighwayMPGByMake, d => d.AverageHighwayMPG)])
  .range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis);

g.append("g")
  .attr("class", "y axis")
  .call(yAxis);

xAxisGroup.selectAll("text").style("text-anchor", "end").attr("dx", "-.6em").attr("dy", ".15em").attr("transform", "rotate(-45)").style("font-size", "10px");
g.selectAll(".bar")
  .data(averageHighwayMPGByMake)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.Make))
  .attr("y", d => yScale(d.AverageHighwayMPG))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.AverageHighwayMPG))
  .attr("fill", d=>fillByPercentElectric(d.Make))

svg.append("line")
.attr("x1", 95)
.attr("y1", 170)
.attr("x2", 215)
.attr("y2", 50)
.attr("stroke", "red")
.attr("stroke-width", 2);

svg.append("line")
.attr("x1", 750)
.attr("y1", 300)
.attr("x2", 750)
.attr("y2", 500)
.attr("stroke", "red")
.attr("stroke-width", 2);
