import style from "./Graph.module.scss";
import * as d3 from "d3";
import { useCallback, useState, useEffect } from "react";

const PieGraph = ({ data, domains }) => {
  const [svg, setSvg] = useState(null);

  // Await a ref before rendering the graph
  const ref = useCallback((node) => {
    if (node === null) {
    } else {
      setSvg(d3.select(node));
    }
  }, []);

  // Listen for the 'svg' state to be set, once it is, render the graph
  useEffect(() => {
    if (svg !== null) {
      render(data);
    }
  }, [svg]);

  // Svg dimensions
  const width = 300;
  const height = 280;
  const radius = Math.min(width, height) / 2;

  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.value;
    });

  const arc = d3
    .arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 50);

  const key = function (d) {
    return d.data.label;
  };

  function render(data) {
    svg.attr("width", width).attr("height", height).append("g");

    // ----------------------------------
    //     Graph colour range
    // ----------------------------------

    const color = d3
      .scaleOrdinal()
      // .scaleLinear()
      .domain(domains)
      .range([
        "#0d0887",
        "#41049d",
        "#6a00a8",
        "#8f0da4",
        "#b12a90",
        "#cc4778",
        "#e16462",
        "#f2844b",
        "#fca636",
        "#fcce25",
        "#f0f921",
      ]);

    // ----------------------------------
    //      Pie graph slices
    // ----------------------------------

    const slice = svg
      .select(".slices")
      .selectAll("path.slice")
      .data(pie(data), key)
      .enter()
      .insert("path")
      .style("fill", function (d) {
        return color(d.data.label);
      })
      .attr("class", "slice")
      .style("stroke", "#ffffff")
      .style("stroke-width", 0)
      .attr("d", arc)
      .attr("transform", `translate( ${radius - 40}, ${radius - 40} )`);
    slice.exit().remove();

    // The transform offsets the graph by it's radius, otherwise it sets itself @ 0x0 in the svg (the center of the pie graph)

    // ----------------------------------
    //       Legend colour map & text
    // ----------------------------------

    const legend = svg
      .selectAll(".legend")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return "translate(" + (radius + 80) + "," + (i * 15 + 20) + ")";
      })
      .attr("class", "legend");

    legend
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", function (d, i) {
        return color(d.data.label);
      });

    legend
      .append("text")
      .text(function (d) {
        return d.data.label;
      })
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 14);
  }

  return (
    <svg ref={ref}>
      <g className="slices" />
    </svg>
  );
};

export default PieGraph;
