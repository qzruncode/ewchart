import React, { useEffect, useLayoutEffect, useState } from 'react';
import './index.less';
import LineChart from './chart/LineChart';
import { IEWChartProps } from '../types';
import { throttle } from './toolkit/helper';
import Subscription from './toolkit/subscription';
import { getColors } from './toolkit/color';

const defaultConfig = { height: 400, top: 20, right: 30, bottom: 30, left: 50, width: undefined };
export const ConfigContext = React.createContext(defaultConfig);

function EWChart(props: IEWChartProps) {
  const [subscription] = useState(new Subscription());
  const [id] = useState(() => 'ewchart-' + new Date().getTime() + Math.random().toString(36).substring(2));

  useEffect(() => {
    const fn = throttle(() => {
      subscription.publish();
    });
    window.addEventListener('resize', fn);
    return () => {
      window.removeEventListener('resize', fn);
    };
  }, []);

  useLayoutEffect(() => {
    initColor();
  }, [props.data]);

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
        return <LineChart data={props.data} id={id} subscription={subscription} />;
      default:
        return null;
    }
  };

  return (
    <div className={id}>
      {props.data.groups.length === 0 ? (
        <div className="null-box" style={{ height: props.size.height }}>
          暂无数据
        </div>
      ) : (
        <ConfigContext.Provider value={Object.assign({}, defaultConfig, props.size, { onMove: props.onMove })}>
          {getChart()}
        </ConfigContext.Provider>
      )}
    </div>
  );
}
export const getColorsByIndex = getColors;
export default EWChart;
