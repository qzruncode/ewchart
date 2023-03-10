import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ConfigContext, mouseMoves } from '..';
import { DrawXAixs, DrawYAixs } from '../toolkit/axis';
import { DrawBrush } from '../toolkit/brush';
import { drawClipPath } from '../toolkit/clip';
import { DrawAreaLine, DrawLine } from '../toolkit/line';
import LineMove from '../toolkit/linemove';
import { DrawPoint } from '../toolkit/point';

function LineChart({ data, id, subscription, type }) {
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
    let lineMove;
    let brush;
    if (chartConfig.width != undefined && svgRef.current != null) {
      const xAixs = new DrawXAixs(svgRef.current, chartConfig, data);
      const yAixs = new DrawYAixs(svgRef.current, chartConfig, data);
      let line;
      if (type === 'arealine') {
        line = new DrawAreaLine(svgRef.current, chartConfig, data, xAixs, yAixs);
      } else if (type === 'line') {
        line = new DrawLine(svgRef.current, chartConfig, data, xAixs, yAixs);
      } else if (type === 'scatter') {
        line = new DrawPoint(svgRef.current, chartConfig, data, xAixs, yAixs);
      }
      drawClipPath(svgRef.current, chartConfig);
      if (chartConfig.mouse) {
        lineMove = new LineMove(svgRef.current, chartConfig, data, xAixs, yAixs);
        mouseMoves.push(lineMove);
      }
      if (chartConfig.select) {
        brush = new DrawBrush(svgRef.current, chartConfig, data, line, xAixs, yAixs);
      }
    }
    return () => {
      lineMove && lineMove.clear && lineMove.clear();
      brush && brush.clear && brush.clear();
    };
  }, [chartConfig, svgRef.current, data]);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default LineChart;
