import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfigContext } from '..';
import { DrawTree } from '../toolkit/tree';

function PieChart({ data, id, subscription }) {
  const svgRef = useRef(null);
  const config = useContext(ConfigContext);
  const [chartConfig, setChartConfig] = useState(config);

  useEffect(() => {
    const box = document.querySelector(`.${id}`);
    setTimeout(() => {
      const w = box ? Number(getComputedStyle(box).width.slice(0, -2)) : undefined;
      if (w !== undefined) {
        setChartConfig(Object.assign({}, chartConfig, { width: w }));
      }
    }, 1);

    const unsub = subscription.subscribe(() => {
      const box = document.querySelector(`.${id}`);
      const w = box ? Number(getComputedStyle(box).width.slice(0, -2)) : undefined;
      if (w !== undefined) {
        setChartConfig(Object.assign({}, chartConfig, { width: w }));
      }
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    // let pieMove;
    if (chartConfig.width != undefined && svgRef.current != null) {
      const drawTree = new DrawTree(svgRef.current, chartConfig, data);
      // if (chartConfig.onMove) {
      //   drawPieShadow(svgRef.current);
      //   pieMove = new PieMove(drawPie.pie, chartConfig);
      // }
    }
    // return () => {
    //   pieMove && pieMove.clear && pieMove.clear();
    // };
  }, [chartConfig, svgRef.current, data]);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default PieChart;
