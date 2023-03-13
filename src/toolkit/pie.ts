import * as d3 from 'd3';
import { IEWChartProps } from '../../types';

export function DrawPie(this: any, svg, config, data: IEWChartProps['data']) {
  const svgEle = d3.select(svg);
  const { left, right, width, height, bottom, top } = config;
  const pie = d3
    .pie()
    .sort(null)
    .value((d: any) => d.value);
  const arcs = pie(data.groups as any);
  let radius;
  if (width <= height) {
    radius = (width - left - right) / 2;
  } else {
    radius = (height - bottom - top) / 2;
  }

  let pieEle: any = svgEle.select('g.pie_ele');
  if (pieEle.empty()) {
    pieEle = svgEle.append('g').attr('class', 'pie_ele');
  }

  const arc = d3
    .arc()
    .innerRadius(0) // 内圈半径
    .outerRadius(radius); // 外圈半径
  svgEle.attr('viewBox', [-width / 2, -height / 2, width, height]);
  const pies = pieEle
    .selectAll('path')
    .data(arcs)
    .join('path')
    .attr('fill', (d, i) => d.data.color)
    .attr('stroke', null)
    .attr('d', arc) // 传入arc生成器会自动计算出每个圆弧片段的起始角度和结束角度
    .attr('style', d => (d.data.choose === true ? 'transform: scale(1.05);' : 'none'));

  if (config.mouse.shadow) {
    pies.attr('filter', d => (d.data.choose === true ? 'url(#fds)' : 'none'));
  }

  if (config.mouse.pieText) {
    // 图上写字
    const labelArc = d3
      .arc()
      .innerRadius(radius * 0.8) // 内圈半径
      .outerRadius(radius); // 外圈半径
    pieEle.selectAll('text').remove();
    pieEle
      .selectAll('text')
      .data(arcs)
      .join('text')
      .attr('font-size', 14)
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .call(text =>
        text
          .append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text(d => (d.data.choose === true ? d.data.label : ''))
      )

      .call(text =>
        text
          .append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill-opacity', 0.7)
          .text(d => (d.data.choose === true ? d.data.value : ''))
      );
  }

  this.pie = pieEle;
}
