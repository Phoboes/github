import { useEffect, useRef, useState } from "react";
import styles from "./Graph.module.scss";
import PieGraph from "./PieGraph";

const Index = ({ languages }) => {
  let ref = useRef();

  const [graphState, setGraphState] = useState({
    data: [],
    domains: [],
  });

  //   The graph component that is conditionally rendered
  let graph = null;

  //   Splits the language json into a useable format for d3; [{label: key, value: value}, ...]
  //   Splits out all the keys into a domains array for graph labels
  const dataSetHandler = () => {
    const data = [];
    const domains = [];
    for (const [key, value] of Object.entries(languages)) {
      const splitObj = {};
      splitObj["label"] = `${key}`;
      splitObj["value"] = `${value}`;
      data.unshift(splitObj);
      domains.push(key);
    }
    // Sort by asc. value
    data.sort((a, b) => {
      return b.value - a.value;
    });
    setGraphState({ data, domains });
  };

  //   If the states aren't fully set, set them
  if (graphState.data.length === 0 || graphState.domains.length === 0) {
    dataSetHandler();
  } else {
    //   Otherwise render the graph
    if (graph === null) {
      graph = <PieGraph data={graphState.data} domains={graphState.domains} />;
    }
  }

  return (
    <>
      <div className={styles["pie-container"]} id="pie-container" ref={ref}>
        {graph}
      </div>
    </>
  );
};

export default Index;
