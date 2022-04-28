import style from "./Graph.module.scss";
import * as d3 from "d3";
import { useRef, useEffect } from "react";

const PieGraph = ({ data, domains }) => {
  const ref = useRef();
  const svg = d3.select(ref.current);

  const dataShuffleHandler = (data) => {
    const returnArr = [];
    for (let i = 0; i < data.length; i++) {
      i % 2 === 0 ? returnArr.unshift(data[i]) : returnArr.push(data[i]);
    }
    return returnArr;
  };

  data = dataShuffleHandler(data);

  useEffect(() => {
    // return () => {
    //   second
    // }
    render(data);
  }, [ref.current]);

  var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

  var pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.value;
    });

  var arc = d3
    .arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

  var outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var key = function (d) {
    return d.data.label;
  };

  var color = d3
    .scaleOrdinal()
    .domain(domains)
    .range([
      "rgb(255,30,100)",
      "rgb(30, 255, 10)",
      "#7b6888",
      "#6b486b",
      "#a05d56",
      "#d0743c",
      "#ff8c00",
    ]);

  function render(data) {
    /* ------- PIE SLICES -------*/
    var slice = svg
      .select(".slices")
      .selectAll("path.slice")
      .data(pie(data), key);
    slice
      .enter()
      .insert("path")
      .style("fill", function (d) {
        return color(d.data.label);
      })
      .attr("class", "slice");

    slice
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    slice.exit().remove();

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labels").selectAll("text").data(pie(data), key);

    text
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function (d) {
        return d.data.label;
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text
      .transition()
      .duration(1000)
      .attrTween("transform", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate(" + pos + ")";
        };
      })
      .styleTween("text-anchor", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    text.exit().remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg
      .select(".lines")
      .selectAll("polyline")
      .data(pie(data), key);

    polyline.enter().append("polyline");

    polyline
      .transition()
      .duration(1000)
      .attrTween("points", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }

  // Await ref.current before render, "css" is the only pie section displaying currently

  if (ref.current !== undefined) {
    render(data);
  }

  console.log(data);

  return (
    <svg ref={ref}>
      <g className="slices" />
      <g className="labels" />
      <g className="lines" />
    </svg>
  );
};

export default PieGraph;
