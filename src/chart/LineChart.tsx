import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ConfigContext } from '..';
import { DrawXAixs, DrawYAixs } from '../toolkit/axis';
import { drawClipPath } from '../toolkit/clip';
import { DrawLine } from '../toolkit/line';
import mouseMove from '../toolkit/move';

function LineChart({ data, id, subscription }) {
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
    let clear;
    if (chartConfig.width != undefined && svgRef.current != null) {
      const xAixs = new DrawXAixs(svgRef.current, chartConfig, data);
      const yAixs = new DrawYAixs(svgRef.current, chartConfig, data);
      const line = new DrawLine(svgRef.current, chartConfig, data, xAixs, yAixs);
      drawClipPath(svgRef.current, chartConfig);
      clear = mouseMove(svgRef.current, chartConfig, data, xAixs, yAixs);
    }
    return () => {
      clear && clear();
    };
  }, [chartConfig, svgRef.current, data]);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default LineChart;
