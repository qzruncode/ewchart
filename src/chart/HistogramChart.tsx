import React from 'react';
import { useRef, useContext, useState, useEffect } from 'react';
import { ConfigContext } from '..';
import { DrawXBandAixs, DrawYAixs } from '../toolkit/level1/axis';
import { drawClipPath } from '../toolkit/level1/clip';
import { DrawHistogram } from '../toolkit/histogram';
import HistogramMove from '../toolkit/histogrammove';

function HistogramChart({ data, id, subscription }) {
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
    let histogramMove;
    if (chartConfig.width != undefined && svgRef.current != null) {
      const xAixs = new DrawXBandAixs(svgRef.current, chartConfig, data);
      const yAixs = new DrawYAixs(svgRef.current, chartConfig, data);

      const drawHistogram = new DrawHistogram(svgRef.current, chartConfig, data, xAixs, yAixs);
      drawClipPath(svgRef.current, chartConfig);

      if (chartConfig.onMove) {
        histogramMove = new HistogramMove(svgRef.current, drawHistogram, chartConfig, data);
      }
    }

    return () => {
      histogramMove && histogramMove.clear && histogramMove.clear();
    };
  }, [chartConfig, svgRef.current, data]);

  return <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" width="100%" height={chartConfig.height}></svg>;
}

export default HistogramChart;
