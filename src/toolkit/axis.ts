import * as d3 from 'd3';
import { IEWChartProps } from '../../types';
import { getXData, showValue } from './formate';

export function DrawXAixs(this: any, svg, config, data: IEWChartProps['data']) {
  const { left, right, width, height, bottom } = config;
  const { start, end, interval } = data.x;
  const xData = getXData(start, end, interval);
  const svgEle = d3.select(svg);

  let xEle = svgEle.select('g.x_axis');
  if (xEle.empty()) {
    xEle = svgEle.append('g').attr('class', 'x_axis');
  }

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
  xEle.call(axis);

  this.func = func;
  this.data = xData;
}

export function DrawYAixs(this: any, svg, config, data: IEWChartProps['data']) {
  const { left, right, width, height, bottom, top } = config;
  const { start, end } = data.y;
  const svgEle = d3.select(svg);
  let yEle = svgEle.select('g.y_axis');
  if (yEle.empty()) {
    yEle = svgEle.append('g').attr('class', 'y_axis');
  }

  const func = d3
    .scaleLinear()
    .domain([start, end])
    .range([height - bottom, top]);

  const axis = g =>
    g
      .attr('transform', `translate(${left},0)`)
      .call(
        d3
          .axisRight(func)
          .tickFormat(v => showValue(data.yUnit, v))
          .tickSize(width - left - right)
      )
      .call(g => g.select('.domain').remove())
      .call(g =>
        g.selectAll('.tick line').attr('stroke-opacity', 0.5).attr('stroke-width', 0.5).attr('stroke', '#c3c3c3')
      )
      .call(g => g.selectAll('.tick text').attr('x', -30).attr('dy', -4));

  yEle.call(axis);

  this.func = func;
}
