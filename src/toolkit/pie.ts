import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export function DrawPie(this: any, svg, config, data: IEWChartProps['data']) {
  const svgEle = d3.select(svg);
  const { left, right, width, height, bottom, top } = config;
  const pie = d3
    .pie()
    .sort(null)
    .value((d: any) => d.value);
  const arcs = pie(data.groups);
  let radius;
  if (width <= height) {
    radius = (width - left - right) / 2;
  } else {
    radius = (height - bottom - top) / 2;
  }

  let pieEle = svgEle.select('g.pie_ele');
  if (pieEle.empty()) {
    pieEle = svgEle.append('g').attr('class', 'pie_ele');
  }

  const arc = d3
    .arc()
    .innerRadius(0) // 内圈半径
    .outerRadius(radius); // 外圈半径
  svgEle.attr('viewBox', [-width / 2, -height / 2, width, height]);
  pieEle
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('fill', (d, i) => d.data.color)
    .attr('stroke', null)
    .attr('d', arc) // 传入arc生成器会自动计算出每个圆弧片段的起始角度和结束角度
    .attr('style', d => (d.data.choose === true ? 'transform: scale(1.05);' : 'none'));
  // .attr('filter', d => (d.data.choose === true ? 'url(#fds)' : 'none'))

  this.pie = pieEle;
}
