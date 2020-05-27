import * as d3 from "d3";
import "d3-scale";
import "d3-axis";

const DUMMY_DATA = [
  { id: "d1", region: "USA", value: 10 },
  { id: "d2", region: "India", value: 12 },
  { id: "d3", region: "China", value: 11 },
  { id: "d4", region: "Germany", value: 6 }
];

let unselectedIds = [];

const MARGIN = { top: 20, bottom: 10 };
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

let selectedData = DUMMY_DATA;

const xScale = d3
  .scaleBand()
  .domain(DUMMY_DATA.map(d => d.region))
  .rangeRound([0, CHART_WIDTH])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(DUMMY_DATA, d => d.value + 3)])
  .range([CHART_HEIGHT, 0]);

const container = d3
  .select("svg")
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom);

const chart = container.append("g");

chart
  .append("g")
  .call(d3.axisBottom(xScale).tickSizeOuter(0))
  .attr("transform", `translate(0, ${CHART_HEIGHT})`)
  .attr("color", "#4f0033");

function renderChart() {
  chart
    .selectAll(".bar")
    .data(selectedData, d => d.id)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", xScale.bandwidth())
    .attr("height", data => CHART_HEIGHT - yScale(data.value))
    .attr("x", data => xScale(data.region))
    .attr("y", data => yScale(data.value));

  chart
    .selectAll(".bar")
    .data(selectedData)
    .exit()
    .remove();

  chart
    .selectAll(".label")
    .data(selectedData, d => d.id)
    .enter()
    .append("text")
    .text(d => d.value)
    .attr("x", data => xScale(data.region) + xScale.bandwidth() / 2)
    .attr("y", data => yScale(data.value) - 20)
    .attr("text-anchor", "middle")
    .classed("label", true);

  chart
    .selectAll(".label")
    .data(selectedData)
    .exit()
    .remove();

  const listItems = d3
    .select("#data")
    .select("ul")
    .selectAll("li")
    .data(selectedData)
    .enter()
    .append("li");

  listItems.append("span").text(d => d.region);

  listItems
    .append("input")
    .attr("type", "checkbox")
    .attr("checked", true)
    .on("change", data => {
      if (unselectedIds.indexOf(data.id) === -1) {
        unselectedIds.push(data.id);
      } else {
        unselectedIds = unselectedIds.filter(id => id !== data.id);
      }
      selectedData = DUMMY_DATA.filter(d => unselectedIds.indexOf(d.id) === -1);
      console.log(selectedData);
      renderChart();
    });
}

renderChart();
