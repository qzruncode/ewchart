import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfigContext } from '..';
import { DrawTree } from '../toolkit/tree';
import TreeMove from '../toolkit/treemove';
import { zoom } from '../toolkit/zoom';

function TreeChart({ data, id, subscription }) {
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
    let treeMove;
    let drawTree;
    let treeZoom;
    if (chartConfig.width != undefined && svgRef.current != null) {
      drawTree = new DrawTree(svgRef.current, chartConfig, data, subscription);
      treeMove = new TreeMove(svgRef.current, drawTree.nodeEles, chartConfig);
      treeZoom = zoom(svgRef.current);
    }
    return () => {
      treeMove && treeMove.clear && treeMove.clear();
      drawTree && drawTree.clear && drawTree.clear();
      treeZoom && treeZoom.clear && treeZoom.clear();
    };
  }, [chartConfig, svgRef.current, data]);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default TreeChart;
