import * as d3 from 'd3';
import { IEWChartProps } from '../../types';
import { getXData } from './formate';

export const drawXAixs = (svg, config, data: IEWChartProps['data']) => {
  const { left, right, width, height, bottom } = config;
  if (width) {
    const { start, end, interval } = data.x;
    const xData = getXData(start, end, interval);
    const svgEle = d3.select(svg);
    const func = d3
      .scaleUtc()
      .domain([new Date(start), new Date(end)])
      .range([left, width - right]);
    const axis = g =>
      g.attr('transform', `translate(0,${height - bottom})`).call(
        d3
          .axisBottom(func)
          .ticks(xData.length < 10 ? 5 : 10)
          .tickSizeOuter(0)
          .tickFormat(d3.timeFormat('%H:%M') as any)
      );
    svgEle.call(axis);
  }
};
