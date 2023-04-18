import * as d3 from 'd3';
import { IEWChartProps } from '../../types';
import { getXData, showValue } from './formate';

export function DrawXAixs(this: any, canvas, config, data: IEWChartProps['data']) {
  const { left, right, width, height, bottom, top } = config;
  const { start, end, interval } = data.x as any;
  const xData = getXData(start, end, interval);
  const context = canvas.getContext('2d');
  const minX = left,
    maxX = width - right,
    tickSize = 6;
  const func = d3
    .scaleUtc()
    .domain([new Date(start), new Date(end)])
    .range([minX, maxX]);
  const ticksLen = xData.length < 10 ? 5 : 10;
  const allTicks = func.ticks(ticksLen);
  const format = func.tickFormat(ticksLen, '%H:%M:%S');

  context.strokeStyle = 'black';
  context.beginPath();
  allTicks.forEach(d => {
    context.moveTo(func(d), height - bottom);
    context.lineTo(func(d), height - bottom + tickSize);
  });
  context.stroke();

  context.beginPath();
  context.moveTo(minX, height - bottom);
  context.lineTo(maxX, height - bottom);
  context.stroke();

  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = 'black';
  allTicks.forEach(d => {
    context.beginPath();
    context.fillText(format(d), func(d), height - bottom + tickSize);
  });

  this.func = func;
  this.data = xData;
}

export function DrawYAixs(this: any, canvas, config, data: IEWChartProps['data']) {
  const { left, right, width, height, bottom, top } = config;
  const { start, end } = data.y as any;
  const context = canvas.getContext('2d');
  const minX = left,
    maxX = width - right,
    tickSize = 6,
    tickPadding = 3;
  const func = d3
    .scaleLinear()
    .domain([start, end])
    .range([height - bottom, top]);
  const allTicks = func.ticks();
  const format = v => showValue(data.yUnit, v);

  context.strokeStyle = '#c3c3c3';
  context.lineWidth = 0.5;
  context.beginPath();
  allTicks.forEach(d => {
    context.moveTo(minX, func(d));
    context.lineTo(maxX, func(d));
  });
  context.stroke();

  context.textAlign = 'right';
  context.textBaseline = 'middle';
  context.fillStyle = 'black';
  allTicks.forEach(d => {
    context.beginPath();
    context.fillText(format(d), minX - tickSize - tickPadding, func(d));
  });

  this.func = func;
}

export function DrawXBandAixs(this: any, svg, config, data: IEWChartProps['data']) {
  const { left, right, width, height, bottom } = config;
  const svgEle = d3.select(svg);

  let xEle: any = svgEle.select('g.x_axis');
  if (xEle.empty()) {
    xEle = svgEle.append('g').attr('class', 'x_axis');
  }

  const func = d3
    .scaleBand()
    .domain((data.groups as any).map(group => group.label))
    .range([left, width - right])
    .paddingInner(0.1)
    .paddingOuter(0.1);
  const axis = g => g.attr('transform', `translate(0,${height - bottom})`).call(d3.axisBottom(func).tickSizeOuter(0));
  xEle.call(axis);

  this.func = func;
  this.recall = () => {
    xEle.call(axis);
  };
}
