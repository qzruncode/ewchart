import React, { Suspense, useEffect, useRef, useState } from 'react';
import LineChart from './chart/LineChart';
import { IEWChartProps } from '../types';

const defaultConfig = { height: 400, top: 20, right: 30, bottom: 30, left: 50 };
export const ConfigContext = React.createContext(defaultConfig);

function EWChart(props: IEWChartProps) {
  const chartRef = useRef(null);
  const [chartConfig, setChartConfig] = useState(defaultConfig);

  useEffect(() => {
    setChartConfig(Object.assign(chartConfig, props.size, { width: getChartWidth() }));
  }, []);

  const getChart = () => {
    const chart = props.chart;
    switch (chart.type) {
      case 'line':
        return <LineChart data={props.data} />;
      default:
        return null;
    }
  };

  const getChartWidth = () => {
    if (chartRef.current) {
      const chartWidth = Number(getComputedStyle(chartRef.current).width.slice(0, -2));
      return chartWidth;
    }
    return null;
  };

  return (
    <div ref={chartRef}>
      <ConfigContext.Provider value={chartConfig}>{getChart()}</ConfigContext.Provider>
    </div>
  );
}

export default EWChart;
