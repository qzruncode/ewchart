import React, { useContext, useEffect, useRef, useState } from 'react';
import { ConfigContext } from '..';
import { drawTreeNodeShadow } from '../toolkit/shadow';
import { drawTree } from '../toolkit/tree';
import TreeMove from '../toolkit/treemove';
import { zoom } from '../toolkit/zoom';

let globalDrawTree;
let globalTreeZoom;
function TreeChart({ data, id, subscription, treeConfig }) {
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
    let drawTreeRes;
    let treeZoom;
    if (chartConfig.width != undefined && svgRef.current != null) {
      drawTreeRes = drawTree(svgRef.current, chartConfig, data, subscription);
      globalDrawTree = drawTreeRes;
      treeMove = new TreeMove(svgRef.current, drawTreeRes.nodeEles, chartConfig);
      treeZoom = zoom(svgRef.current);
      globalTreeZoom = treeZoom;
      drawTreeNodeShadow(svgRef.current);
    }
    return () => {
      treeMove && treeMove.clear && treeMove.clear();
      drawTreeRes && drawTreeRes.clear && drawTreeRes.clear();
      treeZoom && treeZoom.clear && treeZoom.clear();
      globalDrawTree = null;
      globalTreeZoom = null;
    };
  }, [chartConfig, svgRef.current, data]);

  useEffect(() => {
    treeConfig.lineType && globalDrawTree && globalDrawTree.redrawLinks && globalDrawTree.redrawLinks(treeConfig);
    treeConfig.center && globalTreeZoom && globalTreeZoom.center && globalTreeZoom.center();
    treeConfig.expand && globalDrawTree && globalDrawTree.expand && globalDrawTree.expand(treeConfig);
  }, [treeConfig]);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default TreeChart;
