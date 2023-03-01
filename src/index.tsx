import React, { useEffect, useState } from 'react';
import LineChart from './chart/LineChart';
import { IEWChartProps } from '../types';
import getColors from './toolkit/color';

const defaultConfig = { height: 400, top: 20, right: 30, bottom: 30, left: 50, width: undefined };
export const ConfigContext = React.createContext(defaultConfig);

function EWChart(props: IEWChartProps) {
  const [id] = useState(() => 'ewchart_' + new Date().getTime() + Math.random().toString(36).substring(2));

  useEffect(() => {
    initColor();
    // window.addEventListener('resize', () => {
    //   console.log('执行了');
    // });
  }, []);

  const initColor = () => {
    const setColors = data => {
      data.forEach((item, index) => {
        item.color || (item.color = getColors(index));
      });
    };

    if (props.data.groups) {
      setColors(props.data.groups);
    }
  };

  const getChart = () => {
    const chart = props.chart;
    switch (chart.type) {
      case 'line':
        return <LineChart data={props.data} id={id} />;
      default:
        return null;
    }
  };

  return (
    <div className={id}>
      <ConfigContext.Provider value={Object.assign({}, defaultConfig, props.size)}>{getChart()}</ConfigContext.Provider>
    </div>
  );
}

export default EWChart;
