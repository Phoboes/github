import { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./Graph.module.scss";

const Graph = ({ languages }) => {
  let ref = useRef();

  const data = [];

  for (const [key, value] of Object.entries(languages)) {
    const splitObj = {};
    splitObj["label"] = `${key}`;
    splitObj["value"] = `${value}`;
    data.push(splitObj);
  }

  const innerRadius = 50;
  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };
  const radius = 100;
  const width = 2 * radius + margin.left + margin.right;
  const height = 2 * radius + margin.top + margin.bottom;

  useEffect(() => {
    drawChart();
  }, data);

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateWarm)
    .domain([0, data.length]);

  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    // Remove the old svg
    d3.select("#pie-container").select("svg").remove();

    // Create new svg
    const svg = d3
      .select("#pie-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);

    const arc = svg.selectAll().data(pieGenerator(data)).enter();

    // Append arcs
    arc
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (_, i) => colorScale(i))
      .style("stroke", "#ffffff")
      .style("stroke-width", 2);

    // Append text labels
    // arc
    //   .append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .text((d) => d.data.label)
    //   .style("fill", (_, i) => colorScale(data.length - i))
    //   .attr("transform", (d) => {
    //     const [x, y] = arcGenerator.centroid(d);
    //     return `translate(${x}, ${y})`;
    //   });

    var labelArc = d3
      .arc()
      .outerRadius(radius - 40)
      .innerRadius(innerRadius - 40);

    arc
      .append("text")
      //   .attr("text-anchor", "middle")
      //   .attr("alignment-baseline", "middle")
      .text((d) => d.data.label)
      .style("fill", (_, i) => colorScale(data.length - i))
      .attr("transform", function (d) {
        var c = labelArc.centroid(d);
        return "translate(" + c[0] * 1 + "," + c[1] * 1 + ")";
      });
  }

  console.log(data);

  //   console.log(d3);

  return (
    <div className={styles["pie-container"]} id="pie-container" ref={ref}></div>
  );
};

export default Graph;
