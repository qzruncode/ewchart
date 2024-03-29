import React, { useEffect, useLayoutEffect, useState } from 'react';
import './index.less';
import LineChart from './chart/LineChart';
import { IEWChartProps } from '../types';
import { throttle } from './toolkit/helper';
import Subscription from './toolkit/subscription';
import { getColors } from './toolkit/color';
import PieChart from './chart/PieChart';
import Histogram from './chart/HistogramChart';
import TreeChart from './chart/TreeChart';
import CanvasLineChart from './chart/CanvasLineChart';
import CanvasSvgLineChart from './chart/CanvasSvgLineChart';

const defaultConfig = {
  height: 400,
  top: 20,
  right: 30,
  bottom: 30,
  left: 50,
  width: undefined,
  onMove: null,
  onSelect: null,
  onClick: null,
  group: undefined,
  mouse: null,
  select: null,
};
export const ConfigContext = React.createContext(defaultConfig);

export const mouseMoves: Array<any> = [];
function EWChart(props: IEWChartProps) {
  const [subscription] = useState(new Subscription());
  const [id] = useState(() => 'ewchart-' + new Date().getTime() + Math.random().toString(36).substring(2));

  useEffect(() => {
    const fn = throttle(() => {
      subscription.publish();
    });
    window.addEventListener('resize', fn);
    return () => {
      mouseMoves.splice(0, mouseMoves.length);
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
    const type = props.type;
    switch (type) {
      case 'line':
      case 'arealine':
      case 'scatter':
      case 'candlestick': {
        if (props.renderer === 'canvas') {
          return <CanvasLineChart data={props.data} id={id} subscription={subscription} type={type} />;
        } else if (props.renderer === 'canvas+svg') {
          return <CanvasSvgLineChart data={props.data} id={id} subscription={subscription} type={type} />;
        } else {
          return <LineChart data={props.data} id={id} subscription={subscription} type={type} />;
        }
      }

      case 'pie':
        return <PieChart data={props.data} id={id} subscription={subscription} />;
      case 'histogram':
        return <Histogram data={props.data} id={id} subscription={subscription} />;
      case 'tree':
        return <TreeChart data={props.data} id={id} subscription={subscription} treeConfig={props.treeConfig} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={id + (props.className ? ` ${props.className}` : '')}
      style={Object.assign({}, { position: 'relative' }, props.style ? props.style : {})}>
      {props.data.groups && props.data.groups.length === 0 && props.data.treeData == undefined ? (
        <div className="null-box" style={{ height: props.size ? props.size.height : defaultConfig.height }}>
          暂无数据
        </div>
      ) : (
        <ConfigContext.Provider value={Object.assign({}, defaultConfig, props.size, props.method, props.interactive)}>
          {getChart()}
        </ConfigContext.Provider>
      )}
    </div>
  );
}
export const getColorsByIndex = getColors;
export default EWChart;
